/**
 * QuizPulse Elite - Custom Quiz Engine
 * Empowers users to create, import, export, and play bespoke custom quizzes
 */

class CustomQuizManager {
  constructor() {
    this.storageKey = 'quizpulse_custom_quizzes';
  }

  getQuizzes() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  saveQuiz(quiz) {
    const list = this.getQuizzes();
    const existingIndex = list.findIndex(q => q.id === quiz.id);

    if (existingIndex >= 0) {
      list[existingIndex] = quiz;
    } else {
      list.push(quiz);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(list));
    return quiz;
  }

  deleteQuiz(quizId) {
    let list = this.getQuizzes();
    list = list.filter(q => q.id !== quizId);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  getQuizById(quizId) {
    return this.getQuizzes().find(q => q.id === quizId);
  }

  exportAsJSON(quiz) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(quiz.title || 'custom-quiz').toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.title || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Invalid quiz format. A title and at least one question are required.');
      }

      // Sanitize questions
      const validatedQuiz = {
        id: 'cq_' + Date.now(),
        title: parsed.title,
        description: parsed.description || 'Custom user created quiz',
        category: parsed.category || 'custom',
        categoryName: parsed.categoryName || 'Custom Quiz',
        createdAt: new Date().toISOString(),
        questions: parsed.questions.map((q, idx) => ({
          id: `cq_q_${idx}_${Date.now()}`,
          category: 'custom',
          difficulty: q.difficulty || 'medium',
          type: q.type || 'single',
          question: q.question,
          options: q.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correct: typeof q.correct === 'number' ? q.correct : 0,
          explanation: q.explanation || 'No explanation provided.'
        }))
      };

      this.saveQuiz(validatedQuiz);
      return validatedQuiz;
    } catch (err) {
      throw new Error('Import failed: ' + err.message);
    }
  }
}

const customQuizManager = new CustomQuizManager();
