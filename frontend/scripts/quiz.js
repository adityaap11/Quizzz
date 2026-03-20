const QUESTION_LIMIT = 10; 
const QUIZ_DURATION_SECONDS = 60 * 5; 
let questions = [];
let currentIndex = 0;
let selectedAnswers = {}; 
let remainingSeconds = QUIZ_DURATION_SECONDS;
let timerInterval;
async function fetchQuestions() {
  try {
    const res = await fetch(
      `${API_BASE}/quiz/questions?limit=${QUESTION_LIMIT}`,
      {
        headers: authHeader()
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.message || 'Failed to load questions');
      return;
    }
    questions = data.questions;
    if (questions.length === 0) {
      showAlert('No questions available. Ask admin to add some.');
      return;
    }
    renderQuestion();
    startTimer();
  } catch (err) {
    console.error(err);
    showAlert('Error loading questions');
  }
}
function renderQuestion() {
  const q = questions[currentIndex];
  if (!q) return;
  const questionTextEl = document.getElementById('question-text');
  const optionsListEl = document.getElementById('options-list');
  const progressFill = document.getElementById('progress-fill');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  questionTextEl.textContent = `${currentIndex + 1}. ${q.questionText}`;
  optionsListEl.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const li = document.createElement('li');
    const id = `opt-${idx}`;
    li.innerHTML = `
      <label>
        <input type="radio" name="option" value="${idx}" id="${id}" />
        ${opt}
      </label>
    `;
    optionsListEl.appendChild(li);
  });
  if (selectedAnswers[currentIndex] !== undefined) {
    const selectedIdx = selectedAnswers[currentIndex];
    const radio = document.querySelector(
      `input[name="option"][value="${selectedIdx}"]`
    );
    if (radio) radio.checked = true;
  }
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.style.display = currentIndex === questions.length - 1 ? 'none' : 'inline-block';
  submitBtn.style.display = currentIndex === questions.length - 1 ? 'inline-block' : 'none';
}
function captureSelectedOption() {
  const selected = document.querySelector('input[name="option"]:checked');
  if (selected) {
    selectedAnswers[currentIndex] = parseInt(selected.value, 10);
  }
}
function startTimer() {
  const timerEl = document.getElementById('timer');
  function updateTimer() {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    timerEl.textContent = `Time left: ${minutes}:${seconds}`;
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      showAlert('Time is up! Auto-submitting your quiz.', 'error');
      submitQuiz();
    }
    remainingSeconds -= 1;
  }
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}
async function submitQuiz() {
  captureSelectedOption();
  const answersPayload = questions.map((q, idx) => ({
    questionId: q._id,
    selectedIndex:
      selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
  }));
  try {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ answers: answersPayload })
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.message || 'Failed to submit quiz');
      return;
    }
    localStorage.setItem('lastResult', JSON.stringify(data));
    window.location.href = 'result.html';
  } catch (err) {
    console.error(err);
    showAlert('Error submitting quiz');
  }
}
if (document.getElementById('quiz-card')) {
  if (!getToken()) {
    showAlert('You must login first');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } else {
    fetchQuestions();
  }
  document.getElementById('next-btn').addEventListener('click', () => {
    captureSelectedOption();
    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    }
  });
  document.getElementById('prev-btn').addEventListener('click', () => {
    captureSelectedOption();
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
    }
  });
  document.getElementById('submit-btn').addEventListener('click', () => {
    if (
      !confirm(
        'Are you sure you want to submit the quiz? You cannot change your answers after submission.'
      )
    ) {
      return;
    }
    clearInterval(timerInterval);
    submitQuiz();
  });
}
