const Availability = require('../models/Availability');
const Interview = require('../models/Interview');

async function findOptimalSlots(candidateId, interviewerId, options = {}) {
  const {
    duration = 60, // minutes
    maxSlots = 3,
    startDate = new Date(),
    endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks ahead
    preferredTimes = null // { start: 9, end: 17 } for business hours preference
  } = options;

  // Fetch availability for both users
  const [candidateAvailability, interviewerAvailability] = await Promise.all([
    Availability.find({
      user: candidateId,
      'slots.start': { $gte: startDate },
      'slots.end': { $lte: endDate }
    }),
    Availability.find({
      user: interviewerId,
      'slots.start': { $gte: startDate },
      'slots.end': { $lte: endDate }
    })
  ]);

  // Flatten slots
  const candidateSlots = flattenSlots(candidateAvailability);
  const interviewerSlots = flattenSlots(interviewerAvailability);

  // Find overlapping slots
  const overlaps = findOverlaps(candidateSlots, interviewerSlots, duration);

  // Get existing interviews to avoid conflicts
  const existingInterviews = await Interview.find({
    $or: [
      { candidate: candidateId },
      { interviewer: interviewerId }
    ],
    status: { $in: ['proposed', 'confirmed'] },
    'scheduledTime.start': { $gte: startDate },
    'scheduledTime.end': { $lte: endDate }
  });

  // Filter out conflicting slots
  const availableSlots = overlaps.filter(slot => 
    !hasConflict(slot, existingInterviews)
  );

  // Score and rank slots
  const scoredSlots = availableSlots.map(slot => ({
    ...slot,
    score: calculateSlotScore(slot, preferredTimes)
  }));

  // Sort by score (highest first) and return top slots
  scoredSlots.sort((a, b) => b.score - a.score);
  
  return scoredSlots.slice(0, maxSlots);
}

function flattenSlots(availabilityDocs) {
  const slots = [];
  for (const doc of availabilityDocs) {
    for (const slot of doc.slots) {
      slots.push({
        start: new Date(slot.start),
        end: new Date(slot.end)
      });
    }
  }
  return slots.sort((a, b) => a.start - b.start);
}

function findOverlaps(slots1, slots2, durationMinutes) {
  const overlaps = [];
  const durationMs = durationMinutes * 60 * 1000;

  for (const s1 of slots1) {
    for (const s2 of slots2) {
      const overlapStart = new Date(Math.max(s1.start.getTime(), s2.start.getTime()));
      const overlapEnd = new Date(Math.min(s1.end.getTime(), s2.end.getTime()));

      if (overlapEnd - overlapStart >= durationMs) {
        // Generate possible interview slots within the overlap
        let current = new Date(overlapStart);
        while (current.getTime() + durationMs <= overlapEnd.getTime()) {
          overlaps.push({
            start: new Date(current),
            end: new Date(current.getTime() + durationMs)
          });
          // Move by 30-minute increments
          current = new Date(current.getTime() + 30 * 60 * 1000);
        }
      }
    }
  }

  // Remove duplicates
  const unique = [];
  const seen = new Set();
  for (const slot of overlaps) {
    const key = `${slot.start.toISOString()}-${slot.end.toISOString()}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(slot);
    }
  }

  return unique;
}

function hasConflict(slot, existingInterviews) {
  for (const interview of existingInterviews) {
    const existingStart = new Date(interview.scheduledTime.start);
    const existingEnd = new Date(interview.scheduledTime.end);
    
    // Check for overlap
    if (slot.start < existingEnd && slot.end > existingStart) {
      return true;
    }
  }
  return false;
}

function calculateSlotScore(slot, preferredTimes) {
  let score = 100;
  const hour = slot.start.getUTCHours();
  const dayOfWeek = slot.start.getUTCDay();

  // Prefer business hours (9 AM - 5 PM)
  if (preferredTimes) {
    if (hour >= preferredTimes.start && hour < preferredTimes.end) {
      score += 20;
    }
  } else {
    if (hour >= 9 && hour < 17) {
      score += 20;
    }
  }

  // Prefer mid-week (Tuesday-Thursday)
  if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    score += 15;
  }

  // Slight preference for morning slots
  if (hour >= 9 && hour < 12) {
    score += 10;
  }

  // Penalize very early or late slots
  if (hour < 8 || hour >= 18) {
    score -= 20;
  }

  // Prefer slots that are sooner (within reason)
  const daysFromNow = (slot.start - new Date()) / (24 * 60 * 60 * 1000);
  if (daysFromNow <= 3) {
    score += 5;
  } else if (daysFromNow > 7) {
    score -= 5;
  }

  return score;
}

module.exports = { findOptimalSlots };
