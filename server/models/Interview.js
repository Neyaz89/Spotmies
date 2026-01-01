const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledTime: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['proposed', 'confirmed', 'cancelled', 'completed', 'rescheduled'],
    default: 'proposed'
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'cultural', 'final'],
    default: 'technical'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  },
  proposedSlots: [{
    start: Date,
    end: Date,
    score: Number
  }],
  selectedSlotIndex: {
    type: Number
  },
  emailsSent: {
    candidate: { type: Boolean, default: false },
    interviewer: { type: Boolean, default: false }
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comments: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

interviewSchema.index({ candidate: 1, status: 1 });
interviewSchema.index({ interviewer: 1, status: 1 });
interviewSchema.index({ 'scheduledTime.start': 1 });

module.exports = mongoose.model('Interview', interviewSchema);
