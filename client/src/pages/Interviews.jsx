import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { CalendarIllustration } from '../components/illustrations';
import {
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Interviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await interviewAPI.getInterviews();
      setInterviews(response.data.interviews);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getDateLabel = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'proposed':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filter !== 'all' && interview.status !== filter) return false;

    if (searchTerm) {
      const otherPerson = user?.role === 'candidate' 
        ? interview.interviewer 
        : interview.candidate;
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = `${otherPerson?.firstName} ${otherPerson?.lastName}`.toLowerCase().includes(searchLower);
      const typeMatch = interview.type.toLowerCase().includes(searchLower);
      return nameMatch || typeMatch;
    }

    return true;
  });

  const upcomingInterviews = filteredInterviews.filter(i => 
    !isPast(parseISO(i.scheduledTime.start)) || i.status === 'proposed'
  );
  const pastInterviews = filteredInterviews.filter(i => 
    isPast(parseISO(i.scheduledTime.start)) && i.status !== 'proposed'
  );

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
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Interviews</h1>
          <p className="text-gray-500">Manage your scheduled interviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field bg-white"
            >
              <option value="all">All Status</option>
              <option value="proposed">Proposed</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interview Lists */}
      {filteredInterviews.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <CalendarIllustration className="w-48 h-48" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No interviews found</h3>
          <p className="text-gray-500">
            {filter !== 'all' 
              ? `No ${filter} interviews to show`
              : 'You don\'t have any interviews scheduled yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming */}
          {upcomingInterviews.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md shadow-purple-200">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Upcoming ({upcomingInterviews.length})
                </h2>
              </div>
              <div className="space-y-3">
                {upcomingInterviews.map((interview, index) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    user={user}
                    index={index}
                    getDateLabel={getDateLabel}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastInterviews.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-600">
                  Past ({pastInterviews.length})
                </h2>
              </div>
              <div className="space-y-3 opacity-75">
                {pastInterviews.map((interview, index) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    user={user}
                    index={index}
                    getDateLabel={getDateLabel}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InterviewCard = ({ interview, user, index, getDateLabel, getStatusIcon }) => {
  const otherPerson = user?.role === 'candidate' 
    ? interview.interviewer 
    : interview.candidate;

  const gradients = [
    'from-pink-400 to-rose-400',
    'from-purple-400 to-violet-400',
    'from-blue-400 to-cyan-400',
    'from-emerald-400 to-teal-400',
    'from-amber-400 to-orange-400'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/interviews/${interview._id}`}
        className="glass-card p-5 flex items-center gap-4 hover:shadow-xl hover:shadow-purple-100 transition-all group"
      >
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
          {otherPerson?.firstName?.[0]}{otherPerson?.lastName?.[0]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {otherPerson?.firstName} {otherPerson?.lastName}
            </h3>
            <span className={`badge badge-${interview.status}`}>
              {getStatusIcon(interview.status)}
              <span className="ml-1">{interview.status}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="capitalize">{interview.type} Interview</span>
            {interview.meetingLink && (
              <span className="flex items-center gap-1 text-purple-500">
                <Video className="w-4 h-4" />
                Video call
              </span>
            )}
          </div>
        </div>

        {/* Date/Time */}
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-gray-800">
            {getDateLabel(interview.scheduledTime.start)}
          </p>
          <p className="text-sm text-gray-500">
            {format(parseISO(interview.scheduledTime.start), 'h:mm a')}
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </Link>
    </motion.div>
  );
};

export default Interviews;
