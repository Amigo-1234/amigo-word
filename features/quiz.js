// removed: inline initQuiz, ensureQuizQuestion, generateQuestion, renderQuizQuestion,
// handleQuizAnswer, showQuizFeedback implementations in app.js

import { $, $$, shuffleArray } from "../core/utils.js";
import { state, addXP } from "../core/state.js";
import { updateStatsFromState } from "./profile.js";

export function initQuiz() {
  $$(".quiz-mode-toggle .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.quizMode;
      state.quiz.mode = mode;
      $$(".quiz-mode-toggle .pill-btn").forEach((b) =>
        b.classList.toggle("pill-btn-active", b === btn)
      );
      ensureQuizQuestion(true);
    });
  });

  $("#quizNextBtn").addEventListener("click", () => {
    ensureQuizQuestion(true);
  });

  $("#quizFillForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#quizFillInput");
    const user = input.value.trim().toLowerCase();
    if (!state.quiz.currentQuestion) return;
    const correct = state.quiz.currentQuestion.answer.toLowerCase();
    const ok = user === correct;
    handleQuizAnswer(ok);
    showQuizFeedback(ok, state.quiz.currentQuestion);
  });
}

export function ensureQuizQuestion(resetFeedback = false) {
  const question = generateQuestion(state.quiz.mode);
  state.quiz.currentQuestion = question;
  renderQuizQuestion(question);

  if (resetFeedback) {
    $("#quizFeedback").textContent = "";
    $("#quizFeedback").className = "quiz-feedback";
    const fillInput = $("#quizFillInput");
    if (fillInput) fillInput.value = "";
  }
}

function generateQuestion(mode) {
  const pool = state.words;
  if (!pool.length) {
    return {
      type: "info",
      text: "Add a few words to your list to start the quiz.",
      choices: [],
      answer: "",
    };
  }
  const word = pool[Math.floor(Math.random() * pool.length)];

  if (mode === "fill") {
    return {
      type: "fill",
      text: `Type the word that matches: “${word.meaning}”`,
      answer: word.word,
    };
  }

  const correct = word;
  const options = [correct];
  const others = pool.filter((w) => w !== correct);
  shuffleArray(others);
  while (options.length < 4 && others.length) {
    options.push(others.pop());
  }
  shuffleArray(options);
  return {
    type: "choice",
    text: `What does “${correct.word}” mean?`,
    choices: options.map((w) => w.meaning),
    answer: correct.meaning,
  };
}

function renderQuizQuestion(q) {
  $("#quizQuestion").textContent = q.text;
  const choicesContainer = $("#quizChoices");
  const fillForm = $("#quizFillForm");
  choicesContainer.innerHTML = "";

  if (q.type === "choice") {
    choicesContainer.classList.remove("hidden");
    fillForm.classList.add("hidden");
    q.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        const correct = choice === q.answer;
        handleQuizAnswer(correct);
        $$(".quiz-choice-btn", choicesContainer).forEach((b) => {
          b.classList.remove(
            "quiz-choice-btn-selected",
            "quiz-choice-btn-correct",
            "quiz-choice-btn-wrong"
          );
          if (b.textContent === q.answer) {
            b.classList.add("quiz-choice-btn-correct");
          } else if (b === btn && !correct) {
            b.classList.add("quiz-choice-btn-wrong");
          }
        });
        showQuizFeedback(correct, q);
      });
      choicesContainer.appendChild(btn);
    });
  } else if (q.type === "fill") {
    choicesContainer.classList.add("hidden");
    fillForm.classList.remove("hidden");
  } else {
    choicesContainer.classList.add("hidden");
    fillForm.classList.add("hidden");
  }
}

function handleQuizAnswer(correct) {
  state.quiz.total += 1;
  if (correct) {
    state.quiz.correct += 1;
    addXP(3);
  }
  $("#quizCorrect").textContent = state.quiz.correct;
  $("#quizTotal").textContent = state.quiz.total;
  updateStatsFromState();
}

function showQuizFeedback(correct, question) {
  const fb = $("#quizFeedback");
  fb.textContent = correct
    ? "✅ Correct!"
    : `❌ Not quite. Correct answer: ${question.answer}`;
  fb.className = "quiz-feedback " + (correct ? "quiz-feedback-correct" : "quiz-feedback-wrong");
}