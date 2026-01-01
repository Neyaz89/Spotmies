import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';
import { CalendarIllustration, Logo } from '../components/illustrations';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pastel-blob blob-pink" />
      <div className="pastel-blob blob-purple" />
      <div className="pastel-blob blob-blue" />
      <div className="pastel-blob blob-mint" />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated Illustration */}
            <motion.div 
              className="mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CalendarIllustration className="w-56 h-56" />
            </motion.div>
            
            <h1 className="text-6xl font-bold text-gray-800 mb-4 leading-tight">
              Interview
              <span className="gradient-text block">Scheduler</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-md leading-relaxed">
              Effortlessly match availability and schedule interviews with our AI-powered platform.
            </p>

            <div className="space-y-4">
              {[
                { icon: Sparkles, text: 'AI-powered availability parsing', color: 'from-pink-400 to-rose-400' },
                { icon: Heart, text: 'Smart matching algorithm', color: 'from-purple-400 to-violet-400' },
                { icon: Star, text: 'Automated email invitations', color: 'from-blue-400 to-cyan-400' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-600 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-14 h-14" />
              <div>
                <span className="text-2xl font-bold gradient-text">Schedulr</span>
                <p className="text-xs text-gray-400 font-medium">AI-Powered Interviews</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-8">Sign in to continue scheduling</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="input-field"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="input-label">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="input-field"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-500 hover:text-purple-600 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
