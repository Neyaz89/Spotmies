import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { availabilityAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { format, parseISO } from 'date-fns';
import { TimeIllustration, AIIllustration } from '../components/illustrations';
import {
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  X,
  Check,
  Wand2
} from 'lucide-react';

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiText, setAiText] = useState('');
  const [aiParsing, setAiParsing] = useState(false);
  const [parsedSlots, setParsedSlots] = useState(null);
  const [newSlot, setNewSlot] = useState({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000)
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await availabilityAPI.getMyAvailability();
      setAvailability(response.data.availability);
    } catch (error) {
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    setSaving(true);
    try {
      const startDateTime = new Date(newSlot.date);
      startDateTime.setHours(newSlot.startTime.getHours(), newSlot.startTime.getMinutes());
      
      const endDateTime = new Date(newSlot.date);
      endDateTime.setHours(newSlot.endTime.getHours(), newSlot.endTime.getMinutes());

      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time');
        setSaving(false);
        return;
      }

      const weekOf = new Date(startDateTime);
      weekOf.setDate(weekOf.getDate() - weekOf.getDay());
      weekOf.setHours(0, 0, 0, 0);

      await availabilityAPI.addAvailability({
        weekOf: weekOf.toISOString(),
        slots: [{
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString()
        }]
      });

      toast.success('Availability added! ✨');
      setShowAddModal(false);
      fetchAvailability();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add availability');
    } finally {
      setSaving(false);
    }
  };

  const handleParseAI = async () => {
    if (!aiText.trim()) {
      toast.error('Please enter your availability');
      return;
    }

    setAiParsing(true);
    try {
      const response = await availabilityAPI.parseAvailability(aiText);
      setParsedSlots(response.data.slots);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to parse availability');
    } finally {
      setAiParsing(false);
    }
  };

  const handleSaveParsedSlots = async () => {
    if (!parsedSlots || parsedSlots.length === 0) return;

    setSaving(true);
    try {
      await availabilityAPI.saveParsedAvailability({
        slots: parsedSlots,
        rawInput: aiText
      });
      toast.success('Availability saved! 🎉');
      setShowAIModal(false);
      setAiText('');
      setParsedSlots(null);
      fetchAvailability();
    } catch (error) {
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await availabilityAPI.deleteAvailability(id);
      toast.success('Availability deleted');
      fetchAvailability();
    } catch (error) {
      toast.error('Failed to delete availability');
    }
  };

  const groupedSlots = availability.reduce((acc, avail) => {
    avail.slots.forEach(slot => {
      const dateKey = format(parseISO(slot.start), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({
        ...slot,
        availabilityId: avail._id,
        parsedByAI: avail.parsedByAI
      });
    });
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSlots).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">My Availability</h1>
          <p className="text-gray-500">Set when you're available for interviews</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Wand2 className="w-5 h-5 text-purple-500" />
            AI Parse
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Slot
          </button>
        </div>
      </div>

      {/* Availability List */}
      {sortedDates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <TimeIllustration className="w-48 h-48" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No availability set</h3>
          <p className="text-gray-500 mb-6">
            Add your available time slots to get matched with interviews
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowAIModal(true)}
              className="btn-secondary"
            >
              <Wand2 className="w-5 h-5" />
              Use AI to parse
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add manually
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateKey, index) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md shadow-purple-200">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groupedSlots[dateKey].map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {format(parseISO(slot.start), 'h:mm a')} - {format(parseISO(slot.end), 'h:mm a')}
                      </span>
                      {slot.parsedByAI && (
                        <Sparkles className="w-4 h-4 text-purple-400" title="Parsed by AI" />
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAvailability(slot.availabilityId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Add Availability</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="input-label">Date</label>
                  <DatePicker
                    selected={newSlot.date}
                    onChange={(date) => setNewSlot({ ...newSlot, date })}
                    minDate={new Date()}
                    className="input-field w-full"
                    dateFormat="MMMM d, yyyy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Start Time</label>
                    <DatePicker
                      selected={newSlot.startTime}
                      onChange={(time) => setNewSlot({ ...newSlot, startTime: time })}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="input-label">End Time</label>
                    <DatePicker
                      selected={newSlot.endTime}
                      onChange={(time) => setNewSlot({ ...newSlot, endTime: time })}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddSlot}
                  disabled={saving}
                  className="btn-primary w-full mt-6"
                >
                  {saving ? 'Saving...' : 'Add Availability'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Parse Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAIModal(false);
              setParsedSlots(null);
              setAiText('');
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center shadow-lg shadow-purple-200">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">AI Availability Parser</h2>
                    <p className="text-sm text-gray-500">Powered by AI ✨</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAIModal(false);
                    setParsedSlots(null);
                    setAiText('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* AI Illustration */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex justify-center mb-4"
              >
                <AIIllustration className="w-32 h-32" />
              </motion.div>

              <p className="text-gray-500 mb-4 text-center">
                Describe your availability in natural language and our AI will parse it into time slots.
              </p>

              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder="e.g., I'm available Monday and Wednesday from 9am to 5pm, and Friday afternoon after 2pm"
                className="input-field min-h-[120px] resize-none"
                disabled={parsedSlots !== null}
              />

              {!parsedSlots ? (
                <button
                  onClick={handleParseAI}
                  disabled={aiParsing || !aiText.trim()}
                  className="btn-primary w-full mt-4"
                >
                  {aiParsing ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Parsing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Parse Availability
                    </span>
                  )}
                </button>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-600 mb-3">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Parsed {parsedSlots.length} time slot(s)</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {parsedSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white rounded-xl"
                        >
                          <Clock className="w-4 h-4 text-purple-500" />
                          {format(new Date(slot.start), 'EEE, MMM d')} at{' '}
                          {format(new Date(slot.start), 'h:mm a')} -{' '}
                          {format(new Date(slot.end), 'h:mm a')}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setParsedSlots(null);
                        setAiText('');
                      }}
                      className="btn-secondary flex-1"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleSaveParsedSlots}
                      disabled={saving}
                      className="btn-success flex-1"
                    >
                      {saving ? 'Saving...' : 'Save Slots'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Availability;
