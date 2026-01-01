import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import { EmptyStateIllustration } from '../components/illustrations';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  CalendarPlus,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes] = await Promise.all([
          interviewAPI.getInterviews()
        ]);
        setInterviews(interviewsRes.data.interviews);

        const allInterviews = interviewsRes.data.interviews;
        setStats({
          total: allInterviews.length,
          upcoming: allInterviews.filter(i => 
            ['proposed', 'confirmed'].includes(i.status) && 
            new Date(i.scheduledTime.start) > new Date()
          ).length,
          completed: allInterviews.filter(i => i.status === 'completed').length,
          pending: allInterviews.filter(i => i.status === 'proposed').length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDateLabel = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const upcomingInterviews = interviews
    .filter(i => ['proposed', 'confirmed'].includes(i.status) && new Date(i.scheduledTime.start) > new Date())
    .sort((a, b) => new Date(a.scheduledTime.start) - new Date(b.scheduledTime.start))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Interviews', 
      value: stats?.total || 0, 
      icon: Calendar, 
      gradient: 'from-pink-400 to-rose-400',
      bgGradient: 'from-pink-50 to-rose-50',
      shadowColor: 'shadow-pink-200'
    },
    { 
      label: 'Upcoming', 
      value: stats?.upcoming || 0, 
      icon: Clock, 
      gradient: 'from-purple-400 to-violet-400',
      bgGradient: 'from-purple-50 to-violet-50',
      shadowColor: 'shadow-purple-200'
    },
    { 
      label: 'Pending Response', 
      value: stats?.pending || 0, 
      icon: AlertCircle, 
      gradient: 'from-amber-400 to-orange-400',
      bgGradient: 'from-amber-50 to-orange-50',
      shadowColor: 'shadow-amber-200'
    },
    { 
      label: 'Completed', 
      value: stats?.completed || 0, 
      icon: CheckCircle, 
      gradient: 'from-emerald-400 to-teal-400',
      bgGradient: 'from-emerald-50 to-teal-50',
      shadowColor: 'shadow-emerald-200'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="gradient-text">{user?.firstName}</span>! ✨
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your interviews
          </p>
        </div>
        {user?.role !== 'candidate' && (
          <Link to="/schedule" className="btn-primary">
            <CalendarPlus className="w-5 h-5" />
            Schedule Interview
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`glass-card p-6 bg-gradient-to-br ${stat.bgGradient}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadowColor}`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              {index === 0 && <TrendingUp className="w-5 h-5 text-emerald-500" />}
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-200">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Upcoming Interviews</h2>
          </div>
          <Link
            to="/interviews"
            className="text-purple-500 hover:text-purple-600 text-sm font-semibold flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <EmptyStateIllustration className="w-40 h-40" />
            </motion.div>
            <p className="text-gray-500 mb-4 font-medium">No upcoming interviews</p>
            {user?.role !== 'candidate' && (
              <Link to="/schedule" className="btn-primary">
                Schedule your first interview
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  to={`/interviews/${interview._id}`}
                  className="block p-4 rounded-2xl bg-white/60 hover:bg-white transition-all border border-transparent hover:border-purple-100 hover:shadow-lg hover:shadow-purple-50 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-200">
                        {user?.role === 'candidate'
                          ? `${interview.interviewer?.firstName?.[0]}${interview.interviewer?.lastName?.[0]}`
                          : `${interview.candidate?.firstName?.[0]}${interview.candidate?.lastName?.[0]}`
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user?.role === 'candidate'
                            ? `${interview.interviewer?.firstName} ${interview.interviewer?.lastName}`
                            : `${interview.candidate?.firstName} ${interview.candidate?.lastName}`
                          }
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {interview.type} Interview
                        </p>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-gray-800">
                        {getDateLabel(interview.scheduledTime.start)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(parseISO(interview.scheduledTime.start), 'h:mm a')}
                      </p>
                    </div>
                    <span className={`badge badge-${interview.status}`}>
                      {interview.status}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/availability"
            className="glass-card p-6 flex items-center gap-4 hover:shadow-xl hover:shadow-purple-100 transition-all group bg-gradient-to-br from-purple-50/50 to-pink-50/50"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1 text-lg">Update Availability</h3>
              <p className="text-sm text-gray-500">Set your available time slots</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/profile"
            className="glass-card p-6 flex items-center gap-4 hover:shadow-xl hover:shadow-blue-100 transition-all group bg-gradient-to-br from-blue-50/50 to-cyan-50/50"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1 text-lg">Complete Profile</h3>
              <p className="text-sm text-gray-500">Add skills and preferences</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
