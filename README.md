# VentureWise — Entrepreneurship Platform

> Empowering women, youth, and rural entrepreneurs to discover, plan, and launch their own businesses.

---

## 📖 Overview

VentureWise is a full-stack web platform that helps first-time entrepreneurs:
- **Discover** curated business ideas matched to their skills and budget
- **Plan** with step-by-step roadmaps (validation, legal, costs, marketing)
- **Learn** through free videos, articles, checklists, and templates
- **Connect** with verified business mentors for personalised guidance
- **Track** their entrepreneurship journey on a personal dashboard

### Target Audience
- 👩 Women entrepreneurs (home-based, flexible ideas)
- 🧑‍🎓 Youth (digital, service, low-investment ideas)
- 🌾 Rural entrepreneurs (agriculture, crafts, local services)

---

## 🚀 Features

### User Features
- ✅ Registration & login (JWT-based, role-based access)
- ✅ Skill & interest profiling (multi-step assessment)
- ✅ Personalised business idea recommendations
- ✅ Business roadmaps (validation → legal → costs → marketing)
- ✅ Learning resources (videos, articles, checklists, templates)
- ✅ Progress tracking dashboard
- ✅ Bookmark/save ideas

### Mentor Features
- ✅ Mentor registration & verification flow
- ✅ Expert profile with expertise tags
- ✅ Q&A / question answering for mentees
- ✅ Upload training resources

### Admin Features
- ✅ Platform stats dashboard
- ✅ User management (activate/deactivate)
- ✅ Approve/reject mentor registrations
- ✅ Approve/reject training resources

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS 3 |
| State | Context API (AuthContext, AppContext) |
| HTTP | Axios with JWT interceptors |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |
| Deployment | Vercel (frontend) / Railway or Render (backend) |

---

## 📁 Project Structure

```
venturewise/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── shared/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── UI.jsx          # Reusable components
│   │   ├── context/
│   │   │   ├── AuthContext.js      # Auth state + JWT handling
│   │   │   └── AppContext.js       # Global app state
│   │   ├── data/
│   │   │   └── sample.js           # Sample/fallback data
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── AuthForms.jsx       # Login + Register
│   │   │   ├── Assessment.jsx      # Skill assessment (4-step)
│   │   │   ├── Ideas.jsx           # Idea browsing + filtering
│   │   │   ├── IdeaDetail.jsx      # Roadmap viewer
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── MentorDirectory.jsx
│   │   │   ├── Training.jsx        # Learning Hub
│   │   │   └── AdminPanel.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── api.js              # Axios API layer
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   └── db.js               # MongoDB connection
    │   ├── middleware/
    │   │   ├── auth.js             # JWT protect + authorize
    │   │   └── errorHandler.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── BusinessIdea.js
    │   │   ├── Roadmap.js
    │   │   └── index.js            # Mentor, Resource, Progress, QASession
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── ideas.js
    │   │   ├── roadmaps.js
    │   │   ├── resources.js
    │   │   ├── mentors.js
    │   │   ├── progress.js
    │   │   ├── assessments.js
    │   │   ├── users.js
    │   │   └── admin.js
    │   ├── utils/
    │   │   └── seed.js             # Seed database with sample data
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas cloud)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-org/venturewise.git
cd venturewise
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed          # Seeds sample data + demo users
npm run dev           # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start             # Starts on http://localhost:3000
```

### Demo Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@venturewise.in | Admin@123 |
| Mentor | priya.mentor@venturewise.in | Mentor@123 |
| User | sunita@example.com | User@123 |

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | 🔒 | Get current user |
| PUT | `/api/auth/profile` | 🔒 | Update profile |

### Business Ideas
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ideas` | — | List ideas (filterable) |
| GET | `/api/ideas/recommended` | 🔒 | Personalised recommendations |
| GET | `/api/ideas/:id` | — | Single idea details |
| POST | `/api/ideas/:id/save` | 🔒 | Save/unsave idea |
| POST | `/api/ideas` | 🔒 Admin | Create idea |

### Roadmaps
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/roadmaps/:id` | — | Get roadmap |
| POST | `/api/roadmaps` | 🔒 Admin | Create roadmap |

### Mentors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/mentors` | — | List mentors |
| GET | `/api/mentors/:id` | — | Single mentor |
| POST | `/api/mentors/register` | 🔒 | Register as mentor |
| POST | `/api/mentors/:id/question` | 🔒 | Ask mentor a question |

### Progress
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress` | 🔒 | My progress entries |
| POST | `/api/progress` | 🔒 | Start tracking an idea |
| PUT | `/api/progress/:id` | 🔒 | Update progress/status |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | 🔒 Admin | Platform stats |
| GET | `/api/admin/users` | 🔒 Admin | All users |
| PUT | `/api/admin/users/:id/toggle` | 🔒 Admin | Activate/deactivate user |
| PUT | `/api/admin/mentors/:id/verify` | 🔒 Admin | Verify mentor |
| GET | `/api/admin/pending-content` | 🔒 Admin | Pending approvals |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
# From frontend directory
npm run build
# Deploy with Vercel CLI or connect GitHub repo to vercel.com
vercel --prod

# Environment variables on Vercel:
# REACT_APP_API_URL = https://your-backend.onrender.com/api
```

### Backend → Render / Railway
```bash
# On Render.com or Railway.app:
# 1. Connect your GitHub repository
# 2. Set root directory to /backend
# 3. Build command: npm install
# 4. Start command: npm start
# 5. Add environment variables (copy from .env.example)
```

### MongoDB → MongoDB Atlas
```bash
# 1. Create free cluster at mongodb.com/atlas
# 2. Get connection string
# 3. Set MONGO_URI in backend environment variables
# 4. Run seed: npm run seed (once)
```

### Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 5000
CMD ["node", "src/server.js"]
```

---

## 🔒 Security

- JWT tokens with 7-day expiry
- Passwords hashed with bcrypt (12 salt rounds)
- Rate limiting (100 req/15min per IP)
- Helmet.js HTTP security headers
- CORS restricted to frontend origin
- Role-based access (user / mentor / admin)
- Input validation on all endpoints

---

## 📊 Non-Functional Requirements

| Requirement | Implementation |
|-------------|----------------|
| Page load < 3s | React code splitting, static sample data fallback |
| Low-bandwidth | Minimal images, CSS-only animations, compressed assets |
| Accessible | Semantic HTML, ARIA labels, keyboard navigation |
| Modular | Context API, separated API layer, reusable components |
| Scalable | MongoDB sharding-ready schema, stateless REST API |

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built with ❤️ to empower grassroots entrepreneurs across India 🇮🇳
