# ⚡ QuizPulse Elite — Full-Stack Project

This full-stack project includes both the **Frontend Web App** and the **Backend REST API**.

---

## 📁 Repository Structure

```text
online-quiz-fullstack/
├── frontend/             # Single-Page Application (HTML, CSS Glassmorphism, JS)
│   ├── index.html        # App interface
│   ├── css/              # Design tokens, gameplay styles & animations
│   ├── js/               # Game loop, sound synthesis, confetti, certificates
│   ├── assets/           # Sample quiz files
│   ├── vercel.json       # 1-click Vercel deployment
│   ├── netlify.toml      # 1-click Netlify deployment
│   └── package.json
│
└── backend/              # Node.js REST API Server
    ├── server.js         # API Server (Zero dependencies required)
    ├── data/             # JSON datasets (questions, leaderboard, custom quizzes)
    ├── Dockerfile        # Container build definition
    ├── .env.example
    └── package.json
```

---

## 🚀 Running the Full Stack Locally

### 1. Start the Backend API (Port 5000)
```bash
cd backend
node server.js
```
Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Start the Frontend (Port 3000 or Browser)
Open `frontend/index.html` directly in your browser, or:
```bash
cd frontend
npx serve .
```

---

## 🌐 Deploying

- **Frontend**: Deploy to [Netlify Drop](https://app.netlify.com/drop), Vercel, or GitHub Pages.
- **Backend**: Deploy to Render, Railway, Heroku, or Docker.
