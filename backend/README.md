# ⚡ QuizPulse Elite — Backend REST API

A zero-dependency, production-ready Node.js REST API providing questions, grading, leaderboard ranking, and certificate authentication for the QuizPulse platform.

---

## 🚀 Quick Start

### 1. Run the Server
```bash
node server.js
```
The server will start at `http://localhost:5000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service uptime and question counts |
| `GET` | `/api/categories` | List all available quiz categories |
| `GET` | `/api/questions` | Query params: `category`, `difficulty`, `limit`, `mode=exam` |
| `POST` | `/api/quiz/evaluate` | Server-side exam grading & certificate token generator |
| `GET` | `/api/leaderboard` | Hall of fame top rankings |
| `POST` | `/api/leaderboard` | Submit player score |
| `GET` | `/api/custom-quizzes` | Fetch user community quizzes |
| `POST` | `/api/custom-quizzes` | Publish a new custom quiz |

---

## 🌐 Deployment

### Deploy to Render / Railway / Heroku
- **Build Command**: *(leave empty)*
- **Start Command**: `node server.js`
- Port is automatically read from `process.env.PORT`.

### Deploy with Docker
```bash
docker build -t quizpulse-backend .
docker run -p 5000:5000 quizpulse-backend
```
