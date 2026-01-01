import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { MeetingIllustration, Logo } from '../components/illustrations';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['candidate', 'interviewer'], { required_error: 'Please select a role' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'candidate'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      toast.success('Account created! Welcome aboard! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pastel-blob blob-pink" />
      <div className="pastel-blob blob-purple" />
      <div className="pastel-blob blob-blue" />
      <div className="pastel-blob blob-mint" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-10">
          {/* Logo and Illustration */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Logo className="w-14 h-14" />
              <div>
                <span className="text-2xl font-bold gradient-text">Schedulr</span>
                <p className="text-xs text-gray-400 font-medium">AI-Powered Interviews</p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden sm:block"
            >
              <MeetingIllustration className="w-20 h-20" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create account</h2>
          <p className="text-gray-500 mb-8">Join us to streamline your scheduling</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="input-label">I am a</label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRole === 'candidate'
                      ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-100'
                      : 'border-gray-100 bg-white/50 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    value="candidate"
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === 'candidate' 
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400 shadow-md' 
                      : 'bg-gray-100'
                  }`}>
                    <User className={`w-5 h-5 ${selectedRole === 'candidate' ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <span className={`font-semibold ${selectedRole === 'candidate' ? 'text-gray-800' : 'text-gray-500'}`}>
                    Candidate
                  </span>
                </label>
                <label
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRole === 'interviewer'
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-100'
                      : 'border-gray-100 bg-white/50 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    value="interviewer"
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === 'interviewer' 
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 shadow-md' 
                      : 'bg-gray-100'
                  }`}>
                    <Briefcase className={`w-5 h-5 ${selectedRole === 'interviewer' ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <span className={`font-semibold ${selectedRole === 'interviewer' ? 'text-gray-800' : 'text-gray-500'}`}>
                    Interviewer
                  </span>
                </label>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">First Name</label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="input-field"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="input-label">Last Name</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="input-field"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                {...register('password')}
                className="input-field"
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="input-field"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-500 hover:text-purple-600 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
