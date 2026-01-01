const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(['candidate', 'interviewer', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role, timezone, department, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      timezone: timezone || 'UTC',
      department,
      skills: skills || []
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.patch('/profile', auth, [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('timezone').optional().trim(),
  body('department').optional().trim(),
  body('skills').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['firstName', 'lastName', 'timezone', 'department', 'skills'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Get all interviewers (for candidates to see)
router.get('/interviewers', auth, async (req, res) => {
  try {
    const interviewers = await User.find({ role: 'interviewer' })
      .select('firstName lastName department skills');
    res.json({ interviewers });
  } catch (error) {
    console.error('Fetch interviewers error:', error);
    res.status(500).json({ error: 'Failed to fetch interviewers' });
  }
});

// Get all candidates (for interviewers/admins)
router.get('/candidates', auth, async (req, res) => {
  try {
    if (req.user.role === 'candidate') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const candidates = await User.find({ role: 'candidate' })
      .select('firstName lastName skills createdAt');
    res.json({ candidates });
  } catch (error) {
    console.error('Fetch candidates error:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

module.exports = router;
