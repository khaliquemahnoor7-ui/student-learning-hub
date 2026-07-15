// wait until the webiste page is compleetly loaded before running any code
document.addEventListener('DOMContentLoaded', () => {

  const QUIZ_DATA = {
    web: {
      label: 'Web Dev',
      tagClass: 'tag-beginner',
      questions: [
        {
          q: 'What does HTML stand for?',
          options: ['HighText Machine Language', 'HyperText Markup Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
          correct: 1
        },
        {
          q: 'Which CSS property controls text size?',
          options: ['font-style', 'text-size', 'font-size', 'text-style'],
          correct: 2
        },
        {
          q: 'Which tag is used to link an external CSS file?',
          options: ['<style>', '<css>', '<link>', '<script>'],
          correct: 2
        },
        {
          q: 'What does DOM stand for?',
          options: ['Document Object Model', 'Data Object Model', 'Document Order Model', 'Digital Ordinance Model'],
          correct: 0
        },
        {
          q: 'Which JS array method adds an element to the end?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correct: 0
        }
      ]
    },
    design: {
      label: 'Design',
      tagClass: 'tag-beginner',
      questions: [
        {
          q: 'What does UX stand for?',
          options: ['User Experience', 'User Extension', 'Unique Experience', 'User Exchange'],
          correct: 0
        },
        {
          q: 'Which color model is used for screens?',
          options: ['CMYK', 'RGB', 'Pantone', 'HSB'],
          correct: 1
        },
        {
          q: 'What is a wireframe?',
          options: ['A finished high-fidelity design', 'A low-fidelity layout blueprint', 'A color palette', 'A font pairing'],
          correct: 1
        },
        {
          q: 'Which design principle groups related items together visually?',
          options: ['Contrast', 'Proximity', 'Alignment', 'Repetition'],
          correct: 1
        },
        {
          q: 'What is a design system primarily used for?',
          options: ['One-off illustrations', 'Reusable, consistent components', 'Marketing copy', 'Server infrastructure'],
          correct: 1
        }
      ]
    },
    data: {
      label: 'Data',
      tagClass: 'tag-intermediate',
      questions: [
        {
          q: 'Which Python library is commonly used for data manipulation?',
          options: ['Pandas', 'Django', 'Flask', 'React'],
          correct: 0
        },
        {
          q: 'What does ML stand for?',
          options: ['Manual Learning', 'Machine Learning', 'Model Logic', 'Massive Loop'],
          correct: 1
        },
        {
          q: 'Which chart type is best for showing trends over time?',
          options: ['Pie chart', 'Line chart', 'Scatter without axis', 'Word cloud'],
          correct: 1
        },
        {
          q: 'What is a "dataset"?',
          options: ['A single number', 'A collection of related data', 'A type of loop', 'A CSS class'],
          correct: 1
        },
        {
          q: 'Which library is popular for data visualization in Python?',
          options: ['Matplotlib', 'Bootstrap', 'jQuery', 'Laravel'],
          correct: 0
        }
      ]
    },
    programming: {
      label: 'Programming',
      tagClass: 'tag-beginner',
      questions: [
        {
          q: 'What is a variable?',
          options: ['A fixed value', 'A named container for storing data', 'A type of loop', 'An error message'],
          correct: 1
        },
        {
          q: 'Which of these is a loop structure?',
          options: ['if', 'for', 'print', 'import'],
          correct: 1
        },
        {
          q: 'What does the "return" keyword do in a function?',
          options: ['Starts a loop', 'Ends the program', 'Sends a value back to the caller', 'Declares a variable'],
          correct: 2
        },
        {
          q: 'What is the correct symbol for equality comparison (not assignment) in most languages?',
          options: ['=', '==', ':=', '~'],
          correct: 1
        },
        {
          q: 'What is debugging?',
          options: ['Writing new features', 'Finding and fixing errors in code', 'Deleting the code', 'Compiling the code'],
          correct: 1
        }
      ]
    }
  };

  // the key ised to save and read high scores fron  the browwers staorage
  const STORAGE_KEY = 'slh_quiz_best_scores';

 
  const selectScreen  = document.getElementById('quizSelectScreen');
  const activeScreen  = document.getElementById('quizActiveScreen');
  const resultsScreen = document.getElementById('quizResultsScreen');

  const quizCards = document.querySelectorAll('.quiz-card');

  const progressFill   = document.getElementById('quizProgressFill');
  const activeTag       = document.getElementById('quizActiveTag');
  const counterEl        = document.getElementById('quizCounter');
  const questionTextEl   = document.getElementById('quizQuestionText');
  const optionsWrap       = document.getElementById('quizOptions');
  const nextBtn            = document.getElementById('quizNextBtn');
  const quitBtn             = document.getElementById('quizQuitBtn');

  const resultsIcon    = document.getElementById('quizResultsIcon');
  const resultsTopic   = document.getElementById('quizResultsTopic');
  const resultsScore   = document.getElementById('quizResultsScore');
  const resultsPercent = document.getElementById('quizResultsPercent');
  const resultsMessage = document.getElementById('quizResultsMessage');
  const resultsBest    = document.getElementById('quizResultsBest');
  const retakeBtn      = document.getElementById('quizRetakeBtn');
  const backBtn        = document.getElementById('quizBackBtn');

  // ===== State =====
  let currentQuizKey = null;
  let currentQuestions = [];
  let currentIndex = 0;
  let selectedOption = null;
  let correctCount = 0;

  // ===== localStorage helpers =====
  function getBestScores() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveBestScore(quizKey, percent) {
    const scores = getBestScores();
    if (!scores[quizKey] || percent > scores[quizKey]) {
      scores[quizKey] = percent;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    }
    return scores[quizKey];
  }

  function renderBestScores() {
    const scores = getBestScores();
    document.querySelectorAll('.quiz-best-score').forEach(el => {
      const key = el.dataset.best;
      if (scores[key] !== undefined) {
        el.textContent = `Best: ${scores[key]}%`;
        el.classList.add('has-score');
      } else {
        el.textContent = 'Not attempted';
        el.classList.remove('has-score');
      }
    });
  }

  // ===== Screen switching =====
  function showScreen(screen) {
    [selectScreen, activeScreen, resultsScreen].forEach(s => s.hidden = true);
    screen.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== Start quiz =====
  function startQuiz(quizKey) {
    currentQuizKey = quizKey;
    currentQuestions = QUIZ_DATA[quizKey].questions;
    currentIndex = 0;
    correctCount = 0;

    activeTag.textContent = QUIZ_DATA[quizKey].label;
    activeTag.className = 'course-tag ' + QUIZ_DATA[quizKey].tagClass;

    showScreen(activeScreen);
    renderQuestion();
  }

  function renderQuestion() {
    const total = currentQuestions.length;
    const question = currentQuestions[currentIndex];
    selectedOption = null;
    nextBtn.disabled = true;
    nextBtn.textContent = '';

    const isLast = currentIndex === total - 1;
    nextBtn.innerHTML = isLast ? 'See Results <span>→</span>' : 'Next <span>→</span>';

    counterEl.textContent = `Question ${currentIndex + 1} of ${total}`;
    progressFill.style.width = `${((currentIndex) / total) * 100 + (100 / total)}%`;

    questionTextEl.textContent = question.q;

    optionsWrap.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    question.options.forEach((optionText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.innerHTML = `<span class="quiz-option-letter">${letters[i]}</span><span>${optionText}</span>`;
      btn.addEventListener('click', () => selectOption(btn, i));
      optionsWrap.appendChild(btn);
    });
  }

  function selectOption(btn, index) {
    optionsWrap.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    btn.classList.add('selected');
    selectedOption = index;
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener('click', () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQuestions[currentIndex].correct) {
      correctCount++;
    }

    const isLast = currentIndex === currentQuestions.length - 1;

    if (isLast) {
      finishQuiz();
    } else {
      currentIndex++;
      renderQuestion();
    }
  });

  quitBtn.addEventListener('click', () => {
    showScreen(selectScreen);
  });

  // fifnish and result
  function finishQuiz() {
    const total = currentQuestions.length;
    const percent = Math.round((correctCount / total) * 100);
    const best = saveBestScore(currentQuizKey, percent);

    resultsTopic.innerHTML = `<i class="fa-solid fa-puzzle-piece"></i> ${QUIZ_DATA[currentQuizKey].label} Quiz`;
    resultsScore.textContent = `${correctCount} / ${total}`;
    resultsPercent.textContent = `${percent}%`;
    resultsBest.textContent = `Best score: ${best}%`;

    let message = '';
    let icon = 'fa-trophy';
    if (percent === 100) {
      message = 'Perfect score, you nailed every question!';
      icon = 'fa-trophy';
    } else if (percent >= 80) {
      message = 'Great work, solid grasp of the topic.';
      icon = 'fa-star';
    } else if (percent >= 50) {
      message = 'Good effort , a bit more practice and you have got this.';
      icon = 'fa-thumbs-up';
    } else {
      message = 'Worth a revisit ,  check out the course and try again.';
      icon = 'fa-book';
    }
    resultsMessage.textContent = message;
    resultsIcon.innerHTML = `<i class="fa-solid ${icon}"></i>`;

    renderBestScores(); // refresh best score records acorss menu displays
    showScreen(resultsScreen);
  }

  //button  mapping listerners for repeating execution loops or backing out
  retakeBtn.addEventListener('click', () => {
    startQuiz(currentQuizKey);
  });

  backBtn.addEventListener('click', () => {
    showScreen(selectScreen);
  });

  // initilization
  quizCards.forEach(card => {
    const btn = card.querySelector('.start-quiz-btn');
    btn.addEventListener('click', () => startQuiz(card.dataset.quiz));
  });

  //load and show score for the first time on page start
  renderBestScores();

});