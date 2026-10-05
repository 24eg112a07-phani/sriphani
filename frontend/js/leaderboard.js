/**
 * QuizPulse Elite - Leaderboard & Player Stats Engine
 * Manages player progression, XP, badges, past attempts, and local Hall of Fame
 */

class LeaderboardManager {
  constructor() {
    this.storageKey = 'quizpulse_leaderboard';
    this.statsKey = 'quizpulse_player_stats';
  }

  getEntries() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  saveEntry(entry) {
    const entries = this.getEntries();
    const newEntry = {
      id: 'qb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      playerName: entry.playerName || 'Anonymous Explorer',
      category: entry.category,
      categoryName: entry.categoryName,
      score: entry.score,
      totalQuestions: entry.totalQuestions,
      percentage: Math.round((entry.score / entry.totalQuestions) * 100),
      points: entry.points || entry.score * 100,
      maxStreak: entry.maxStreak || 0,
      timeTakenSecs: entry.timeTakenSecs || 0,
      date: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    entries.unshift(newEntry);
    // Keep top 100 entries
    if (entries.length > 100) {
      entries.length = 100;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
    this.updateAggregatedStats(newEntry);
    return newEntry;
  }

  updateAggregatedStats(entry) {
    const stats = this.getStats();
    stats.quizzesPlayed = (stats.quizzesPlayed || 0) + 1;
    stats.totalScore = (stats.totalScore || 0) + entry.score;
    stats.totalQuestions = (stats.totalQuestions || 0) + entry.totalQuestions;
    stats.totalPoints = (stats.totalPoints || 0) + entry.points;
    stats.bestStreak = Math.max(stats.bestStreak || 0, entry.maxStreak);
    
    // XP calculation: 100 pts per correct answer + bonus for streaks
    stats.xp = (stats.xp || 0) + entry.points;
    stats.level = Math.floor(stats.xp / 1000) + 1;

    localStorage.setItem(this.statsKey, JSON.stringify(stats));
  }

  getStats() {
    try {
      const raw = localStorage.getItem(this.statsKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return {
      quizzesPlayed: 0,
      totalScore: 0,
      totalQuestions: 0,
      totalPoints: 0,
      bestStreak: 0,
      xp: 0,
      level: 1
    };
  }

  getLevelTitle(level) {
    if (level >= 25) return '👑 Grand Quizmaster Sovereign';
    if (level >= 15) return '⚡ Mythic Knowledge Sage';
    if (level >= 10) return '🔥 Master Brainiac';
    if (level >= 5) return '🚀 Senior Quiz Scholar';
    if (level >= 3) return '🌟 Rising Trivia Adept';
    return '🌱 Inquisitive Novice';
  }

  getTopScores(categoryId = 'all', limit = 10) {
    const entries = this.getEntries();
    let filtered = entries;
    if (categoryId !== 'all') {
      filtered = entries.filter(e => e.category === categoryId);
    }
    // Sort primarily by points (or percentage), then time
    filtered.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return a.timeTakenSecs - b.timeTakenSecs;
    });
    return filtered.slice(0, limit);
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.statsKey);
  }
}

const leaderboard = new LeaderboardManager();
