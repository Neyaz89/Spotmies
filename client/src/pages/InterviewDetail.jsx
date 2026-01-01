import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import { format, parseISO } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { SuccessIllustration } from '../components/illustrations';
import {
  Calendar,
  Clock,
  Mail,
  Video,
  CheckCircle,
  XCircle,
  Star,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comments: '' });

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const response = await interviewAPI.getInterview(id);
      setInterview(response.data.interview);
    } catch (error) {
      toast.error('Failed to load interview details');
      navigate('/interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = async (slotIndex) => {
    setActionLoading(true);
    try {
      await interviewAPI.selectSlot(id, slotIndex);
      toast.success('Interview confirmed! Calendar invites have been sent. 🎉');
      fetchInterview();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to confirm interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!window.confirm('Are you sure you want to decline this interview proposal?')) return;
    
    setActionLoading(true);
    try {
      await interviewAPI.cancelInterview(id);
      toast.success('Interview proposal declined');
      fetchInterview();
    } catch (error) {
      toast.error('Failed to decline interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    
    setActionLoading(true);
    try {
      await interviewAPI.cancelInterview(id);
      toast.success('Interview cancelled');
      fetchInterview();
    } catch (error) {
      toast.error('Failed to cancel interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedback.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setActionLoading(true);
    try {
      await interviewAPI.submitFeedback(id, feedback);
      toast.success('Feedback submitted! Thank you! 🌟');
      setShowFeedbackModal(false);
      fetchInterview();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!interview) return null;

  const otherPerson = user?.role === 'candidate' 
    ? interview.interviewer 
    : interview.candidate;

  const isCandidate = user?.role === 'candidate';
  const canSelectSlot = isCandidate && interview.status === 'proposed';
  const canCancel = ['proposed', 'confirmed'].includes(interview.status);
  const canSubmitFeedback = !isCandidate && interview.status === 'confirmed' && !interview.feedback;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/interviews')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to interviews
      </button>

      {/* Main Card */}
      <div className="glass-card p-8">
        {/* Success Illustration for Confirmed Interviews */}
        {interview.status === 'confirmed' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <SuccessIllustration className="w-32 h-32" />
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-pink-200">
              {otherPerson?.firstName?.[0]}{otherPerson?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {otherPerson?.firstName} {otherPerson?.lastName}
              </h1>
              <p className="text-gray-500 capitalize">{interview.type} Interview</p>
            </div>
          </div>
          <span className={`badge badge-${interview.status} text-sm`}>
            {interview.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-md shadow-pink-200">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-800 font-semibold">
                  {format(parseISO(interview.scheduledTime.start), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center shadow-md shadow-purple-200">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-gray-800 font-semibold">
                  {format(parseISO(interview.scheduledTime.start), 'h:mm a')} - {format(parseISO(interview.scheduledTime.end), 'h:mm a')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-200">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-semibold">{otherPerson?.email}</p>
              </div>
            </div>

            {interview.meetingLink && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-200">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meeting Link</p>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-600 font-semibold flex items-center gap-1"
                  >
                    Join Meeting
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {interview.notes && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-gray-600">Notes</span>
            </div>
            <p className="text-gray-700">{interview.notes}</p>
          </div>
        )}

        {/* Proposed Slots Selection (for candidates) */}
        {canSelectSlot && interview.proposedSlots?.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Select Your Preferred Time</h3>
                <p className="text-sm text-gray-500">Choose one of the proposed time slots</p>
              </div>
            </div>
            
            <div className="grid gap-3 mb-6">
              {interview.proposedSlots.map((slot, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectSlot(index)}
                  disabled={actionLoading}
                  className="p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                        <Calendar className="w-7 h-7 text-purple-500 group-hover:text-white transition-colors" />
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
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-sm font-medium">
                        Score: {slot.score}
                      </span>
                      <div className="px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Accept
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Decline option for candidates */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Not available?</p>
                    <p className="text-sm text-gray-500">Decline this interview proposal</p>
                  </div>
                </div>
                <button
                  onClick={handleDecline}
                  disabled={actionLoading}
                  className="btn-danger"
                >
                  <XCircle className="w-5 h-5" />
                  Decline Proposal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Display */}
        {interview.feedback && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-800">Interview Feedback</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= interview.feedback.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-500 font-medium">({interview.feedback.rating}/5)</span>
            </div>
            {interview.feedback.comments && (
              <p className="text-gray-600">{interview.feedback.comments}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {canSubmitFeedback && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="btn-primary"
            >
              <Star className="w-5 h-5" />
              Submit Feedback
            </button>
          )}
          {canCancel && interview.status === 'confirmed' && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="btn-secondary text-red-500 hover:bg-red-50 hover:border-red-200"
            >
              <XCircle className="w-5 h-5" />
              Cancel Interview
            </button>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFeedbackModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Submit Feedback</h2>
            </div>

            <div className="mb-6">
              <label className="input-label">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= feedback.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200 hover:text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="input-label">Comments (optional)</label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                className="input-field min-h-[120px] resize-none"
                placeholder="Share your thoughts about the interview..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={actionLoading}
                className="btn-primary flex-1"
              >
                {actionLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewDetail;
