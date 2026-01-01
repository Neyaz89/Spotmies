import { motion } from 'framer-motion';

// Professional Logo Component
export const Logo = ({ className = "w-12 h-12", showText = false, textClassName = "" }) => (
  <div className={`flex items-center gap-3 ${showText ? '' : ''}`}>
    <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.4"/>
        </filter>
      </defs>
      
      {/* Main rounded square background */}
      <rect x="4" y="4" width="52" height="52" rx="14" fill="url(#logoGrad1)" filter="url(#logoShadow)" />
      
      {/* Calendar icon stylized */}
      <rect x="14" y="18" width="32" height="28" rx="4" fill="white" fillOpacity="0.95" />
      <rect x="14" y="18" width="32" height="10" rx="4" fill="url(#logoGrad2)" />
      
      {/* Calendar rings */}
      <rect x="22" y="14" width="4" height="8" rx="2" fill="white" />
      <rect x="34" y="14" width="4" height="8" rx="2" fill="white" />
      
      {/* Calendar dots representing schedule */}
      <circle cx="22" cy="36" r="2.5" fill="#ec4899" />
      <circle cx="30" cy="36" r="2.5" fill="#a855f7" />
      <circle cx="38" cy="36" r="2.5" fill="#3b82f6" />
      
      {/* Checkmark indicating confirmed */}
      <path d="M24 40 L28 44 L36 36" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* AI sparkle */}
      <path d="M46 12 L47 14 L49 15 L47 16 L46 18 L45 16 L43 15 L45 14 Z" fill="#fbbf24" />
    </svg>
    {showText && (
      <div className={textClassName}>
        <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Schedulr
        </span>
        <p className="text-[10px] text-gray-400 font-medium -mt-0.5">AI-Powered Interviews</p>
      </div>
    )}
  </div>
);

// Animated Logo for special occasions
export const AnimatedLogo = ({ className = "w-12 h-12" }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="animLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="animLogoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="animLogoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.4"/>
        </filter>
      </defs>
      
      {/* Main rounded square background */}
      <motion.rect 
        x="4" y="4" width="52" height="52" rx="14" 
        fill="url(#animLogoGrad1)" 
        filter="url(#animLogoShadow)"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Calendar icon stylized */}
      <rect x="14" y="18" width="32" height="28" rx="4" fill="white" fillOpacity="0.95" />
      <rect x="14" y="18" width="32" height="10" rx="4" fill="url(#animLogoGrad2)" />
      
      {/* Calendar rings */}
      <rect x="22" y="14" width="4" height="8" rx="2" fill="white" />
      <rect x="34" y="14" width="4" height="8" rx="2" fill="white" />
      
      {/* Calendar dots with animation */}
      <motion.circle 
        cx="22" cy="36" r="2.5" fill="#ec4899"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.circle 
        cx="30" cy="36" r="2.5" fill="#a855f7"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle 
        cx="38" cy="36" r="2.5" fill="#3b82f6"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      />
      
      {/* Checkmark */}
      <motion.path 
        d="M24 40 L28 44 L36 36" 
        stroke="#10b981" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      
      {/* AI sparkle with animation */}
      <motion.path 
        d="M46 12 L47 14 L49 15 L47 16 L46 18 L45 16 L43 15 L45 14 Z" 
        fill="#fbbf24"
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: "46px 15px" }}
      />
    </svg>
  </motion.div>
);

// Animated Calendar Illustration
export const CalendarIllustration = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="calGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="100%" stopColor="#f3e8ff" />
      </linearGradient>
      <linearGradient id="calGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="calShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#a855f7" floodOpacity="0.3"/>
      </filter>
    </defs>
    
    {/* Background circle */}
    <motion.circle
      cx="100" cy="100" r="90"
      fill="url(#calGrad1)"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
    
    {/* Calendar body */}
    <motion.rect
      x="45" y="55" width="110" height="100" rx="12"
      fill="white"
      filter="url(#calShadow)"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    
    {/* Calendar header */}
    <motion.rect
      x="45" y="55" width="110" height="28" rx="12"
      fill="url(#calGrad2)"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    />
    
    {/* Calendar rings */}
    <motion.g
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <rect x="70" y="48" width="8" height="16" rx="4" fill="#ec4899" />
      <rect x="122" y="48" width="8" height="16" rx="4" fill="#ec4899" />
    </motion.g>
    
    {/* Calendar days */}
    {[0, 1, 2, 3, 4].map((row) =>
      [0, 1, 2, 3, 4, 5, 6].map((col) => (
        <motion.rect
          key={`${row}-${col}`}
          x={55 + col * 14}
          y={92 + row * 12}
          width="8"
          height="8"
          rx="2"
          fill={row === 2 && col === 3 ? "#ec4899" : "#e5e7eb"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 0.6 + (row * 7 + col) * 0.02 }}
        />
      ))
    )}
    
    {/* Floating elements */}
    <motion.circle
      cx="160" cy="45" r="8"
      fill="#fbbf24"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle
      cx="40" cy="140" r="6"
      fill="#34d399"
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.path
      d="M170 130 L175 140 L180 130"
      stroke="#f472b6"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "175px 135px" }}
    />
  </svg>
);

// Animated Clock/Time Illustration
export const TimeIllustration = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="timeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="100%" stopColor="#e9d5ff" />
      </linearGradient>
      <linearGradient id="timeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    
    <motion.circle
      cx="100" cy="100" r="90"
      fill="url(#timeGrad1)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Clock face */}
    <motion.circle
      cx="100" cy="100" r="60"
      fill="white"
      stroke="url(#timeGrad2)"
      strokeWidth="4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    />
    
    {/* Hour markers */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <motion.line
        key={angle}
        x1={100 + 48 * Math.cos((angle - 90) * Math.PI / 180)}
        y1={100 + 48 * Math.sin((angle - 90) * Math.PI / 180)}
        x2={100 + 54 * Math.cos((angle - 90) * Math.PI / 180)}
        y2={100 + 54 * Math.sin((angle - 90) * Math.PI / 180)}
        stroke={i % 3 === 0 ? "#8b5cf6" : "#d1d5db"}
        strokeWidth={i % 3 === 0 ? "3" : "2"}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + i * 0.05 }}
      />
    ))}
    
    {/* Hour hand */}
    <motion.line
      x1="100" y1="100"
      x2="100" y2="70"
      stroke="#1f2937"
      strokeWidth="4"
      strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 43200, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "100px 100px" }}
    />
    
    {/* Minute hand */}
    <motion.line
      x1="100" y1="100"
      x2="100" y2="55"
      stroke="#6b7280"
      strokeWidth="3"
      strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 3600, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "100px 100px" }}
    />
    
    {/* Second hand */}
    <motion.line
      x1="100" y1="100"
      x2="100" y2="50"
      stroke="#ec4899"
      strokeWidth="2"
      strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "100px 100px" }}
    />
    
    {/* Center dot */}
    <circle cx="100" cy="100" r="5" fill="url(#timeGrad2)" />
    
    {/* Decorative elements */}
    <motion.circle
      cx="45" cy="50" r="10"
      fill="#fce7f3"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="160" cy="150" r="8"
      fill="#d1fae5"
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
    />
  </svg>
);

// Animated People/Meeting Illustration
export const MeetingIllustration = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="meetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d1fae5" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
      <linearGradient id="meetGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
      <linearGradient id="meetGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    
    <motion.circle
      cx="100" cy="100" r="90"
      fill="url(#meetGrad1)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Person 1 */}
    <motion.g
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <circle cx="65" cy="85" r="18" fill="url(#meetGrad2)" />
      <ellipse cx="65" cy="130" rx="22" ry="28" fill="url(#meetGrad2)" />
    </motion.g>
    
    {/* Person 2 */}
    <motion.g
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <circle cx="135" cy="85" r="18" fill="url(#meetGrad3)" />
      <ellipse cx="135" cy="130" rx="22" ry="28" fill="url(#meetGrad3)" />
    </motion.g>
    
    {/* Connection line */}
    <motion.path
      d="M85 100 Q100 80 115 100"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="5,5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
    />
    
    {/* Sparkles */}
    <motion.g
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <path d="M100 60 L102 65 L107 67 L102 69 L100 74 L98 69 L93 67 L98 65 Z" fill="#fbbf24" />
    </motion.g>
    
    <motion.circle
      cx="50" cy="55" r="5"
      fill="#34d399"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="155" cy="50" r="4"
      fill="#f472b6"
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
    />
  </svg>
);

// Animated Success/Checkmark Illustration
export const SuccessIllustration = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="successGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d1fae5" />
        <stop offset="100%" stopColor="#a7f3d0" />
      </linearGradient>
      <linearGradient id="successGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    
    <motion.circle
      cx="100" cy="100" r="90"
      fill="url(#successGrad1)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    <motion.circle
      cx="100" cy="100" r="55"
      fill="url(#successGrad2)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
    />
    
    <motion.path
      d="M70 100 L90 120 L130 80"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    />
    
    {/* Celebration particles */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.circle
        key={angle}
        cx={100 + 75 * Math.cos((angle) * Math.PI / 180)}
        cy={100 + 75 * Math.sin((angle) * Math.PI / 180)}
        r="4"
        fill={["#fbbf24", "#ec4899", "#8b5cf6", "#3b82f6"][i % 4]}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.7] }}
        transition={{ duration: 0.5, delay: 0.7 + i * 0.05 }}
      />
    ))}
  </svg>
);

// Animated Empty State Illustration
export const EmptyStateIllustration = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="emptyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f3f4f6" />
        <stop offset="100%" stopColor="#e5e7eb" />
      </linearGradient>
    </defs>
    
    <motion.circle
      cx="100" cy="100" r="90"
      fill="url(#emptyGrad1)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Folder */}
    <motion.path
      d="M50 70 L50 140 Q50 150 60 150 L140 150 Q150 150 150 140 L150 80 Q150 70 140 70 L105 70 L95 60 L60 60 Q50 60 50 70 Z"
      fill="white"
      stroke="#d1d5db"
      strokeWidth="2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    
    {/* Folder tab */}
    <motion.path
      d="M50 70 L50 75 L150 75 L150 70 L105 70 L95 60 L60 60 Q50 60 50 70 Z"
      fill="#e5e7eb"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    />
    
    {/* Question mark */}
    <motion.text
      x="100"
      y="125"
      textAnchor="middle"
      fontSize="40"
      fill="#9ca3af"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      ?
    </motion.text>
    
    {/* Floating dots */}
    <motion.circle
      cx="45" cy="50" r="6"
      fill="#fce7f3"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.circle
      cx="160" cy="45" r="5"
      fill="#dbeafe"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
    />
    <motion.circle
      cx="155" cy="160" r="4"
      fill="#d1fae5"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
    />
  </svg>
);

// Animated AI/Magic Illustration
export const AIIllustration = ({ className = "w-64 h-64" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aiGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="50%" stopColor="#f3e8ff" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
      <linearGradient id="aiGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    
    <motion.circle
      cx="100" cy="100" r="90"
      fill="url(#aiGrad1)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Magic wand */}
    <motion.g
      initial={{ rotate: -30, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ transformOrigin: "100px 100px" }}
    >
      <rect x="85" y="60" width="12" height="80" rx="6" fill="url(#aiGrad2)" />
      <rect x="80" y="55" width="22" height="20" rx="4" fill="#fbbf24" />
    </motion.g>
    
    {/* Sparkles around wand */}
    {[
      { x: 60, y: 50, delay: 0.4 },
      { x: 140, y: 60, delay: 0.5 },
      { x: 50, y: 100, delay: 0.6 },
      { x: 150, y: 110, delay: 0.7 },
      { x: 70, y: 150, delay: 0.8 },
      { x: 130, y: 145, delay: 0.9 }
    ].map((spark, i) => (
      <motion.g
        key={i}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ duration: 0.4, delay: spark.delay, repeat: Infinity, repeatDelay: 2 }}
      >
        <path
          d={`M${spark.x} ${spark.y - 8} L${spark.x + 2} ${spark.y - 2} L${spark.x + 8} ${spark.y} L${spark.x + 2} ${spark.y + 2} L${spark.x} ${spark.y + 8} L${spark.x - 2} ${spark.y + 2} L${spark.x - 8} ${spark.y} L${spark.x - 2} ${spark.y - 2} Z`}
          fill={["#fbbf24", "#ec4899", "#a855f7", "#3b82f6", "#10b981", "#f472b6"][i]}
        />
      </motion.g>
    ))}
    
    {/* Orbiting particles */}
    <motion.circle
      cx="100"
      cy="30"
      r="5"
      fill="#ec4899"
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "100px 100px" }}
    />
    <motion.circle
      cx="100"
      cy="170"
      r="4"
      fill="#3b82f6"
      animate={{ rotate: -360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "100px 100px" }}
    />
  </svg>
);

export default {
  Logo,
  AnimatedLogo,
  CalendarIllustration,
  TimeIllustration,
  MeetingIllustration,
  SuccessIllustration,
  EmptyStateIllustration,
  AIIllustration
};
