import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI, matchingAPI } from '../services/api';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MeetingIllustration } from '../components/illustrations';
import {
  Users,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Wand2
} from 'lucide-react';

const ScheduleInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewType, setInterviewType] = useState('technical');
  const [duration, setDuration] = useState(60);
  const [matchedSlots, setMatchedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [matching, setMatching] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await authAPI.getCandidates();
      setCandidates(response.data.candidates);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleFindSlots = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setMatching(true);
    try {
      const response = await matchingAPI.findSlots({
        candidateId: selectedCandidate._id,
        interviewerId: user._id,
        duration
      });
      setMatchedSlots(response.data.slots);
      if (response.data.slots.length === 0) {
        toast.error('No matching time slots found. Please check availability.');
      } else {
        setStep(3);
        toast.success(`Found ${response.data.slots.length} optimal time slots! ✨`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to find matching slots');
    } finally {
      setMatching(false);
    }
  };

  const handleSlotToggle = (slot) => {
    const slotKey = slot.start;
    if (selectedSlots.find(s => s.start === slotKey)) {
      setSelectedSlots(selectedSlots.filter(s => s.start !== slotKey));
    } else if (selectedSlots.length < 3) {
      setSelectedSlots([...selectedSlots, slot]);
    } else {
      toast.error('You can only propose up to 3 time slots');
    }
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    setSubmitting(true);
    try {
      await matchingAPI.proposeInterview({
        candidateId: selectedCandidate._id,
        interviewerId: user._id,
        proposedSlots: selectedSlots,
        type: interviewType,
        meetingLink: meetingLink || undefined,
        notes: notes || undefined
      });
      toast.success('Interview proposal sent! The candidate will receive an email. 🎉');
      navigate('/interviews');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create interview');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchLower) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Select Candidate', color: 'from-pink-400 to-rose-400' },
    { num: 2, label: 'Interview Details', color: 'from-purple-400 to-violet-400' },
    { num: 3, label: 'Choose Time Slots', color: 'from-blue-400 to-cyan-400' },
    { num: 4, label: 'Confirm', color: 'from-emerald-400 to-teal-400' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Steps */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all shadow-lg ${
                    step >= s.num
                      ? `bg-gradient-to-br ${s.color} text-white`
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.num}
                </div>
                <span className={`hidden sm:block text-sm font-semibold ${
                  step >= s.num ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded-full ${
                  step > s.num ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-100'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Candidate */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-md shadow-pink-200">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Select a Candidate</h2>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Candidates List */}
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <MeetingIllustration className="w-40 h-40" />
                </motion.div>
                <p className="text-gray-500">No candidates found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCandidates.map((candidate, index) => (
                  <button
                    key={candidate._id}
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setStep(2);
                    }}
                    className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                      selectedCandidate?._id === candidate._id
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg shadow-purple-100'
                        : 'bg-white/60 hover:bg-white border-transparent hover:border-purple-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-200`}>
                          {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {candidate.firstName} {candidate.lastName}
                          </p>
                          {candidate.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600 font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Interview Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center shadow-md shadow-purple-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Interview Details</h2>
            </div>

            {/* Selected Candidate */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-200">
                  {selectedCandidate?.firstName?.[0]}{selectedCandidate?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                  </p>
                  <p className="text-sm text-purple-500 font-medium">Selected Candidate</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Interview Type */}
              <div>
                <label className="input-label">Interview Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'technical', color: 'from-blue-400 to-cyan-400' },
                    { value: 'behavioral', color: 'from-purple-400 to-violet-400' },
                    { value: 'cultural', color: 'from-pink-400 to-rose-400' },
                    { value: 'final', color: 'from-emerald-400 to-teal-400' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setInterviewType(type.value)}
                      className={`p-4 rounded-2xl border-2 text-center capitalize transition-all font-medium ${
                        interviewType === type.value
                          ? `border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 shadow-lg shadow-purple-100`
                          : 'border-gray-100 text-gray-500 hover:border-gray-200 bg-white/50'
                      }`}
                    >
                      {type.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="input-label">Duration</label>
                <div className="grid grid-cols-4 gap-3">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDuration(mins)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all font-medium ${
                        duration === mins
                          ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 shadow-lg shadow-purple-100'
                          : 'border-gray-100 text-gray-500 hover:border-gray-200 bg-white/50'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-500" />
                  Meeting Link (optional)
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="input-field"
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Any additional information for the candidate..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleFindSlots}
                disabled={matching}
                className="btn-primary flex-1"
              >
                {matching ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Finding optimal slots...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Find Matching Slots
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Choose Time Slots */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-200">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Select Time Slots</h2>
                <p className="text-gray-500 text-sm">Choose up to 3 slots to propose</p>
              </div>
            </div>

            {matchedSlots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No matching slots found</h3>
                <p className="text-gray-500 mb-6">
                  There's no overlapping availability. Please update availability and try again.
                </p>
                <button onClick={() => setStep(2)} className="btn-secondary">
                  Go Back
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto mb-6 mt-6">
                  {matchedSlots.map((slot, index) => {
                    const isSelected = selectedSlots.find(s => s.start === slot.start);
                    return (
                      <button
                        key={index}
                        onClick={() => handleSlotToggle(slot)}
                        className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${
                          isSelected
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg shadow-purple-100'
                            : 'bg-white/60 hover:bg-white border-gray-100 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg shadow-purple-200' 
                                : 'bg-gray-100'
                            }`}>
                              {isSelected ? (
                                <CheckCircle className="w-7 h-7 text-white" />
                              ) : (
                                <Calendar className="w-7 h-7 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {format(new Date(slot.start), 'EEEE, MMMM d')}
                              </p>
                              <p className="text-gray-500">
                                {format(new Date(slot.start), 'h:mm a')} - {format(new Date(slot.end), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-sm font-medium">
                            Score: {slot.score}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={selectedSlots.length === 0}
                    className="btn-primary flex-1"
                  >
                    Continue ({selectedSlots.length} selected)
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-200">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Confirm Interview Proposal</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
                <p className="text-sm text-gray-500 mb-1">Candidate</p>
                <p className="text-gray-800 font-semibold">
                  {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
                <p className="text-sm text-gray-500 mb-1">Interview Type</p>
                <p className="text-gray-800 font-semibold capitalize">{interviewType}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="text-gray-800 font-semibold">{duration} minutes</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <p className="text-sm text-gray-500 mb-2">Proposed Time Slots</p>
                <div className="space-y-2">
                  {selectedSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-800 font-medium">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      {format(new Date(slot.start), 'EEE, MMM d')} at {format(new Date(slot.start), 'h:mm a')}
                    </div>
                  ))}
                </div>
              </div>

              {meetingLink && (
                <div className="p-4 rounded-2xl bg-white border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Meeting Link</p>
                  <p className="text-purple-500 font-medium">{meetingLink}</p>
                </div>
              )}

              {notes && (
                <div className="p-4 rounded-2xl bg-white border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-800">{notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-secondary">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-success flex-1"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Send Proposal
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleInterview;
