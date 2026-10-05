/**
 * QuizPulse Elite - Main Application Controller
 * Handles UI interactions, screens, modals, certificate rendering, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const navLeaderboardBtn = document.getElementById('nav-leaderboard-btn');
  const navCustomQuizBtn = document.getElementById('nav-custom-quiz-btn');

  // Screens
  const screenHome = document.getElementById('screen-home');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResults = document.getElementById('screen-results');

  // Home controls
  const categoryGrid = document.getElementById('category-grid');
  const difficultyButtons = document.querySelectorAll('.filter-pill[data-difficulty]');
  const countButtons = document.querySelectorAll('.filter-pill[data-count]');
  const timerButtons = document.querySelectorAll('.filter-pill[data-timer]');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const quickStartBtn = document.getElementById('quick-start-btn');

  // Quiz Screen Elements
  const quizCategoryBadge = document.getElementById('quiz-category-badge');
  const questionNumberEl = document.getElementById('question-number');
  const progressBar = document.getElementById('progress-bar');
  const timerCircle = document.getElementById('timer-progress');
  const timerText = document.getElementById('timer-text');
  const streakBadge = document.getElementById('streak-badge');
  const streakCountEl = document.getElementById('streak-count');
  const pointsBadge = document.getElementById('points-badge');
  const questionText = document.getElementById('question-text');
  const questionCodeBlock = document.getElementById('question-code-block');
  const optionsGrid = document.getElementById('options-grid');
  const explanationBox = document.getElementById('explanation-box');
  const explanationText = document.getElementById('explanation-text');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  const quitQuizBtn = document.getElementById('quit-quiz-btn');

  // Lifelines
  const lifeline5050 = document.getElementById('lifeline-5050');
  const lifelineTime = document.getElementById('lifeline-time');
  const lifelineSkip = document.getElementById('lifeline-skip');

  // Results Screen Elements
  const resultScorePct = document.getElementById('result-score-pct');
  const resultScoreRing = document.getElementById('result-score-ring');
  const resultBadgeIcon = document.getElementById('result-badge-icon');
  const resultBadgeTitle = document.getElementById('result-badge-title');
  const resultCategory = document.getElementById('result-category');
  const statPoints = document.getElementById('stat-points');
  const statAccuracy = document.getElementById('stat-accuracy');
  const statStreak = document.getElementById('stat-streak');
  const statTime = document.getElementById('stat-time');
  const playAgainBtn = document.getElementById('play-again-btn');
  const homeReturnBtn = document.getElementById('home-return-btn');
  const openCertificateBtn = document.getElementById('open-certificate-btn');
  const shareResultsBtn = document.getElementById('share-results-btn');
  const reviewContainer = document.getElementById('review-container');
  const reviewFilters = document.querySelectorAll('.review-filter-btn');

  // Modals
  const leaderboardModal = document.getElementById('leaderboard-modal');
  const customQuizModal = document.getElementById('custom-quiz-modal');
  const certificateModal = document.getElementById('certificate-modal');
  const modalCloseButtons = document.querySelectorAll('.modal-close');

  // State Variables
  let selectedCategory = 'web-dev';
  let selectedDifficulty = 'all';
  let selectedCount = 10;
  let selectedTimer = 20;
  let activeCustomQuiz = null;
  let lastQuizSummary = null;
  let playerName = localStorage.getItem('quizpulse_player_name') || 'Quiz Champion';

  // --- INITIALIZATION ---
  initTheme();
  initSoundButton();
  renderCategories();
  renderPlayerHeaderStats();
  setupFilterSelectors();
  setupEventListeners();
  setupKeyboardShortcuts();

  // --- THEME ENGINE ---
  function initTheme() {
    const savedTheme = localStorage.getItem('quizpulse_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    sounds.playClick();
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('quizpulse_theme', target);
    updateThemeIcon(target);
  }

  function updateThemeIcon(theme) {
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<span class="icon">☀️</span>' 
        : '<span class="icon">🌙</span>';
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  // --- SOUND TOGGLE ---
  function initSoundButton() {
    updateSoundIcon();
  }

  function toggleSound() {
    const isMuted = sounds.toggleMute();
    updateSoundIcon();
    if (!isMuted) {
      sounds.playClick();
    }
  }

  function updateSoundIcon() {
    if (soundToggleBtn) {
      const muted = sounds.isMuted();
      soundToggleBtn.innerHTML = muted 
        ? '<span class="icon">🔇</span>' 
        : '<span class="icon">🔊</span>';
      soundToggleBtn.setAttribute('title', muted ? 'Unmute Audio' : 'Mute Audio');
    }
  }

  // --- CATEGORIES RENDERING ---
  function renderCategories() {
    categoryGrid.innerHTML = '';
    const allQuestions = getCombinedQuestions();

    QUIZ_CATEGORIES.forEach(cat => {
      const count = allQuestions.filter(q => q.category === cat.id).length;
      const card = document.createElement('div');
      card.className = `category-card ${cat.id === selectedCategory ? 'selected' : ''}`;
      card.dataset.category = cat.id;

      card.innerHTML = `
        <div class="category-icon-wrapper" style="background: ${cat.gradient}">
          <span class="cat-icon">${cat.icon}</span>
        </div>
        <div class="category-details">
          <div class="category-header-row">
            <h3 class="category-title">${cat.name}</h3>
            <span class="category-count">${count} Qs</span>
          </div>
          <p class="category-desc">${cat.description}</p>
        </div>
        <div class="category-check">✓</div>
      `;

      card.addEventListener('click', () => {
        sounds.playClick();
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCategory = cat.id;
        activeCustomQuiz = null;
      });

      categoryGrid.appendChild(card);
    });

    // Custom Quizzes list in categories
    const customList = customQuizManager.getQuizzes();
    if (customList.length > 0) {
      customList.forEach(cq => {
        const card = document.createElement('div');
        card.className = `category-card ${activeCustomQuiz && activeCustomQuiz.id === cq.id ? 'selected' : ''}`;
        card.dataset.customId = cq.id;
        card.innerHTML = `
          <div class="category-icon-wrapper" style="background: linear-gradient(135deg, #8b5cf6, #ec4899)">
            <span class="cat-icon">✨</span>
          </div>
          <div class="category-details">
            <div class="category-header-row">
              <h3 class="category-title">${cq.title}</h3>
              <span class="category-count">${cq.questions.length} Qs</span>
            </div>
            <p class="category-desc">${cq.description || 'Custom player quiz'}</p>
          </div>
          <div class="category-check">✓</div>
        `;

        card.addEventListener('click', () => {
          sounds.playClick();
          document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          activeCustomQuiz = cq;
          selectedCategory = 'custom';
        });

        categoryGrid.appendChild(card);
      });
    }
  }

  function renderPlayerHeaderStats() {
    const stats = leaderboard.getStats();
    const rankTitle = leaderboard.getLevelTitle(stats.level);
    const userRankEl = document.getElementById('user-rank-title');
    const userLevelEl = document.getElementById('user-level-badge');
    const userXpEl = document.getElementById('user-xp-badge');

    if (userRankEl) userRankEl.textContent = rankTitle;
    if (userLevelEl) userLevelEl.textContent = `Lvl ${stats.level}`;
    if (userXpEl) userXpEl.textContent = `⚡ ${stats.xp.toLocaleString()} XP`;
  }

  // --- FILTERS SETUP ---
  function setupFilterSelectors() {
    difficultyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDifficulty = btn.dataset.difficulty;
      });
    });

    countButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        countButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCount = parseInt(btn.dataset.count, 10);
      });
    });

    timerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        timerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTimer = parseInt(btn.dataset.timer, 10);
      });
    });
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    themeToggleBtn.addEventListener('click', toggleTheme);
    soundToggleBtn.addEventListener('click', toggleSound);

    startQuizBtn.addEventListener('click', startConfiguredQuiz);
    quickStartBtn.addEventListener('click', () => {
      // Pick random category and start immediately
      selectedCategory = QUIZ_CATEGORIES[Math.floor(Math.random() * QUIZ_CATEGORIES.length)].id;
      selectedDifficulty = 'all';
      selectedCount = 10;
      selectedTimer = 20;
      startConfiguredQuiz();
    });

    nextQuestionBtn.addEventListener('click', () => {
      sounds.playClick();
      explanationBox.classList.add('hidden');
      quizEngine.nextQuestion();
    });

    quitQuizBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to abandon the current quiz?')) {
        quizEngine.clearInterval();
        switchScreen('home');
      }
    });

    // Lifelines
    lifeline5050.addEventListener('click', () => {
      const removed = quizEngine.useLifeline5050();
      if (removed) {
        lifeline5050.classList.add('used');
        lifeline5050.disabled = true;
        removed.forEach(idx => {
          const btn = optionsGrid.children[idx];
          if (btn) {
            btn.classList.add('eliminated');
            btn.disabled = true;
          }
        });
      }
    });

    lifelineTime.addEventListener('click', () => {
      if (quizEngine.useLifelineExtraTime()) {
        lifelineTime.classList.add('used');
        lifelineTime.disabled = true;
      }
    });

    lifelineSkip.addEventListener('click', () => {
      if (quizEngine.useLifelineSkip()) {
        lifelineSkip.classList.add('used');
        lifelineSkip.disabled = true;
      }
    });

    // Results Actions
    playAgainBtn.addEventListener('click', () => {
      sounds.playClick();
      startConfiguredQuiz();
    });

    homeReturnBtn.addEventListener('click', () => {
      sounds.playClick();
      switchScreen('home');
      renderPlayerHeaderStats();
      renderCategories();
    });

    openCertificateBtn.addEventListener('click', () => {
      sounds.playClick();
      openCertificateModal();
    });

    shareResultsBtn.addEventListener('click', shareResults);

    // Review Filters
    reviewFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        reviewFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        renderReviewList(filter);
      });
    });

    // Modal Triggers
    navLeaderboardBtn.addEventListener('click', openLeaderboardModal);
    navCustomQuizBtn.addEventListener('click', openCustomQuizModal);

    modalCloseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        closeModals();
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        closeModals();
      }
    });
  }

  // --- KEYBOARD SHORTCUTS ---
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // If modal or quiz input is open, do not intercept
      if (document.querySelector('.modal-backdrop:not(.hidden)')) return;

      if (quizEngine.status === 'running' && !quizEngine.isAnswered) {
        let optionIndex = -1;
        if (e.key === '1' || e.key === 'a' || e.key === 'A') optionIndex = 0;
        else if (e.key === '2' || e.key === 'b' || e.key === 'B') optionIndex = 1;
        else if (e.key === '3' || e.key === 'c' || e.key === 'C') optionIndex = 2;
        else if (e.key === '4' || e.key === 'd' || e.key === 'D') optionIndex = 3;

        if (optionIndex >= 0 && optionIndex < optionsGrid.children.length) {
          const btn = optionsGrid.children[optionIndex];
          if (btn && !btn.disabled && !btn.classList.contains('eliminated')) {
            handleOptionSelect(optionIndex);
          }
        }
      } else if (quizEngine.isAnswered && !explanationBox.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextQuestionBtn.click();
        }
      }
    });
  }

  // --- SCREEN SWITCHER ---
  function switchScreen(screenName) {
    screenHome.classList.add('hidden');
    screenQuiz.classList.add('hidden');
    screenResults.classList.add('hidden');

    if (screenName === 'home') screenHome.classList.remove('hidden');
    else if (screenName === 'quiz') screenQuiz.classList.remove('hidden');
    else if (screenName === 'results') screenResults.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeModals() {
    leaderboardModal.classList.add('hidden');
    customQuizModal.classList.add('hidden');
    certificateModal.classList.add('hidden');
  }

  // --- QUIZ START & ENGINE WIRING ---
  function startConfiguredQuiz() {
    sounds.playClick();

    quizEngine.onStateChange = renderQuizState;
    quizEngine.onTimerTick = updateTimerUI;
    quizEngine.onQuizEnd = handleQuizComplete;

    let customQuestions = null;
    if (activeCustomQuiz) {
      customQuestions = activeCustomQuiz.questions;
    }

    const config = {
      category: activeCustomQuiz ? activeCustomQuiz.id : selectedCategory,
      difficulty: selectedDifficulty,
      questionCount: selectedCount,
      timePerQuestion: selectedTimer
    };

    // Reset lifelines UI
    lifeline5050.classList.remove('used');
    lifeline5050.disabled = false;
    lifelineTime.classList.remove('used');
    lifelineTime.disabled = selectedTimer === 0;
    lifelineSkip.classList.remove('used');
    lifelineSkip.disabled = false;

    explanationBox.classList.add('hidden');

    const started = quizEngine.startQuiz(customQuestions, config);
    if (started) {
      switchScreen('quiz');
    }
  }

  // --- RENDER CURRENT QUESTION ---
  function renderQuizState(state) {
    const { question, index, total, score, points, streak } = state;

    // Badges & Counters
    quizCategoryBadge.textContent = quizEngine.getCategoryName(question.category);
    questionNumberEl.textContent = `Question ${index + 1} of ${total}`;

    // Progress bar
    const progressPercent = ((index) / total) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Points & Streak
    pointsBadge.textContent = `${points.toLocaleString()} pts`;
    if (streak >= 2) {
      streakBadge.classList.remove('hidden');
      streakCountEl.textContent = `${streak}x STREAK! 🔥`;
    } else {
      streakBadge.classList.add('hidden');
    }

    // Question content
    questionText.textContent = question.question;

    if (question.code) {
      questionCodeBlock.textContent = question.code;
      questionCodeBlock.classList.remove('hidden');
    } else {
      questionCodeBlock.classList.add('hidden');
    }

    // Render Options
    optionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    question.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-key">${letters[idx]}</span>
        <span class="option-label">${opt}</span>
      `;

      btn.addEventListener('click', () => {
        handleOptionSelect(idx);
      });

      optionsGrid.appendChild(btn);
    });

    explanationBox.classList.add('hidden');
  }

  function updateTimerUI(seconds, percent) {
    timerText.textContent = seconds;
    const perimeter = 2 * Math.PI * 22; // radius 22
    const offset = perimeter - (percent / 100) * perimeter;
    timerCircle.style.strokeDashoffset = offset;

    const timerWrap = document.querySelector('.timer-widget');
    if (seconds <= 5 && seconds > 0) {
      timerWrap.classList.add('warning-pulse');
    } else {
      timerWrap.classList.remove('warning-pulse');
    }
  }

  function handleOptionSelect(index) {
    const res = quizEngine.selectAnswer(index);
    if (!res) return;

    const { record, pointsEarned } = res;
    const buttons = optionsGrid.children;

    // Disable all options
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (i === record.correct) {
        buttons[i].classList.add('correct');
      } else if (i === record.selected) {
        buttons[i].classList.add('wrong');
      }
    }

    // Show educational explanation
    explanationBox.classList.remove('hidden');
    explanationBox.className = `explanation-card ${record.isCorrect ? 'is-correct' : 'is-wrong'}`;

    const statusTitle = record.isCorrect 
      ? `🎉 Spot on! +${pointsEarned} points` 
      : (record.isTimeout ? '⏰ Time Ran Out!' : '❌ Not Quite Right');

    explanationText.innerHTML = `
      <h4 class="explanation-title">${statusTitle}</h4>
      <p class="explanation-body">${record.explanation}</p>
    `;

    // Update Points & Streak immediately
    pointsBadge.textContent = `${quizEngine.points.toLocaleString()} pts`;
    if (quizEngine.streak >= 2) {
      streakBadge.classList.remove('hidden');
      streakCountEl.textContent = `${quizEngine.streak}x STREAK! 🔥`;
    } else {
      streakBadge.classList.add('hidden');
    }

    // Animate progress to current
    const progressPercent = ((quizEngine.currentIndex + 1) / quizEngine.questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    nextQuestionBtn.focus();
  }

  // --- QUIZ COMPLETION & RESULTS ---
  function handleQuizComplete(summary) {
    lastQuizSummary = summary;

    // Save to leaderboard
    leaderboard.saveEntry({
      playerName: playerName,
      category: summary.category,
      categoryName: summary.categoryName,
      score: summary.score,
      totalQuestions: summary.totalQuestions,
      points: summary.points,
      maxStreak: summary.maxStreak,
      timeTakenSecs: summary.totalTime
    });

    // Populate Results Screen
    resultScorePct.textContent = `${summary.percentage}%`;
    const ringPerimeter = 2 * Math.PI * 45;
    const ringOffset = ringPerimeter - (summary.percentage / 100) * ringPerimeter;
    resultScoreRing.style.strokeDashoffset = ringOffset;

    resultBadgeIcon.textContent = summary.badge.icon;
    resultBadgeTitle.textContent = summary.badge.title;
    resultCategory.textContent = summary.categoryName;

    statPoints.textContent = summary.points.toLocaleString();
    statAccuracy.textContent = `${summary.score}/${summary.totalQuestions}`;
    statStreak.textContent = `${summary.maxStreak} in a row`;
    
    const minutes = Math.floor(summary.totalTime / 60);
    const secs = summary.totalTime % 60;
    statTime.textContent = `${minutes > 0 ? minutes + 'm ' : ''}${secs}s`;

    // Render Review List
    renderReviewList('all');

    switchScreen('results');
  }

  function renderReviewList(filter) {
    if (!lastQuizSummary) return;
    reviewContainer.innerHTML = '';

    const records = lastQuizSummary.records.filter(r => {
      if (filter === 'correct') return r.isCorrect;
      if (filter === 'wrong') return !r.isCorrect;
      return true;
    });

    if (records.length === 0) {
      reviewContainer.innerHTML = `<div class="empty-state">No questions match the "${filter}" filter.</div>`;
      return;
    }

    records.forEach((rec, idx) => {
      const card = document.createElement('div');
      card.className = `review-item ${rec.isCorrect ? 'correct' : 'wrong'}`;

      const userChoice = rec.selected >= 0 ? rec.options[rec.selected] : (rec.isSkipped ? 'Skipped' : 'Time Out');
      const correctChoice = rec.options[rec.correct];

      card.innerHTML = `
        <div class="review-header">
          <span class="review-num">#${idx + 1}</span>
          <span class="review-status-pill ${rec.isCorrect ? 'correct' : 'wrong'}">
            ${rec.isCorrect ? '✓ Correct' : (rec.isSkipped ? '↷ Skipped' : '✗ Incorrect')}
          </span>
          <span class="review-time">⏱ ${rec.timeSpent}s</span>
        </div>
        <p class="review-question">${rec.question}</p>
        <div class="review-choices-box">
          <div class="review-choice user-choice ${rec.isCorrect ? 'correct' : 'wrong'}">
            <span class="choice-tag">Your Answer:</span> ${userChoice}
          </div>
          ${!rec.isCorrect ? `
            <div class="review-choice correct-choice">
              <span class="choice-tag">Correct Answer:</span> ${correctChoice}
            </div>
          ` : ''}
        </div>
        <div class="review-explanation">
          <strong>Why:</strong> ${rec.explanation}
        </div>
      `;

      reviewContainer.appendChild(card);
    });
  }

  function shareResults() {
    sounds.playClick();
    if (!lastQuizSummary) return;

    const shareText = `🎯 I scored ${lastQuizSummary.percentage}% (${lastQuizSummary.points} pts) on the ${lastQuizSummary.categoryName} quiz in QuizPulse Elite! Can you beat my score? 🚀`;

    if (navigator.share) {
      navigator.share({
        title: 'QuizPulse Elite Results',
        text: shareText,
        url: window.location.href
      }).catch(() => copyToClipboard(shareText));
    } else {
      copyToClipboard(shareText);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard! Share it with your friends.');
    }).catch(() => {
      prompt('Copy your results:', text);
    });
  }

  // --- CERTIFICATE GENERATOR (CANVAS) ---
  function openCertificateModal() {
    if (!lastQuizSummary) return;
    certificateModal.classList.remove('hidden');

    const nameInput = document.getElementById('cert-player-name');
    nameInput.value = playerName;

    renderCertificateCanvas(playerName);

    nameInput.oninput = (e) => {
      playerName = e.target.value.trim() || 'Quiz Champion';
      localStorage.setItem('quizpulse_player_name', playerName);
      renderCertificateCanvas(playerName);
    };

    document.getElementById('download-cert-btn').onclick = downloadCertificate;
    document.getElementById('print-cert-btn').onclick = printCertificate;
  }

  function renderCertificateCanvas(name) {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1200 x 800 high-res certificate
    canvas.width = 1200;
    canvas.height = 800;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e1b4b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Outer decorative border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#6366f1';
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner gold border
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(46, 46, 1108, 708);

    // Corner decorative accents
    const corners = [
      [56, 56], [1144, 56], [56, 744], [1144, 744]
    ];
    ctx.fillStyle = '#f59e0b';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Logo / Emblem
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#818cf8';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ QUIZPULSE ELITE', 600, 130);

    // Subtitle
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('INTERNATIONAL KNOWLEDGE & TRIVIA ACADEMY', 600, 160);

    // Title
    ctx.font = 'bold 50px "Plus Jakarta Sans", serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 240);

    // Presented to text
    ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('This official credential is proudly awarded to', 600, 300);

    // Student Name (Highlight)
    ctx.font = 'bold 56px "Plus Jakarta Sans", cursive, sans-serif';
    const nameGrad = ctx.createLinearGradient(400, 0, 800, 0);
    nameGrad.addColorStop(0, '#38bdf8');
    nameGrad.addColorStop(0.5, '#818cf8');
    nameGrad.addColorStop(1, '#ec4899');
    ctx.fillStyle = nameGrad;
    ctx.fillText(name.toUpperCase(), 600, 380);

    // Divider Line under name
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(350, 410);
    ctx.lineTo(850, 410);
    ctx.stroke();

    // Achievement text
    const summary = lastQuizSummary || {
      categoryName: 'General Quiz',
      percentage: 100,
      points: 1500,
      badge: { title: 'Mastermind' }
    };

    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`For successfully mastering the ${summary.categoryName} Assessment`, 600, 460);
    
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Scoring ${summary.percentage}% Accuracy with ${summary.points.toLocaleString()} Points • Rank: ${summary.badge.title}`, 600, 500);

    // Verified Seal badge on canvas
    ctx.beginPath();
    ctx.arc(600, 610, 48, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('★ SEAL ★', 600, 614);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('VERIFIED EXCELLENCE', 600, 630);

    // Date & Signature blocks
    const today = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    ctx.textAlign = 'left';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ISSUED DATE:', 120, 670);
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(today, 120, 700);

    ctx.textAlign = 'right';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CERTIFICATE ID:', 1080, 670);
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = '#38bdf8';
    const certHash = 'QP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    ctx.fillText(certHash, 1080, 700);
  }

  function downloadCertificate() {
    sounds.playClick();
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `QuizPulse_Certificate_${playerName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function printCertificate() {
    sounds.playClick();
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QuizPulse Elite Certificate - ${playerName}</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; background: #000; min-height: 100vh; }
            img { max-width: 100%; height: auto; border-radius: 8px; }
            @media print {
              body { background: transparent; }
              img { width: 100%; }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  // --- LEADERBOARD MODAL ---
  function openLeaderboardModal() {
    sounds.playClick();
    leaderboardModal.classList.remove('hidden');

    const tabs = document.querySelectorAll('.leaderboard-cat-tab');
    const listContainer = document.getElementById('leaderboard-list');
    const clearBtn = document.getElementById('clear-leaderboard-btn');

    function renderList(catId = 'all') {
      const top = leaderboard.getTopScores(catId, 15);
      listContainer.innerHTML = '';

      if (top.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">🏆</span>
            <p>No scores recorded yet. Play a quiz to claim your throne!</p>
          </div>
        `;
        return;
      }

      top.forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = `leaderboard-row rank-${idx + 1}`;

        let medal = `#${idx + 1}`;
        if (idx === 0) medal = '🥇 1st';
        else if (idx === 1) medal = '🥈 2nd';
        else if (idx === 2) medal = '🥉 3rd';

        row.innerHTML = `
          <div class="lb-rank">${medal}</div>
          <div class="lb-info">
            <div class="lb-player-name">${entry.playerName}</div>
            <div class="lb-meta">${entry.categoryName} • ${entry.formattedDate}</div>
          </div>
          <div class="lb-score">
            <div class="lb-points">${entry.points.toLocaleString()} pts</div>
            <div class="lb-pct">${entry.percentage}% (${entry.score}/${entry.totalQuestions})</div>
          </div>
        `;

        listContainer.appendChild(row);
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sounds.playClick();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderList(tab.dataset.cat);
      });
    });

    clearBtn.onclick = () => {
      if (confirm('Clear all local scores and game history?')) {
        leaderboard.clearHistory();
        renderList('all');
        renderPlayerHeaderStats();
      }
    };

    renderList('all');
  }

  // --- CUSTOM QUIZ BUILDER MODAL ---
  function openCustomQuizModal() {
    sounds.playClick();
    customQuizModal.classList.remove('hidden');

    const form = document.getElementById('custom-quiz-form');
    const questionsContainer = document.getElementById('builder-questions-container');
    const addQuestionBtn = document.getElementById('builder-add-q-btn');
    const importFileInput = document.getElementById('builder-import-file');
    const exportSampleBtn = document.getElementById('builder-export-sample-btn');

    let builderQuestions = [
      {
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        explanation: ''
      }
    ];

    function renderBuilderQuestions() {
      questionsContainer.innerHTML = '';
      builderQuestions.forEach((q, qIndex) => {
        const block = document.createElement('div');
        block.className = 'builder-q-card';
        block.innerHTML = `
          <div class="builder-q-header">
            <h4>Question #${qIndex + 1}</h4>
            ${builderQuestions.length > 1 ? `<button type="button" class="btn-remove-q" data-qindex="${qIndex}">✕ Remove</button>` : ''}
          </div>
          <div class="form-group">
            <label>Question Prompt:</label>
            <input type="text" class="input-q-text" data-qindex="${qIndex}" value="${escapeHtml(q.question)}" placeholder="Enter your question here..." required />
          </div>
          <div class="builder-options-grid">
            ${[0, 1, 2, 3].map(optIdx => `
              <div class="builder-option-row">
                <input type="radio" name="builder_correct_${qIndex}" value="${optIdx}" ${q.correct === optIdx ? 'checked' : ''} data-qindex="${qIndex}" />
                <input type="text" class="input-q-opt" data-qindex="${qIndex}" data-optindex="${optIdx}" value="${escapeHtml(q.options[optIdx] || '')}" placeholder="Option ${optIdx + 1}" required />
              </div>
            `).join('')}
          </div>
          <div class="form-group">
            <label>Educational Explanation (optional):</label>
            <input type="text" class="input-q-exp" data-qindex="${qIndex}" value="${escapeHtml(q.explanation || '')}" placeholder="Why is this answer correct?" />
          </div>
        `;
        questionsContainer.appendChild(block);
      });

      // Attach handlers
      document.querySelectorAll('.btn-remove-q').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.qindex, 10);
          builderQuestions.splice(idx, 1);
          renderBuilderQuestions();
        });
      });

      document.querySelectorAll('.input-q-text').forEach(input => {
        input.addEventListener('input', (e) => {
          builderQuestions[e.target.dataset.qindex].question = e.target.value;
        });
      });

      document.querySelectorAll('.input-q-opt').forEach(input => {
        input.addEventListener('input', (e) => {
          const qI = e.target.dataset.qindex;
          const optI = e.target.dataset.optindex;
          builderQuestions[qI].options[optI] = e.target.value;
        });
      });

      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          const qI = e.target.dataset.qindex;
          builderQuestions[qI].correct = parseInt(e.target.value, 10);
        });
      });

      document.querySelectorAll('.input-q-exp').forEach(input => {
        input.addEventListener('input', (e) => {
          builderQuestions[e.target.dataset.qindex].explanation = e.target.value;
        });
      });
    }

    addQuestionBtn.onclick = () => {
      sounds.playClick();
      builderQuestions.push({
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        explanation: ''
      });
      renderBuilderQuestions();
    };

    form.onsubmit = (e) => {
      e.preventDefault();
      sounds.playClick();

      const title = document.getElementById('builder-quiz-title').value.trim();
      const desc = document.getElementById('builder-quiz-desc').value.trim();

      if (!title) {
        alert('Please give your quiz a title!');
        return;
      }

      // Check all questions have text and options
      for (let i = 0; i < builderQuestions.length; i++) {
        const q = builderQuestions[i];
        if (!q.question.trim()) {
          alert(`Question #${i + 1} needs text!`);
          return;
        }
        if (q.options.some(opt => !opt.trim())) {
          alert(`Please fill out all 4 options for Question #${i + 1}!`);
          return;
        }
      }

      const customQuiz = {
        id: 'custom_' + Date.now(),
        title,
        description: desc,
        category: 'custom',
        categoryName: title,
        questions: builderQuestions.map((q, idx) => ({
          id: `cq_${Date.now()}_${idx}`,
          category: 'custom',
          difficulty: 'medium',
          type: 'single',
          question: q.question,
          options: [...q.options],
          correct: q.correct,
          explanation: q.explanation || 'Great job answering!'
        }))
      };

      customQuizManager.saveQuiz(customQuiz);
      alert(`Quiz "${title}" created successfully!`);
      closeModals();
      renderCategories();
    };

    importFileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = customQuizManager.importFromJSON(event.target.result);
          alert(`Imported quiz "${imported.title}" with ${imported.questions.length} questions!`);
          closeModals();
          renderCategories();
        } catch (err) {
          alert(err.message);
        }
      };
      reader.readAsText(file);
    };

    exportSampleBtn.onclick = () => {
      const sample = {
        title: 'Space & Astronomy Challenge',
        description: 'Test your knowledge about celestial bodies and cosmic voyages!',
        questions: [
          {
            question: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correct: 1,
            explanation: 'Mars appears red due to iron oxide (rust) on its dusty surface.'
          },
          {
            question: 'What is the largest moon of Saturn?',
            options: ['Titan', 'Europa', 'Ganymede', 'Enceladus'],
            correct: 0,
            explanation: 'Titan is Saturn’s largest moon and has a dense nitrogen atmosphere.'
          }
        ]
      };
      customQuizManager.exportAsJSON(sample);
    };

    renderBuilderQuestions();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
