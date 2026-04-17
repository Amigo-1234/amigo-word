// removed: inline initWords and renderWordList implementations in app.js

import { $, $$, escapeHtml } from "../core/utils.js";
import { state } from "../core/state.js";
import { renderFlashcard } from "./flashcards.js";
import { ensureQuizQuestion } from "./quiz.js";
import { createTapRippleFromElement } from "../ui/tapRipple.js";

export function initWords() {
  renderWordList();

  const form = $("#addWordForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const word = $("#wordInput").value.trim();
    const meaning = $("#meaningInput").value.trim();
    const interval = parseInt($("#intervalInput").value, 10);
    const example = $("#exampleInput").value.trim();

    if (!word || !meaning || !interval) return;

    state.words.unshift({
      id: state.nextWordId++,
      word,
      meaning,
      interval,
      example,
      status: "learning",
    });

    form.reset();
    renderWordList();
    renderFlashcard();
    ensureQuizQuestion();
    createTapRippleFromElement($(".primary-btn", form));

    if (window.amigoNavigate) {
      window.amigoNavigate("flashcards");
    }
  });

  $("#fabAddWord").addEventListener("click", () => {
    const firstInput = $("#wordInput");
    if (firstInput) firstInput.focus();
    createTapRippleFromElement($("#fabAddWord"));
  });
}

export function renderWordList() {
  const list = $("#wordList");
  list.innerHTML = "";

  $("#wordCountSubtitle").textContent = `${state.words.length} word${
    state.words.length !== 1 ? "s" : ""
  }`;

  state.words.forEach((w) => {
    const card = document.createElement("div");
    card.className = "word-card";

    card.innerHTML = `
      <div class="word-main-row">
        <div>
          <div class="word-title">${w.word}</div>
          <div class="word-meaning">${w.meaning}</div>
          ${
            w.example
              ? `<div class="word-example">“${escapeHtml(w.example)}”</div>`
              : ""
          }
        </div>
      </div>
      <div class="word-meta-row">
        <div class="word-left-meta">
          <span class="timer-badge">Every ${w.interval} mins</span>
          <span class="status-pill ${
            w.status === "learning" ? "status-pill-learning" : ""
          }">${w.status === "learning" ? "Learning" : "Mastered"}</span>
        </div>
        <div class="word-actions">
          <button class="word-action-btn" data-action="toggle" title="Toggle status">✓</button>
          <button class="word-action-btn word-action-btn-delete" data-action="delete" title="Delete">×</button>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".word-action-btn")) return;
      createTapRippleFromElement(card);
    });

    $(".word-actions", card).addEventListener("click", (e) => {
      const btn = e.target.closest(".word-action-btn");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "delete") {
        state.words = state.words.filter((x) => x.id !== w.id);
      } else if (action === "toggle") {
        w.status = w.status === "learning" ? "mastered" : "learning";
      }
      renderWordList();
      renderFlashcard();
      ensureQuizQuestion();
      createTapRippleFromElement(btn);
    });

    list.appendChild(card);
  });
}