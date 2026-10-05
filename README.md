# ⚡ QuizPulse Elite — Interactive Online Quiz Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Online-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://24eg112a07-phani.github.io/sriphani/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-22c55e?style=for-the-badge&logo=github&logoColor=white)](https://24eg112a07-phani.github.io/sriphani/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> 🎮 **Play the Live Quiz App Here:** **[https://24eg112a07-phani.github.io/sriphani/](https://24eg112a07-phani.github.io/sriphani/)**

---

## 🌟 Overview

**QuizPulse Elite** is a state-of-the-art interactive quiz & assessment web platform engineered with Vanilla JavaScript, glassmorphic CSS, Web Audio API sound synthesis, dynamic streak multipliers, verifiable certificates, and a custom quiz builder.

---

## 📁 Repository Structure

```text
24eg112a07-phani/sriphani/
│
├── 🎨 frontend/                  # Modern Single-Page Application (HTML, CSS, JS)
│   ├── index.html               # Main SPA Web Page
│   ├── css/
│   │   ├── style.css            # Dark/Light theme, glassmorphism, glow
│   │   ├── components.css       # Quiz cards, SVG circular timer, lifelines
│   │   └── animations.css       # Modals, keyframes, certificate preview
│   ├── js/
│   │   ├── audio.js             # Web Audio API sound synthesizer
│   │   ├── confetti.js          # Canvas victory celebration particles
│   │   ├── questions.js         # 50+ verified questions database
│   │   ├── quiz-engine.js       # Game loop, combos, timer, scoring
│   │   ├── leaderboard.js       # LocalStorage XP, badges, high scores
│   │   ├── custom-quiz.js       # Custom quiz creator & JSON import/export
│   │   └── app.js               # Main UI controller & certificate generator
│   ├── assets/
│   │   └── sample-quiz.json     # Test quiz file
│   ├── vercel.json              # 1-click Vercel routing
│   ├── netlify.toml             # 1-click Netlify deployment
│   ├── package.json
│   └── README.md
│
├── ⚙️ backend/                   # Complete REST API Server
│   ├── server.js                # Zero-dependency Node.js REST API
│   ├── data/
│   │   ├── questions.json       # Questions dataset
│   │   ├── categories.json      # Categories dataset
│   │   ├── leaderboard.json     # Persistent server leaderboard
│   │   └── custom-quizzes.json  # Custom user-created quizzes
│   ├── Dockerfile               # Container deployment definition
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── index.html                   # Automatic root redirect for GitHub Pages
└── README.md                    # Project documentation & live links
```

---

## 🚀 Running Locally

### 1. Frontend
Open `frontend/index.html` in any web browser, or:
```bash
cd frontend
npx serve .
```

### 2. Backend (REST API)
```bash
cd backend
node server.js
```
API runs on `http://localhost:5000`.

---

## 🌐 Live Deployments

- 🎮 **GitHub Pages Live Demo**: [https://24eg112a07-phani.github.io/sriphani/](https://24eg112a07-phani.github.io/sriphani/)
- ☁️ **Deploy to Vercel**: Connect your repo, set Root Directory to `frontend`, and click **Deploy**.
- ☁️ **Deploy to Netlify**: Drag & drop the `frontend` folder into [app.netlify.com/drop](https://app.netlify.com/drop).
