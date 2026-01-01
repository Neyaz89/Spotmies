import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './illustrations';
import {
  Calendar,
  Clock,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  CalendarPlus
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-pink-400 to-rose-400' },
    { path: '/availability', icon: Clock, label: 'Availability', color: 'from-purple-400 to-violet-400' },
    { path: '/interviews', icon: Calendar, label: 'Interviews', color: 'from-blue-400 to-cyan-400' },
    ...(user?.role !== 'candidate' ? [{ path: '/schedule', icon: CalendarPlus, label: 'Schedule', color: 'from-emerald-400 to-teal-400' }] : []),
    { path: '/profile', icon: User, label: 'Profile', color: 'from-amber-400 to-orange-400' }
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Floating particles */}
      <div className="particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* Decorative blobs */}
      <div className="pastel-blob blob-pink" />
      <div className="pastel-blob blob-purple" />
      <div className="pastel-blob blob-blue" />
      <div className="pastel-blob blob-mint" />

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full glass-card m-4 p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12" />
              <div>
                <span className="text-xl font-bold gradient-text">Schedulr</span>
                <p className="text-[10px] text-gray-400 font-medium">AI-Powered</p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User info */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-200">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-purple-500 capitalize font-medium">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-white shadow-lg shadow-purple-100 border border-purple-100'
                      : 'hover:bg-white/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.div 
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md ${isActive ? 'shadow-lg' : 'opacity-80 group-hover:opacity-100'}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600 group-hover:text-gray-800'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3 w-2 h-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 mt-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 glass-card m-4 mb-0 p-4 flex items-center justify-between">
          <button
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Logo className="w-9 h-9" />
            <span className="font-bold gradient-text">Schedulr</span>
          </div>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
