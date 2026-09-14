let currentQuestionIndex = 0;
let score = 0;
let stars = 0;
let selectedAnswer = null;
let selectedWords = [];
let shuffledWords = [];
let questionFinished = false;
let mcqAttempts = 0;

// Breakdown
const stats = {
  multipleChoice: { correct: 0, total: 0 },
  unscramble: { correct: 0, total: 0 },
  writing: { correct: 0, total: 0 }
};

// DOM
const questionText = document.getElementById("question-text");
const questionType = document.getElementById("question-type");
const questionImageContainer = document.getElementById("question-image-container");
const questionImage = document.getElementById("question-image");

const choicesContainer = document.getElementById("choices-container");

const unscrambleContainer = document.getElementById("unscramble-container");
const wordBank = document.getElementById("word-bank");
const sentenceArea = document.getElementById("sentence-area");
const clearUnscramble = document.getElementById("clear-unscramble");

const writingContainer = document.getElementById("writing-container");
const writingTemplate = document.getElementById("writing-template");
const writingAnswer = document.getElementById("writing-answer");
const writingNote = document.getElementById("writing-note");

const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");

const scoreDisplay = document.getElementById("score");
const starsDisplay = document.getElementById("stars");
const questionNumber = document.getElementById("question-number");
const totalQuestions = document.getElementById("total-questions");
const progress = document.getElementById("progress");

const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const finalTotal = document.getElementById("final-total");
const finalStars = document.getElementById("final-stars");
const resultBreakdown = document.getElementById("result-breakdown");
const restartBtn = document.getElementById("restart-btn");

const themeSelect = document.getElementById("theme-select");

// FIX #5: Validate questions array exists before using it
if (typeof questions === "undefined" || !Array.isArray(questions)) {
  console.error("Error: questions array is not defined or is not an array");
} else {
  totalQuestions.textContent = questions.length;
}

// =========================
// HELPERS
// =========================
function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[']/g, "'")
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateStars() {
  starsDisplay.textContent =
    "★".repeat(stars) + "☆".repeat(3 - stars);
}

function addStar() {
  // Stars are capped at 3.
  if (stars < 3) stars++;
  updateStars();
}

function updateProgress() {
  const percent =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  progress.style.width = `${percent}%`;
}

function setFeedback(message, type = "") {
  feedback.innerHTML = message;
  feedback.className = type ? `feedback ${type}` : "feedback";
}

function resetQuestion() {
  selectedAnswer = null;
  selectedWords = [];
  shuffledWords = [];
  questionFinished = false;
  mcqAttempts = 0;

  choicesContainer.innerHTML = "";
  wordBank.innerHTML = "";
  sentenceArea.innerHTML = "";

  writingAnswer.value = "";
  writingAnswer.disabled = false;

  setFeedback("");

  checkBtn.classList.remove("hidden");
  checkBtn.disabled = false;

  nextBtn.classList.add("hidden");
  nextBtn.disabled = false;

  clearUnscramble.disabled = false;

  choicesContainer.classList.add("hidden");
  unscrambleContainer.classList.add("hidden");
  writingContainer.classList.add("hidden");

  questionImageContainer.classList.add("hidden");
  questionImage.src = "";
}

// =========================
// LOAD QUESTION
// =========================
function loadQuestion() {
  resetQuestion();

  const currentQuestion = getCurrentQuestion();

  questionText.textContent = currentQuestion.question;
  questionNumber.textContent = currentQuestionIndex + 1;
  updateProgress();

  if (currentQuestion.image) {
    questionImage.src = currentQuestion.image;
    questionImage.alt = currentQuestion.question;
    questionImageContainer.classList.remove("hidden");
  }

  if (currentQuestion.type === "multipleChoice") {
    loadMultipleChoice(currentQuestion);
  }

  if (currentQuestion.type === "unscramble") {
    loadUnscramble(currentQuestion);
  }

  if (currentQuestion.type === "writing") {
    loadWriting(currentQuestion);
  }

  updateScore();
  updateStars();
}

// =========================
// MULTIPLE CHOICE
// =========================
function loadMultipleChoice(question) {
  questionType.textContent = "MULTIPLE CHOICE";
  choicesContainer.classList.remove("hidden");

  question.choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = choice;

    button.addEventListener("click", () => {
      if (questionFinished) return;

      selectedAnswer = choice;

      document.querySelectorAll(".choice-btn").forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
    });

    choicesContainer.appendChild(button);
  });
}

function checkMultipleChoice(question) {
  if (selectedAnswer === null) {
    setFeedback("Please choose an answer first.", "warning");
    return;
  }

  mcqAttempts++;

  const buttons = [...document.querySelectorAll(".choice-btn")];
  const selectedButton = buttons.find(
    btn => normalizeText(btn.textContent) === normalizeText(selectedAnswer)
  );
  const correctButton = buttons.find(
    btn => normalizeText(btn.textContent) === normalizeText(question.answer)
  );

  if (normalizeText(selectedAnswer) === normalizeText(question.answer)) {
    selectedButton.classList.remove("selected");
    selectedButton.classList.add("correct");

    setFeedback("🎉 Correct! Great job.", "correct");
    finishQuestion("multipleChoice", true);
    return;
  }

  // Wrong answer does NOT end the question.
  selectedButton.classList.remove("selected");
  selectedButton.classList.add("wrong");

  if (mcqAttempts === 1) {
    setFeedback("❌ Not quite. Try again!", "warning");
  } else if (mcqAttempts === 2) {
    setFeedback("💡 Almost! You have one more try.", "warning");
  } else {
    if (correctButton) correctButton.classList.add("correct");

    setFeedback(
      `The correct answer is <strong>${question.answer}</strong>.`,
      "wrong"
    );

    finishQuestion("multipleChoice", false);
  }

  selectedAnswer = null;
}

// =========================
// UNSCRAMBLE
// =========================
function loadUnscramble(question) {
  questionType.textContent = "UNSCRAMBLE";
  unscrambleContainer.classList.remove("hidden");

  shuffledWords = shuffleArray(question.words);
  renderWordBank(question);
  renderSentence(question);
}

function renderWordBank(question) {
  wordBank.innerHTML = "";

  shuffledWords.forEach((word, bankIndex) => {
    if (selectedWords.includes(bankIndex)) return;

    const button = document.createElement("button");
    button.className = "word-btn";
    button.textContent = word;

    button.addEventListener("click", () => {
      if (questionFinished) return;

      selectedWords.push(bankIndex);
      renderWordBank(question);
      renderSentence(question);
    });

    wordBank.appendChild(button);
  });
}

function renderSentence(question) {
  sentenceArea.innerHTML = "";

  selectedWords.forEach((bankIndex, position) => {
    const word = shuffledWords[bankIndex];
    const expectedWord = question.answer[position];

    const button = document.createElement("button");
    button.className = "selected-word";
    button.textContent = word;
    button.title = "Click to return this word to the Word Bank";

    if (normalizeText(word) === normalizeText(expectedWord)) {
      button.classList.add("position-correct");
    } else {
      button.classList.add("position-wrong");
    }

    // Direct editing:
    // click the word -> it returns to the Word Bank.
    button.addEventListener("click", () => {
      if (questionFinished) return;

      const removeAt = selectedWords.indexOf(bankIndex);

      if (removeAt !== -1) {
        selectedWords.splice(removeAt, 1);
      }

      renderWordBank(question);
      renderSentence(question);
    });

    sentenceArea.appendChild(button);
  });
}

function checkUnscramble(question) {
  if (selectedWords.length !== question.answer.length) {
    setFeedback(
      "Please use all the words before checking.",
      "warning"
    );
    return;
  }

  const userAnswer = selectedWords.map(
    bankIndex => shuffledWords[bankIndex]
  );

  const correct = userAnswer.every(
    (word, index) =>
      normalizeText(word) === normalizeText(question.answer[index])
  );

  if (correct) {
    setFeedback("🎉 Perfect! The sentence is correct.", "correct");
    finishQuestion("unscramble", true);
  } else {
    setFeedback(
      "Some words are still in the wrong position. Click a word to move it back and try again.",
      "warning"
    );
  }
}

clearUnscramble.addEventListener("click", () => {
  if (questionFinished) return;

  selectedWords = [];
  const question = getCurrentQuestion();

  renderWordBank(question);
  renderSentence(question);
  setFeedback("");
});

// =========================
// WRITING
// =========================
function loadWriting(question) {
  questionType.textContent = "WRITING";
  writingContainer.classList.remove("hidden");

  writingTemplate.innerHTML =
    `<strong>Sentence pattern:</strong> ${question.template}`;

  writingNote.textContent =
    "Your answer is checked for subject, verb, keyword, punctuation, and minimum word count.";
}

function getWritingChecks(question, answer) {
  const requirements = question.requirements || {};
  const clean = answer.trim();
  const normalized = normalizeText(clean);
  const words = normalized ? normalized.split(" ") : [];

  // Use safe defaults (empty arrays) for missing requirement fields
  const subjects = requirements.subjects || [];
  const verbs = requirements.verbs || [];
  const keywords = requirements.keywords || [];
  const articles = requirements.article || [];
  const prepositions = requirements.preposition || [];
  const numbers = requirements.number || [];
  const punctuationRequired = typeof requirements.punctuation !== "undefined"
    ? requirements.punctuation
    : null;
  const minWords = typeof requirements.minWords === "number" ? requirements.minWords : 0;

  // If a requirement list is empty/unspecified, treat that check as "not required" (pass)
  const hasSubject = subjects.length === 0
    ? true
    : subjects.some(subject => words.includes(normalizeText(subject)));

  const hasVerb = verbs.length === 0
    ? true
    : verbs.some(verb => words.includes(normalizeText(verb)));

  const hasKeyword = keywords.length === 0
    ? true
    : keywords.every(keyword => normalized.includes(normalizeText(keyword)));

  const hasArticle = articles.length === 0
    ? true
    : articles.some(article => normalized.includes(normalizeText(article)));

  const hasPreposition = prepositions.length === 0
    ? true
    : prepositions.some(preposition => normalized.includes(normalizeText(preposition)));

  const hasNumber = numbers.length === 0
    ? true
    : numbers.some(number => words.includes(normalizeText(number)));

  const hasPunctuation =
    punctuationRequired === null ? true : clean.endsWith(punctuationRequired);

  const hasEnoughWords = words.length >= minWords;

  // also return which checks were actually required so the renderer can show only relevant rows
  const required = {
    subject: subjects.length > 0,
    verb: verbs.length > 0,
    keyword: keywords.length > 0,
    article: articles.length > 0,
    preposition: prepositions.length > 0,
    number: numbers.length > 0,
    punctuation: punctuationRequired !== null,
    wordCount: minWords > 0
  };

  return {
    hasSubject,
    hasVerb,
    hasKeyword,
    hasArticle,
    hasPreposition,
    hasNumber,
    hasPunctuation,
    hasEnoughWords,
    required,
    all:
      hasSubject &&
      hasVerb &&
      hasKeyword &&
      hasArticle &&
      hasNumber &&
      hasPreposition &&
      hasPunctuation &&
      hasEnoughWords
  };
}

function renderWritingChecks(checks) {
  // Build only the checks that are required for this question
  const mapping = [
    ["Subject", checks.hasSubject, checks.required.subject],
    ["Verb", checks.hasVerb, checks.required.verb],
    ["Keyword", checks.hasKeyword, checks.required.keyword],
    ["Article", checks.hasArticle, checks.required.article],
    ["Number", checks.hasNumber, checks.required.number],
    ["Preposition", checks.hasPreposition, checks.required.preposition],
    ["Punctuation", checks.hasPunctuation, checks.required.punctuation],
    ["Word count", checks.hasEnoughWords, checks.required.wordCount]
  ];

  const itemsToShow = mapping.filter(([, , required]) => required);

  // If nothing was required (defensive), show a minimal word-count check
  const items = itemsToShow.length ? itemsToShow : [["Word count", checks.hasEnoughWords, true]];

  return `
    <div class="writing-checks">
      ${items
        .map(([label, ok]) =>
          `<span class="${ok ? "check-pass" : "check-fail"}">
            ${ok ? "✓" : "✗"} ${label}
          </span>`
        )
        .join("")}
    </div>
  `;
}

function checkWriting(question) {
  const answer = writingAnswer.value.trim();

  if (!answer) {
    setFeedback("Please write a sentence first.", "warning");
    writingAnswer.focus();
    return;
  }

  const checks = getWritingChecks(question, answer);

  if (checks.all) {
    setFeedback(
      `${renderWritingChecks(checks)}
       <div><strong>🎉 Excellent!</strong> Your sentence follows the required structure.</div>`,
      "correct"
    );

    finishQuestion("writing", true);
    return;
  }

  // Wrong writing answer does not end the question.
  // Show the model and require a rewrite.
  setFeedback(
    `${renderWritingChecks(checks)}
     <div class="writing-retry">
       <strong>Not quite yet.</strong><br>
       Sample answer: <strong>${question.sampleAnswer}</strong><br>
       Please rewrite the sentence and try again.
     </div>`,
    "warning"
  );

  writingAnswer.focus();
}

// =========================
// QUESTION FINISH
// =========================
function finishQuestion(type, correct) {
  questionFinished = true;

  stats[type].total++;

  if (correct) {
    stats[type].correct++;
    score++;
    addStar();
  }

  updateScore();

  checkBtn.disabled = true;
  nextBtn.classList.remove("hidden");

  document.querySelectorAll(
    ".choice-btn, .word-btn, .selected-word"
  ).forEach(button => {
    button.disabled = true;
  });

  clearUnscramble.disabled = true;
  writingAnswer.disabled = true;
}

// =========================
// NEXT QUESTION
// =========================
function nextQuestion() {
  if (!questionFinished) return;

  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }

  loadQuestion();
}

// =========================
// RESULT BREAKDOWN
// =========================
function showResults() {
  document.querySelector(".game-container").classList.add("game-finished");
  resultScreen.classList.remove("hidden");

  finalScore.textContent = score;
  finalTotal.textContent = questions.length;
  finalStars.textContent =
    "★".repeat(stars) + "☆".repeat(3 - stars);

  resultBreakdown.innerHTML = `
    <h3>🏆 Performance breakdown</h3>

    <div class="breakdown-grid">
      <div class="breakdown-card">
        <span>Multiple Choice</span>
        <strong>${stats.multipleChoice.correct} / ${stats.multipleChoice.total}</strong>
      </div>

      <div class="breakdown-card">
        <span>Unscramble</span>
        <strong>${stats.unscramble.correct} / ${stats.unscramble.total}</strong>
      </div>

      <div class="breakdown-card">
        <span>Writing</span>
        <strong>${stats.writing.correct} / ${stats.writing.total}</strong>
      </div>
    </div>
  `;
}

// =========================
// RESTART
// =========================
restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  stars = 0;

  Object.keys(stats).forEach(type => {
    stats[type].correct = 0;
    stats[type].total = 0;
  });

  document.querySelector(".game-container").classList.remove("game-finished");
  resultScreen.classList.add("hidden");

  loadQuestion();
});

// =========================
// CHECK / NEXT
// =========================
checkBtn.addEventListener("click", () => {
  const question = getCurrentQuestion();

  if (question.type === "multipleChoice") {
    checkMultipleChoice(question);
  } else if (question.type === "unscramble") {
    checkUnscramble(question);
  } else if (question.type === "writing") {
    checkWriting(question);
  }
});

nextBtn.addEventListener("click", nextQuestion);

// =========================
// THEME SYSTEM
// =========================
function setTheme(theme) {
  const themes = ["candy", "sky", "mint", "sunshine", "lavender"];
  const safeTheme = themes.includes(theme) ? theme : "candy";

  document.body.dataset.theme = safeTheme;
  localStorage.setItem("english-game-theme", safeTheme);

  // FIX #2: Add null check before setting themeSelect value
  if (themeSelect) {
    themeSelect.value = safeTheme;
  }
}

// FIX #2: Add null check before attaching event listener
if (themeSelect) {
  themeSelect.addEventListener("change", event => {
    setTheme(event.target.value);
  });
}

setTheme(localStorage.getItem("english-game-theme") || "candy");

// Start
updateStars();
loadQuestion();
