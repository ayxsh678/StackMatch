# StackMatch — AI Career Intelligence

> Get a personalized readiness report for your target role. Upload your resume, describe your skills, and let AI map your path to mastery.

![StackMatch](https://img.shields.io/badge/StackMatch-AI%20Career%20Intelligence-00e5ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3%2070B-FF6B35?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)

---

## 📁 Monorepo Structure

```
StackMatch/
├── frontend/          # React app (CRA) — deployed on Vercel
│   ├── src/
│   │   └── StackMatch.jsx
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express API — deployed on Render
│   ├── server.js
│   └── package.json
├── package.json       # Root workspace config (Yarn workspaces)
└── README.md
```

---

## ✨ Features

- 🎯 **Role-based gap analysis** — select your target role and level
- 📄 **Resume parsing** — upload PDF, DOCX, or TXT resumes
- 🤖 **AI-powered analysis** — powered by Groq's LLaMA 3.3 70B
- 📧 **Email report delivery** — get your analysis in your inbox
- 📊 **Radar chart visualization** — visual skill gap breakdown

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Yarn v1.22+
- A [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/ayxsh678/StackMatch.git
cd StackMatch

# Install all dependencies (frontend + backend)
yarn install
```

### Environment Setup

**Frontend** — create `frontend/.env.local`:
```env
REACT_APP_API_URL=http://localhost:3001
```

**Backend** — create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Run Locally

```bash
# Run both frontend and backend simultaneously
yarn dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

### Run Individually

```bash
# Frontend only
yarn start:frontend

# Backend only
yarn start:backend
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | `stackmatch-*.vercel.app` |
| Backend | Render | `skill-gap-backend-s5w9.onrender.com` |

### Deploy Frontend (Vercel)

1. Connect `ayxsh678/StackMatch` repo to Vercel
2. Set **Root Directory** → `frontend`
3. Add env var: `REACT_APP_API_URL` = your Render backend URL
4. Deploy

### Deploy Backend (Render)

1. Connect `ayxsh678/StackMatch` repo to Render
2. Set **Root Directory** → `backend`
3. **Build Command** → `npm install`
4. **Start Command** → `node server.js`
5. Add env vars: `GROQ_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`

---

## 🛠 Tech Stack

### Frontend
- **React 18** (Create React App)
- **Recharts** — radar chart visualization
- Custom CSS-in-JS styling

### Backend
- **Node.js + Express**
- **Groq SDK** — LLaMA 3.3 70B inference
- **Multer** — file upload handling
- **Mammoth** — DOCX parsing
- **pdf-parse** — PDF text extraction
- **Nodemailer** — email delivery

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Run frontend + backend concurrently |
| `yarn build` | Build frontend for production |
| `yarn start:frontend` | Start frontend only |
| `yarn start:backend` | Start backend only |

---

## 🗂 Related

- **skill-gap-backend** (archived) — original standalone backend, now merged into this monorepo

---

## 👤 Author

**Ayush Verma**
- GitHub: [@ayxsh678](https://github.com/ayxsh678)
- LinkedIn: [ayushverma567](https://linkedin.com/in/ayushverma567)

---

<p align="center">Built with ❤️ using Groq + React + Node.js</p>