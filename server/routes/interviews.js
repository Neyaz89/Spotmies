const express = require('express');
const { body, validationResult } = require('express-validator');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const { sendInterviewInvite } = require('../services/emailService');

const router = express.Router();

// Get all interviews for current user
router.get('/', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    const query = req.user.role === 'candidate'
      ? { candidate: req.user._id }
      : req.user.role === 'interviewer'
        ? { interviewer: req.user._id }
        : {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query['scheduledTime.start'] = {};
      if (startDate) query['scheduledTime.start'].$gte = new Date(startDate);
      if (endDate) query['scheduledTime.start'].$lte = new Date(endDate);
    }

    const interviews = await Interview.find(query)
      .populate('candidate', 'firstName lastName email')
      .populate('interviewer', 'firstName lastName email department')
      .sort({ 'scheduledTime.start': 1 });

    res.json({ interviews });
  } catch (error) {
    console.error('Fetch interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// Get single interview
router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'firstName lastName email timezone')
      .populate('interviewer', 'firstName lastName email department timezone');

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Check access
    const isParticipant = 
      interview.candidate._id.equals(req.user._id) ||
      interview.interviewer._id.equals(req.user._id) ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ interview });
  } catch (error) {
    console.error('Fetch interview error:', error);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
});

// Select a proposed time slot (candidate action)
router.post('/:id/select-slot', auth, [
  body('slotIndex').isInt({ min: 0, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'firstName lastName email')
      .populate('interviewer', 'firstName lastName email');

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (!interview.candidate._id.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only the candidate can select a time slot' });
    }

    if (interview.status !== 'proposed') {
      return res.status(400).json({ error: 'Interview is not in proposed status' });
    }

    const { slotIndex } = req.body;
    
    if (!interview.proposedSlots[slotIndex]) {
      return res.status(400).json({ error: 'Invalid slot index' });
    }

    const selectedSlot = interview.proposedSlots[slotIndex];
    
    interview.scheduledTime = {
      start: selectedSlot.start,
      end: selectedSlot.end
    };
    interview.selectedSlotIndex = slotIndex;
    interview.status = 'confirmed';

    await interview.save();

    // Send calendar invites
    try {
      const emailResults = await sendInterviewInvite(
        interview,
        interview.candidate,
        interview.interviewer
      );
      interview.emailsSent = emailResults;
      await interview.save();
    } catch (emailError) {
      console.error('Failed to send interview invites:', emailError);
    }

    res.json({ interview });
  } catch (error) {
    console.error('Select slot error:', error);
    res.status(500).json({ error: 'Failed to select time slot' });
  }
});

// Confirm interview directly (interviewer/admin)
router.post('/:id/confirm', auth, requireRole('interviewer', 'admin'), [
  body('scheduledTime.start').isISO8601(),
  body('scheduledTime.end').isISO8601(),
  body('meetingLink').optional().isURL(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'firstName lastName email')
      .populate('interviewer', 'firstName lastName email');

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const { scheduledTime, meetingLink, notes } = req.body;

    interview.scheduledTime = {
      start: new Date(scheduledTime.start),
      end: new Date(scheduledTime.end)
    };
    interview.status = 'confirmed';
    if (meetingLink) interview.meetingLink = meetingLink;
    if (notes) interview.notes = notes;

    await interview.save();

    // Send calendar invites
    try {
      const emailResults = await sendInterviewInvite(
        interview,
        interview.candidate,
        interview.interviewer
      );
      interview.emailsSent = emailResults;
      await interview.save();
    } catch (emailError) {
      console.error('Failed to send interview invites:', emailError);
    }

    res.json({ interview });
  } catch (error) {
    console.error('Confirm interview error:', error);
    res.status(500).json({ error: 'Failed to confirm interview' });
  }
});

// Cancel interview
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const isParticipant = 
      interview.candidate.equals(req.user._id) ||
      interview.interviewer.equals(req.user._id) ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    interview.status = 'cancelled';
    await interview.save();

    res.json({ interview });
  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({ error: 'Failed to cancel interview' });
  }
});

// Submit feedback (interviewer only)
router.post('/:id/feedback', auth, requireRole('interviewer', 'admin'), [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comments').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (!interview.interviewer.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the interviewer can submit feedback' });
    }

    const { rating, comments } = req.body;

    interview.feedback = {
      rating,
      comments,
      submittedAt: new Date()
    };
    interview.status = 'completed';

    await interview.save();

    res.json({ interview });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get interview statistics (admin only)
router.get('/stats/overview', auth, requireRole('admin'), async (req, res) => {
  try {
    const [total, byStatus, byType] = await Promise.all([
      Interview.countDocuments(),
      Interview.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Interview.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
