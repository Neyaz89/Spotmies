const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, requireRole } = require('../middleware/auth');
const { findOptimalSlots } = require('../services/matchingAlgorithm');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { sendProposalNotification } = require('../services/emailService');

const router = express.Router();

// Find optimal interview slots
router.post('/find-slots', auth, [
  body('candidateId').isMongoId(),
  body('interviewerId').isMongoId(),
  body('duration').optional().isInt({ min: 15, max: 480 }),
  body('interviewType').optional().isIn(['technical', 'behavioral', 'cultural', 'final'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { candidateId, interviewerId, duration, startDate, endDate } = req.body;

    // Verify users exist
    const [candidate, interviewer] = await Promise.all([
      User.findById(candidateId),
      User.findById(interviewerId)
    ]);

    if (!candidate || candidate.role !== 'candidate') {
      return res.status(400).json({ error: 'Invalid candidate' });
    }

    if (!interviewer || interviewer.role !== 'interviewer') {
      return res.status(400).json({ error: 'Invalid interviewer' });
    }

    const options = {
      duration: duration || 60,
      maxSlots: 3
    };

    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);

    const slots = await findOptimalSlots(candidateId, interviewerId, options);

    if (slots.length === 0) {
      return res.status(404).json({ 
        error: 'No matching time slots found',
        message: 'The candidate and interviewer have no overlapping availability. Please update availability and try again.'
      });
    }

    res.json({ 
      slots,
      candidate: {
        id: candidate._id,
        name: `${candidate.firstName} ${candidate.lastName}`
      },
      interviewer: {
        id: interviewer._id,
        name: `${interviewer.firstName} ${interviewer.lastName}`
      }
    });
  } catch (error) {
    console.error('Find slots error:', error);
    res.status(500).json({ error: 'Failed to find matching slots' });
  }
});

// Create interview proposal with matched slots
router.post('/propose', auth, requireRole('interviewer', 'admin'), [
  body('candidateId').isMongoId(),
  body('interviewerId').isMongoId(),
  body('proposedSlots').isArray({ min: 1, max: 3 }),
  body('proposedSlots.*.start').isISO8601(),
  body('proposedSlots.*.end').isISO8601(),
  body('type').optional().isIn(['technical', 'behavioral', 'cultural', 'final']),
  body('notes').optional().isString(),
  body('meetingLink').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { candidateId, interviewerId, proposedSlots, type, notes, meetingLink } = req.body;

    const [candidate, interviewer] = await Promise.all([
      User.findById(candidateId),
      User.findById(interviewerId)
    ]);

    if (!candidate || !interviewer) {
      return res.status(400).json({ error: 'Invalid candidate or interviewer' });
    }

    const interview = new Interview({
      candidate: candidateId,
      interviewer: interviewerId,
      scheduledTime: {
        start: new Date(proposedSlots[0].start),
        end: new Date(proposedSlots[0].end)
      },
      status: 'proposed',
      type: type || 'technical',
      notes,
      meetingLink,
      proposedSlots: proposedSlots.map((slot, index) => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
        score: slot.score || (100 - index * 10)
      }))
    });

    await interview.save();

    // Send notification email
    try {
      await sendProposalNotification(interview, candidate, interviewer, proposedSlots);
    } catch (emailError) {
      console.error('Failed to send proposal email:', emailError);
    }

    res.status(201).json({ interview });
  } catch (error) {
    console.error('Create proposal error:', error);
    res.status(500).json({ error: 'Failed to create interview proposal' });
  }
});

module.exports = router;
