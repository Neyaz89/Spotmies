<p align="center">
  <img src="https://img.shields.io/badge/Schedulr-AI%20Powered-blueviolet?style=for-the-badge&logo=calendar&logoColor=white" alt="Schedulr"/>
</p>

<h1 align="center">📅 Schedulr</h1>
<h3 align="center">AI-Powered Interview Scheduling Platform</h3>

<p align="center">
  <strong>Effortlessly match availability and schedule interviews with intelligent AI matching</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Groq-AI-FF6B6B?style=flat-square&logo=openai" alt="Groq AI"/>
  <img src="https://img.shields.io/badge/MailerSend-Email-0066FF?style=flat-square&logo=mail.ru" alt="MailerSend"/>
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind"/>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-screenshots">Screenshots</a>
</p>

---

## ✨ Features

### 🤖 AI-Powered Scheduling
- **Natural Language Parsing** - Enter availability like "Monday 9am-5pm, Wednesday afternoon"
- **Smart Matching Algorithm** - Finds optimal overlapping time slots with scoring
- **Intelligent Suggestions** - Proposes up to 3 best interview times

### 👥 User Management
- **Role-Based Access** - Separate flows for Candidates and Interviewers
- **Secure Authentication** - JWT-based auth with encrypted passwords
- **Profile Management** - Skills, timezone, department settings

### 📧 Email Notifications
- **Automated Invites** - Email notifications for interview proposals
- **Calendar Integration** - .ICS file attachments for easy calendar import
- **Status Updates** - Notifications for confirmations and cancellations

### 🎨 Premium UI/UX
- **Pastel Dream Theme** - Soft gradients and glass-morphism design
- **Custom SVG Illustrations** - Hand-crafted animated illustrations
- **Micro-interactions** - Smooth animations powered by Framer Motion
- **Responsive Design** - Beautiful on desktop, tablet, and mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework with Hooks |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **React Hook Form** | Form management with Zod validation |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **date-fns** | Date manipulation |
| **Lucide React** | Beautiful icons |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **express-validator** | Input validation |

### Services
| Service | Purpose |
|---------|---------|
| **Groq AI** | Natural language availability parsing |
| **MailerSend** | Transactional emails with .ICS attachments |

---

## 🚀 Quick Start

### Prerequisites

```
Node.js 18+
npm or yarn
MongoDB Atlas account
Groq API key
MailerSend API key
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/schedulr.git
cd schedulr
```

**2. Install all dependencies**
```bash
npm run install-all
```

**3. Configure environment variables**
```bash
cp .env.template .env
```

Edit `.env` with your credentials:
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/schedulr

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-key-min-32-chars

# Groq AI
GROQ_API_KEY=gsk_your_groq_api_key

# MailerSend
MAILERSEND_API_KEY=mlsn.your_mailersend_key
MAILERSEND_FROM_EMAIL=noreply@your-domain.mlsender.net
MAILERSEND_FROM_NAME=Schedulr

# Server
PORT=5000
CLIENT_URL=http://localhost:3000
```

**4. Start development servers**
```bash
npm run dev
```

🎉 **App is now running!**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📁 Project Structure

```
schedulr/
├── 📂 client/                    # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/        # Reusable components
│   │   │   ├── 📂 illustrations/ # Custom SVG illustrations
│   │   │   ├── Layout.jsx        # Main layout with sidebar
│   │   │   └── LoadingSpinner.jsx
│   │   ├── 📂 context/           # React Context
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   ├── 📂 pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Availability.jsx
│   │   │   ├── Interviews.jsx
│   │   │   ├── InterviewDetail.jsx
│   │   │   ├── ScheduleInterview.jsx
│   │   │   └── Profile.jsx
│   │   ├── 📂 services/          # API services
│   │   │   └── api.js
│   │   ├── App.jsx               # Main app with routes
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── 📂 server/                    # Express Backend
│   ├── 📂 models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Availability.js
│   │   └── Interview.js
│   ├── 📂 routes/                # API routes
│   │   ├── auth.js
│   │   ├── availability.js
│   │   ├── interviews.js
│   │   └── matching.js
│   ├── 📂 services/              # Business logic
│   │   ├── aiParser.js           # Groq AI integration
│   │   ├── emailService.js       # MailerSend integration
│   │   └── matchingAlgorithm.js  # Slot matching logic
│   ├── 📂 middleware/
│   │   └── auth.js               # JWT authentication
│   └── index.js                  # Server entry point
│
├── .env.template                 # Environment template
├── postman_collection.json       # API testing collection
├── package.json                  # Root package.json
└── README.md
```

---

## 📡 API Reference

### Base URL
```
Development: http://localhost:5000/api
```

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login & get token |
| `GET` | `/auth/me` | Get current user |
| `PATCH` | `/auth/profile` | Update profile |
| `GET` | `/auth/candidates` | List all candidates |
| `GET` | `/auth/interviewers` | List all interviewers |

### 📅 Availability

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/availability` | Get my availability |
| `POST` | `/availability` | Add availability slots |
| `POST` | `/availability/parse` | AI parse free-text |
| `POST` | `/availability/save-parsed` | Save AI-parsed slots |
| `DELETE` | `/availability/:id` | Delete availability |

### 🎯 Matching

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/matching/find-slots` | Find optimal interview slots |
| `POST` | `/matching/propose` | Create interview proposal |

### 📋 Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/interviews` | List all interviews |
| `GET` | `/interviews/:id` | Get interview details |
| `POST` | `/interviews/:id/select-slot` | Candidate selects time |
| `POST` | `/interviews/:id/confirm` | Confirm interview |
| `POST` | `/interviews/:id/cancel` | Cancel interview |
| `POST` | `/interviews/:id/feedback` | Submit feedback |

### ❤️ Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens (min 32 chars) |
| `GROQ_API_KEY` | ✅ | Groq AI API key for NLP parsing |
| `MAILERSEND_API_KEY` | ✅ | MailerSend API key |
| `MAILERSEND_FROM_EMAIL` | ✅ | Verified sender email |
| `MAILERSEND_FROM_NAME` | ❌ | Sender display name |
| `PORT` | ❌ | Server port (default: 5000) |
| `CLIENT_URL` | ❌ | Frontend URL for CORS |

---

## 🧪 Testing with Postman

1. Import `postman_collection.json` into Postman
2. Set up environment with `baseUrl` = `http://localhost:5000/api`
3. Run **Register** → **Login** (token auto-saves)
4. Test all endpoints with saved token

---

## 📱 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER REGISTRATION                       │
│  Candidate/Interviewer creates account with role selection  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SET AVAILABILITY                          │
│  • Manual: Select dates and time ranges                     │
│  • AI: Type "Monday 9-5, Wednesday afternoon" → parsed!     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SMART MATCHING                             │
│  Algorithm finds overlapping slots and scores them          │
│  Returns top 3 optimal interview times                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  INTERVIEW PROPOSAL                          │
│  Interviewer proposes slots → Candidate receives email      │
│  Candidate can ACCEPT (select slot) or DECLINE              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONFIRMATION                              │
│  Both parties receive calendar invite (.ICS)                │
│  Interview appears in dashboard as "Confirmed"              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     FEEDBACK                                 │
│  After interview, interviewer submits rating & comments     │
│  Interview marked as "Completed"                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Components

### Custom Illustrations
- `CalendarIllustration` - Animated calendar with floating elements
- `TimeIllustration` - Clock with moving hands
- `MeetingIllustration` - Two people connecting
- `SuccessIllustration` - Checkmark with celebration particles
- `EmptyStateIllustration` - Friendly empty folder
- `AIIllustration` - Magic wand with sparkles
- `Logo` - Professional brand logo

### Design System
- **Colors**: Pastel pink, purple, blue, mint gradients
- **Cards**: Glass-morphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover animations
- **Inputs**: Rounded corners with focus glow effects
- **Animations**: Fade, slide, scale, float effects

---

## 📜 Scripts

```bash
# Install all dependencies (root + client + server)
npm run install-all

# Start both servers in development
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
cd client && npm run build
```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ MongoDB injection prevention via Mongoose

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>Built with ❤️ for seamless interview scheduling</strong>
</p>

<p align="center">
  <sub>© 2026 Schedulr. All rights reserved.</sub>
</p>
