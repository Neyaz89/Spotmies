const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekOf: {
    type: Date,
    required: true
  },
  slots: [timeSlotSchema],
  rawInput: {
    type: String
  },
  parsedByAI: {
    type: Boolean,
    default: false
  },
  recurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', null],
    default: null
  }
}, {
  timestamps: true
});

availabilitySchema.index({ user: 1, weekOf: 1 });
availabilitySchema.index({ 'slots.start': 1, 'slots.end': 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
