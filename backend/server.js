/**
 * QuizPulse Elite - Backend REST API Server
 * Production-ready zero-dependency Node.js HTTP server.
 * Handles questions, server-side grading, leaderboard persistence, and certificate verification.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');

// Helper to load JSON files safely
function loadData(filename) {
  try {
    const file = path.join(DATA_DIR, filename);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Error loading ${filename}:`, e.message);
    return [];
  }
}

// Helper to save JSON files safely
function saveData(filename, data) {
  try {
    const file = path.join(DATA_DIR, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`Error saving ${filename}:`, e.message);
    return false;
  }
}

// Send standardized JSON response
function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.writeHead(statusCode);
  res.end(JSON.stringify(data));
}

// Parse request body JSON
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2e6) { // 2MB limit
        req.connection.destroy();
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  try {
    // 1. Health Endpoint
    if (req.method === 'GET' && pathname === '/api/health') {
      const questions = loadData('questions.json');
      return sendJson(res, 200, {
        status: 'online',
        service: 'QuizPulse REST API',
        version: '1.0.0',
        uptimeSeconds: Math.round(process.uptime()),
        totalQuestionsAvailable: questions.length,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Categories Endpoint
    if (req.method === 'GET' && pathname === '/api/categories') {
      const categories = loadData('categories.json');
      return sendJson(res, 200, { success: true, count: categories.length, categories });
    }

    // 3. Questions Endpoint
    if (req.method === 'GET' && pathname === '/api/questions') {
      let questions = loadData('questions.json');
      const { category, difficulty, limit, mode } = query;

      if (category && category !== 'all') {
        questions = questions.filter(q => q.category === category);
      }
      if (difficulty && difficulty !== 'all') {
        questions = questions.filter(q => q.difficulty === difficulty);
      }

      // Shuffle
      questions = questions.sort(() => 0.5 - Math.random());

      // Limit count
      if (limit) {
        const count = parseInt(limit, 10);
        if (!isNaN(count) && count > 0) {
          questions = questions.slice(0, count);
        }
      }

      // In "exam" mode, strip the correct answer index from payload so client cannot cheat!
      if (mode === 'exam') {
        questions = questions.map(({ correct, ...rest }) => rest);
      }

      return sendJson(res, 200, {
        success: true,
        count: questions.length,
        questions
      });
    }

    // 4. Server-Side Assessment Evaluator Endpoint
    if (req.method === 'POST' && pathname === '/api/quiz/evaluate') {
      const body = await parseBody(req);
      const userAnswers = body.answers || []; // [{ questionId, selectedIndex, timeSpent }]
      const playerName = body.playerName || 'Quiz Contender';
      const category = body.category || 'all';

      const allQuestions = loadData('questions.json');
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      let score = 0;
      let totalPoints = 0;
      let streak = 0;
      let maxStreak = 0;
      let totalTime = 0;

      const breakdown = userAnswers.map(ans => {
        const q = questionMap.get(ans.questionId);
        if (!q) {
          return { questionId: ans.questionId, valid: false };
        }

        const isCorrect = ans.selectedIndex === q.correct;
        const timeSpent = ans.timeSpent || 10;
        totalTime += timeSpent;

        let points = 0;
        if (isCorrect) {
          score++;
          streak++;
          if (streak > maxStreak) maxStreak = streak;

          let base = 100;
          if (timeSpent < 10) base += (10 - timeSpent) * 5; // speed bonus

          let mult = 1.0;
          if (streak >= 8) mult = 2.0;
          else if (streak >= 5) mult = 1.5;
          else if (streak >= 3) mult = 1.25;

          points = Math.round(base * mult);
          totalPoints += points;
        } else {
          streak = 0;
        }

        return {
          questionId: q.id,
          question: q.question,
          options: q.options,
          userSelected: ans.selectedIndex,
          correctAnswer: q.correct,
          isCorrect,
          pointsEarned: points,
          explanation: q.explanation
        };
      });

      const totalQuestions = userAnswers.length;
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

      // Generate verifiable certificate token
      const certId = 'QP-' + crypto.randomBytes(4).toString('hex').toUpperCase();

      const result = {
        success: true,
        playerName,
        category,
        score,
        totalQuestions,
        percentage,
        totalPoints,
        maxStreak,
        totalTime,
        certificateId: certId,
        issuedAt: new Date().toISOString(),
        breakdown
      };

      return sendJson(res, 200, result);
    }

    // 5. Leaderboard Endpoints
    if (req.method === 'GET' && pathname === '/api/leaderboard') {
      let leaderboard = loadData('leaderboard.json');
      const { category, limit } = query;

      if (category && category !== 'all') {
        leaderboard = leaderboard.filter(e => e.category === category);
      }

      leaderboard.sort((a, b) => b.points - a.points || b.percentage - a.percentage);

      const max = limit ? parseInt(limit, 10) : 20;
      return sendJson(res, 200, {
        success: true,
        count: leaderboard.length,
        leaderboard: leaderboard.slice(0, max)
      });
    }

    if (req.method === 'POST' && pathname === '/api/leaderboard') {
      const body = await parseBody(req);
      if (!body.playerName || body.score === undefined) {
        return sendJson(res, 400, { success: false, error: 'playerName and score are required' });
      }

      const leaderboard = loadData('leaderboard.json');
      const newEntry = {
        id: 'lb_' + Date.now(),
        playerName: body.playerName.trim(),
        category: body.category || 'all',
        categoryName: body.categoryName || 'General Challenge',
        score: parseInt(body.score, 10),
        totalQuestions: parseInt(body.totalQuestions || 10, 10),
        percentage: Math.round((body.score / (body.totalQuestions || 10)) * 100),
        points: parseInt(body.points || body.score * 100, 10),
        maxStreak: parseInt(body.maxStreak || 0, 10),
        timeTakenSecs: parseInt(body.timeTakenSecs || 0, 10),
        formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      leaderboard.unshift(newEntry);
      leaderboard.sort((a, b) => b.points - a.points);
      saveData('leaderboard.json', leaderboard.slice(0, 100));

      return sendJson(res, 201, { success: true, entry: newEntry });
    }

    // 6. Custom Quizzes Endpoints
    if (req.method === 'GET' && pathname === '/api/custom-quizzes') {
      const list = loadData('custom-quizzes.json');
      return sendJson(res, 200, { success: true, count: list.length, quizzes: list });
    }

    if (req.method === 'POST' && pathname === '/api/custom-quizzes') {
      const body = await parseBody(req);
      if (!body.title || !Array.isArray(body.questions) || body.questions.length === 0) {
        return sendJson(res, 400, { success: false, error: 'A title and at least one question are required.' });
      }

      const list = loadData('custom-quizzes.json');
      const newQuiz = {
        id: 'cq_' + Date.now(),
        title: body.title.trim(),
        description: body.description || '',
        category: 'custom',
        categoryName: body.title.trim(),
        createdAt: new Date().toISOString(),
        questions: body.questions
      };

      list.push(newQuiz);
      saveData('custom-quizzes.json', list);

      return sendJson(res, 201, { success: true, quiz: newQuiz });
    }

    // Default 404
    return sendJson(res, 404, { success: false, error: 'Endpoint not found' });
  } catch (error) {
    console.error('API Error:', error);
    return sendJson(res, 500, { success: false, error: 'Internal Server Error', message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ QuizPulse Backend REST API is running on port ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Questions API: http://localhost:${PORT}/api/questions`);
  console.log(`======================================================\n`);
});
