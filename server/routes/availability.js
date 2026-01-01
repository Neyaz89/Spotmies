const express = require('express');
const { body, validationResult } = require('express-validator');
const Availability = require('../models/Availability');
const { auth } = require('../middleware/auth');
const { parseAvailabilityText } = require('../services/aiParser');

const router = express.Router();

// Get user's availability
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.user._id };
    
    if (startDate || endDate) {
      query.weekOf = {};
      if (startDate) query.weekOf.$gte = new Date(startDate);
      if (endDate) query.weekOf.$lte = new Date(endDate);
    }

    const availability = await Availability.find(query).sort({ weekOf: 1 });
    res.json({ availability });
  } catch (error) {
    console.error('Fetch availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Get availability for a specific user (for matching)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.params.userId };
    
    if (startDate || endDate) {
      query['slots.start'] = {};
      if (startDate) query['slots.start'].$gte = new Date(startDate);
      if (endDate) query['slots.end'] = { $lte: new Date(endDate) };
    }

    const availability = await Availability.find(query).sort({ weekOf: 1 });
    res.json({ availability });
  } catch (error) {
    console.error('Fetch user availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Add availability with structured slots
router.post('/', auth, [
  body('weekOf').isISO8601(),
  body('slots').isArray({ min: 1 }),
  body('slots.*.start').isISO8601(),
  body('slots.*.end').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { weekOf, slots, recurring, recurringPattern } = req.body;

    // Validate slots
    const validatedSlots = slots.map(slot => {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      
      if (end <= start) {
        throw new Error('End time must be after start time');
      }
      
      return { start, end };
    });

    const availability = new Availability({
      user: req.user._id,
      weekOf: new Date(weekOf),
      slots: validatedSlots,
      recurring: recurring || false,
      recurringPattern: recurringPattern || null,
      parsedByAI: false
    });

    await availability.save();
    res.status(201).json({ availability });
  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ error: error.message || 'Failed to add availability' });
  }
});

// Parse free-text availability using AI
router.post('/parse', auth, [
  body('text').trim().notEmpty().withMessage('Availability text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;
    const slots = await parseAvailabilityText(text, req.user.timezone);

    if (slots.length === 0) {
      return res.status(400).json({ 
        error: 'Could not parse any valid time slots from the provided text' 
      });
    }

    res.json({ 
      slots,
      message: `Parsed ${slots.length} time slot(s) from your input`
    });
  } catch (error) {
    console.error('Parse availability error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse availability' });
  }
});

// Save parsed availability
router.post('/save-parsed', auth, [
  body('slots').isArray({ min: 1 }),
  body('slots.*.start').isISO8601(),
  body('slots.*.end').isISO8601(),
  body('rawInput').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { slots, rawInput } = req.body;

    // Group slots by week
    const slotsByWeek = {};
    for (const slot of slots) {
      const start = new Date(slot.start);
      const weekStart = new Date(start);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString();
      if (!slotsByWeek[weekKey]) {
        slotsByWeek[weekKey] = [];
      }
      slotsByWeek[weekKey].push({
        start: new Date(slot.start),
        end: new Date(slot.end)
      });
    }

    // Create availability documents for each week
    const savedAvailability = [];
    for (const [weekOf, weekSlots] of Object.entries(slotsByWeek)) {
      const availability = new Availability({
        user: req.user._id,
        weekOf: new Date(weekOf),
        slots: weekSlots,
        rawInput,
        parsedByAI: true
      });
      await availability.save();
      savedAvailability.push(availability);
    }

    res.status(201).json({ availability: savedAvailability });
  } catch (error) {
    console.error('Save parsed availability error:', error);
    res.status(500).json({ error: 'Failed to save availability' });
  }
});

// Update availability
router.patch('/:id', auth, async (req, res) => {
  try {
    const availability = await Availability.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    const { slots, recurring, recurringPattern } = req.body;

    if (slots) {
      availability.slots = slots.map(slot => ({
        start: new Date(slot.start),
        end: new Date(slot.end)
      }));
    }

    if (recurring !== undefined) availability.recurring = recurring;
    if (recurringPattern !== undefined) availability.recurringPattern = recurringPattern;

    await availability.save();
    res.json({ availability });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// Delete availability
router.delete('/:id', auth, async (req, res) => {
  try {
    const availability = await Availability.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    res.json({ message: 'Availability deleted' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
});

module.exports = router;
