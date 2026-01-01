const { MailerSend, EmailParams, Sender, Recipient, Attachment } = require('mailersend');
const ics = require('ics');
const { v4: uuidv4 } = require('uuid');

let mailerSend = null;

function getMailerSend() {
  if (!mailerSend && process.env.MAILERSEND_API_KEY) {
    mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY
    });
  }
  return mailerSend;
}

function generateICSContent(interview, candidate, interviewer) {
  const start = new Date(interview.scheduledTime.start);
  const end = new Date(interview.scheduledTime.end);

  const event = {
    uid: uuidv4(),
    start: [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes()
    ],
    end: [
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes()
    ],
    title: `Interview: ${candidate.firstName} ${candidate.lastName} with ${interviewer.firstName} ${interviewer.lastName}`,
    description: `${interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview\n\n${interview.notes || ''}${interview.meetingLink ? `\n\nMeeting Link: ${interview.meetingLink}` : ''}`,
    location: interview.meetingLink || 'To be determined',
    organizer: {
      name: process.env.MAILERSEND_FROM_NAME || 'Interview Scheduler',
      email: process.env.MAILERSEND_FROM_EMAIL
    },
    attendees: [
      { name: `${candidate.firstName} ${candidate.lastName}`, email: candidate.email },
      { name: `${interviewer.firstName} ${interviewer.lastName}`, email: interviewer.email }
    ],
    status: 'CONFIRMED',
    busyStatus: 'BUSY'
  };

  return new Promise((resolve, reject) => {
    ics.createEvent(event, (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
}

async function sendInterviewInvite(interview, candidate, interviewer) {
  const client = getMailerSend();
  
  if (!client) {
    console.log('MailerSend not configured, skipping email');
    return { candidate: false, interviewer: false };
  }

  const icsContent = await generateICSContent(interview, candidate, interviewer);
  const startTime = new Date(interview.scheduledTime.start);
  const endTime = new Date(interview.scheduledTime.end);
  
  const formatDate = (date) => date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formatTime = (date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const sentFrom = new Sender(
    process.env.MAILERSEND_FROM_EMAIL,
    process.env.MAILERSEND_FROM_NAME || 'Interview Scheduler'
  );

  const createEmailHtml = (recipient, isCandidate) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .detail-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: 600; width: 120px; color: #666; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Interview Scheduled</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your ${interview.type} interview has been confirmed</p>
        </div>
        <div class="content">
          <p>Hi ${recipient.firstName},</p>
          <p>${isCandidate 
            ? `Your interview with ${interviewer.firstName} ${interviewer.lastName} has been scheduled.`
            : `Your interview with candidate ${candidate.firstName} ${candidate.lastName} has been scheduled.`
          }</p>
          
          <div class="detail-box">
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span>${formatDate(startTime)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span>${formatTime(startTime)} - ${formatTime(endTime)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span>${interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview</span>
            </div>
            ${interview.meetingLink ? `
            <div class="detail-row">
              <span class="detail-label">Meeting:</span>
              <span><a href="${interview.meetingLink}">${interview.meetingLink}</a></span>
            </div>
            ` : ''}
          </div>
          
          ${interview.notes ? `<p><strong>Notes:</strong> ${interview.notes}</p>` : ''}
          
          <p>A calendar invite is attached to this email. Please add it to your calendar.</p>
          
          <div class="footer">
            <p>This is an automated message from Interview Scheduler.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const attachment = new Attachment(
    Buffer.from(icsContent).toString('base64'),
    'interview-invite.ics',
    'attachment'
  );

  const sendEmail = async (recipient, isCandidate) => {
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo([new Recipient(recipient.email, `${recipient.firstName} ${recipient.lastName}`)])
      .setSubject(`Interview Scheduled: ${formatDate(startTime)}`)
      .setHtml(createEmailHtml(recipient, isCandidate))
      .setAttachments([attachment]);

    try {
      await client.email.send(emailParams);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${recipient.email}:`, error.message);
      return false;
    }
  };

  const results = await Promise.allSettled([
    sendEmail(candidate, true),
    sendEmail(interviewer, false)
  ]);

  return {
    candidate: results[0].status === 'fulfilled' && results[0].value,
    interviewer: results[1].status === 'fulfilled' && results[1].value
  };
}

async function sendProposalNotification(interview, candidate, interviewer, proposedSlots) {
  const client = getMailerSend();
  
  if (!client) {
    console.log('MailerSend not configured, skipping email');
    return;
  }

  const formatSlot = (slot) => {
    const start = new Date(slot.start);
    return `${start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const slotsHtml = proposedSlots.map((slot, i) => 
    `<li style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 4px;">Option ${i + 1}: ${formatSlot(slot)}</li>`
  ).join('');

  const sentFrom = new Sender(
    process.env.MAILERSEND_FROM_EMAIL,
    process.env.MAILERSEND_FROM_NAME || 'Interview Scheduler'
  );

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo([new Recipient(candidate.email, `${candidate.firstName} ${candidate.lastName}`)])
    .setSubject('Interview Time Slots Proposed')
    .setHtml(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Interview Time Proposals</h1>
          </div>
          <div class="content">
            <p>Hi ${candidate.firstName},</p>
            <p>We've found some optimal interview times based on your availability and ${interviewer.firstName}'s schedule:</p>
            <ul style="list-style: none; padding: 0;">
              ${slotsHtml}
            </ul>
            <p>Please log in to select your preferred time slot.</p>
            <a href="${process.env.CLIENT_URL}/interviews/${interview._id}" class="btn">Select Time Slot</a>
          </div>
        </div>
      </body>
      </html>
    `);

  try {
    await client.email.send(emailParams);
  } catch (error) {
    console.error('Failed to send proposal notification:', error.message);
  }
}

module.exports = { sendInterviewInvite, sendProposalNotification, generateICSContent };
