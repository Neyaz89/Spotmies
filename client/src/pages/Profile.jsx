import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MeetingIllustration } from '../components/illustrations';
import {
  User,
  Mail,
  Globe,
  Briefcase,
  Tag,
  Save,
  Plus,
  X,
  Sparkles
} from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  timezone: z.string(),
  department: z.string().optional()
});

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney'
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      timezone: user?.timezone || 'UTC',
      department: user?.department || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile({ ...data, skills });
      toast.success('Profile updated! ✨');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Profile Settings</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          <MeetingIllustration className="w-24 h-24" />
        </motion.div>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-purple-200">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 capitalize">
              <Sparkles className="w-4 h-4" />
              {user?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                First Name
              </label>
              <input
                type="text"
                {...register('firstName')}
                className="input-field"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="input-label flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                Last Name
              </label>
              <input
                type="text"
                {...register('lastName')}
                className="input-field"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="input-label flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-500" />
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input-field bg-gray-50 cursor-not-allowed text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
          </div>

          {/* Timezone */}
          <div>
            <label className="input-label flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              Timezone
            </label>
            <select
              {...register('timezone')}
              className="input-field bg-white"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          {/* Department (for interviewers) */}
          {user?.role === 'interviewer' && (
            <div>
              <label className="input-label flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" />
                Department
              </label>
              <input
                type="text"
                {...register('department')}
                className="input-field"
                placeholder="e.g., Engineering, Product, Design"
              />
            </div>
          )}

          {/* Skills */}
          <div>
            <label className="input-label flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-500" />
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field flex-1"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-secondary px-4"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="p-0.5 hover:bg-purple-200 rounded-full transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!isDirty && skills.length === (user?.skills?.length || 0))}
            className="btn-primary w-full text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Changes
              </span>
            )}
          </button>
        </form>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-500">Account Type</span>
            <span className="text-gray-800 font-semibold capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-500">Member Since</span>
            <span className="text-gray-800 font-semibold">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
