/**
 * QuizPulse Elite - Core Game Engine
 * Manages game loop, scoring, timer, streak multipliers, lifelines, and analytics
 */

class QuizEngine {
  constructor() {
    this.config = {
      category: 'web-dev',
      difficulty: 'all',
      questionCount: 10,
      timePerQuestion: 20, // 0 for untimed
      instantFeedback: true
    };

    this.questions = [];
    this.currentIndex = 0;
    this.selectedOption = null;
    this.answersRecord = [];
    this.score = 0;
    this.points = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timer = null;
    this.timeRemaining = 0;
    this.questionStartTime = 0;
    this.isAnswered = false;
    this.lifelines = {
      fiftyFifty: true,
      extraTime: true,
      skip: true
    };
    this.status = 'idle'; // 'idle' | 'running' | 'completed'

    // Event hooks
    this.onStateChange = null;
    this.onTimerTick = null;
    this.onQuizEnd = null;
  }

  startQuiz(customQuestions = null, customConfig = null) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    if (customQuestions && customQuestions.length > 0) {
      this.questions = this.shuffle([...customQuestions]);
    } else {
      this.questions = this.prepareQuestions();
    }

    if (this.questions.length === 0) {
      alert('No questions found for the selected criteria.');
      return false;
    }

    // Slice to question count
    if (this.config.questionCount > 0 && this.questions.length > this.config.questionCount) {
      this.questions = this.questions.slice(0, this.config.questionCount);
    }

    this.currentIndex = 0;
    this.selectedOption = null;
    this.answersRecord = [];
    this.score = 0;
    this.points = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.isAnswered = false;
    this.lifelines = {
      fiftyFifty: true,
      extraTime: true,
      skip: true
    };
    this.status = 'running';

    this.loadQuestion();
    return true;
  }

  prepareQuestions() {
    const all = getCombinedQuestions();
    let filtered = all;

    if (this.config.category !== 'all') {
      filtered = filtered.filter(q => q.category === this.config.category);
    }

    if (this.config.difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === this.config.difficulty);
    }

    return this.shuffle(filtered);
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  loadQuestion() {
    this.clearInterval();
    this.isAnswered = false;
    this.selectedOption = null;
    this.questionStartTime = Date.now();

    const question = this.questions[this.currentIndex];
    this.timeRemaining = this.config.timePerQuestion;

    if (this.config.timePerQuestion > 0) {
      this.startTimer();
    }

    if (this.onStateChange) {
      this.onStateChange({
        question,
        index: this.currentIndex,
        total: this.questions.length,
        score: this.score,
        points: this.points,
        streak: this.streak,
        lifelines: { ...this.lifelines }
      });
    }
  }

  startTimer() {
    this.clearInterval();
    if (this.onTimerTick) {
      this.onTimerTick(this.timeRemaining, 100);
    }

    this.timer = setInterval(() => {
      this.timeRemaining--;

      const percent = Math.max(0, (this.timeRemaining / this.config.timePerQuestion) * 100);

      if (this.onTimerTick) {
        this.onTimerTick(this.timeRemaining, percent);
      }

      if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
        sounds.playWarningTick();
      } else if (this.timeRemaining > 5) {
        sounds.playTimerTick();
      }

      if (this.timeRemaining <= 0) {
        this.clearInterval();
        this.handleTimeout();
      }
    }, 1000);
  }

  clearInterval() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  handleTimeout() {
    if (this.isAnswered) return;
    this.selectAnswer(-1, true); // -1 = timed out / no answer
  }

  selectAnswer(optionIndex, isTimeout = false) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.clearInterval();

    const currentQ = this.questions[this.currentIndex];
    const timeSpent = Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000));
    const isCorrect = !isTimeout && optionIndex === currentQ.correct;

    let pointsEarned = 0;

    if (isCorrect) {
      this.score++;
      this.streak++;
      if (this.streak > this.maxStreak) {
        this.maxStreak = this.streak;
      }

      // Base 100 + Speed Bonus (up to 50 if fast)
      let base = 100;
      if (this.config.timePerQuestion > 0) {
        const timeRatio = Math.max(0, (this.timeRemaining / this.config.timePerQuestion));
        base += Math.round(timeRatio * 50);
      }

      // Combo multiplier
      let mult = 1.0;
      if (this.streak >= 8) mult = 2.0;
      else if (this.streak >= 5) mult = 1.5;
      else if (this.streak >= 3) mult = 1.25;

      pointsEarned = Math.round(base * mult);
      this.points += pointsEarned;

      if (this.streak >= 3) {
        sounds.playStreak(this.streak);
      } else {
        sounds.playCorrect();
      }
    } else {
      this.streak = 0;
      sounds.playWrong();
    }

    const record = {
      questionId: currentQ.id,
      question: currentQ.question,
      code: currentQ.code || null,
      options: currentQ.options,
      selected: optionIndex,
      correct: currentQ.correct,
      isCorrect,
      isTimeout,
      timeSpent,
      pointsEarned,
      explanation: currentQ.explanation
    };

    this.answersRecord.push(record);

    return {
      record,
      score: this.score,
      points: this.points,
      streak: this.streak,
      pointsEarned
    };
  }

  useLifeline5050() {
    if (!this.lifelines.fiftyFifty || this.isAnswered) return null;
    this.lifelines.fiftyFifty = false;
    sounds.playLifeline();

    const currentQ = this.questions[this.currentIndex];
    const incorrectIndices = currentQ.options
      .map((_, i) => i)
      .filter(i => i !== currentQ.correct);

    // Shuffle and pick 2 incorrect
    const shuffledIncorrect = this.shuffle(incorrectIndices);
    const toRemove = shuffledIncorrect.slice(0, 2);

    return toRemove;
  }

  useLifelineExtraTime() {
    if (!this.lifelines.extraTime || this.isAnswered || this.config.timePerQuestion === 0) return false;
    this.lifelines.extraTime = false;
    sounds.playLifeline();
    this.timeRemaining += 15;
    if (this.onTimerTick) {
      const pct = Math.min(100, (this.timeRemaining / this.config.timePerQuestion) * 100);
      this.onTimerTick(this.timeRemaining, pct);
    }
    return true;
  }

  useLifelineSkip() {
    if (!this.lifelines.skip || this.isAnswered) return false;
    this.lifelines.skip = false;
    sounds.playLifeline();
    this.clearInterval();

    // Record as skipped
    const currentQ = this.questions[this.currentIndex];
    this.answersRecord.push({
      questionId: currentQ.id,
      question: currentQ.question,
      options: currentQ.options,
      selected: -2, // -2 = skipped
      correct: currentQ.correct,
      isCorrect: false,
      isSkipped: true,
      timeSpent: Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000)),
      pointsEarned: 0,
      explanation: currentQ.explanation
    });

    this.nextQuestion();
    return true;
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.loadQuestion();
    } else {
      this.completeQuiz();
    }
  }

  completeQuiz() {
    this.clearInterval();
    this.status = 'completed';

    const totalQuestions = this.questions.length;
    const percentage = Math.round((this.score / totalQuestions) * 100);
    const totalTime = this.answersRecord.reduce((acc, r) => acc + (r.timeSpent || 0), 0);

    const summary = {
      category: this.config.category,
      categoryName: this.getCategoryName(this.config.category),
      score: this.score,
      totalQuestions,
      percentage,
      points: this.points,
      maxStreak: this.maxStreak,
      totalTime,
      records: this.answersRecord,
      badge: this.getBadge(percentage)
    };

    if (percentage >= 80) {
      confetti.burst(150);
      sounds.playFanfare();
    } else if (percentage >= 50) {
      confetti.burst(80);
      sounds.playFanfare();
    }

    if (this.onQuizEnd) {
      this.onQuizEnd(summary);
    }

    return summary;
  }

  getBadge(percentage) {
    if (percentage === 100) return { title: 'Flawless Mastermind', icon: '👑', color: '#f59e0b' };
    if (percentage >= 80) return { title: 'Grand Scholar', icon: '🏆', color: '#6366f1' };
    if (percentage >= 60) return { title: 'Knowledge Warrior', icon: '⚡', color: '#06b6d4' };
    if (percentage >= 40) return { title: 'Keen Apprentice', icon: '🎯', color: '#10b981' };
    return { title: 'Curious Novice', icon: '🌱', color: '#8b5cf6' };
  }

  getCategoryName(catId) {
    const found = QUIZ_CATEGORIES.find(c => c.id === catId);
    return found ? found.name : 'Custom Quiz';
  }
}

const quizEngine = new QuizEngine();
