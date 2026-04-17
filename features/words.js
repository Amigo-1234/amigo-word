import { listenToWords, addWord } from "../data/store.js";
import { $, escapeHtml } from "../core/utils.js";

export function initWords() {

  const form = $("#addWordForm");
  const list = $("#wordList");

  // ==============================
  // ➕ ADD WORD (FIREBASE ONLY)
  // ==============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const word = $("#wordInput").value.trim();
    const meaning = $("#meaningInput").value.trim();
    const time = parseInt($("#intervalInput").value, 10);
    const example = $("#exampleInput").value.trim();

    if (!word || !meaning || !time) {
      alert("Fill everything");
      return;
    }

    await addWord({ word, meaning, time, example });

    form.reset();
  });

  // ==============================
  // 🔥 LIVE WORD LIST
  // ==============================
  listenToWords((words) => {
    list.innerHTML = "";

    $("#wordCountSubtitle").textContent =
      `${words.length} word${words.length !== 1 ? "s" : ""}`;

    words.forEach((w) => {
      const card = document.createElement("div");
      card.className = "word-card";

      card.innerHTML = `
        <div class="word-main-row">
          <div>
            <div class="word-title">${escapeHtml(w.word)}</div>
            <div class="word-meaning">${escapeHtml(w.meaning)}</div>
            ${
              w.example
                ? `<div class="word-example">“${escapeHtml(w.example)}”</div>`
                : ""
            }
          </div>
        </div>

        <div class="word-meta-row">
          <div class="word-left-meta">
            <span class="timer-badge">Every ${w.time} min</span>
            <span class="status-pill status-pill-learning">Learning</span>
          </div>
        </div>
      `;

      list.appendChild(card);
    });
  });

  // ==============================
  // ➕ FAB BUTTON
  // ==============================
  $("#fabAddWord").addEventListener("click", () => {
    $("#wordInput")?.focus();
  });
}