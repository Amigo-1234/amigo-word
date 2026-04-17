// removed: inline initFlashcards, renderFlashcard, nextFlashcard, getFlashcardWords implementations in app.js

import { $, $$, getClientX } from "../core/utils.js";
import { state } from "../core/state.js";
import { addXP } from "../core/state.js";
import { escapeHtml } from "../core/utils.js";
import { renderWordList } from "./words.js";
import { updateStatsFromState } from "./profile.js";

export function initFlashcards() {
  $("#flashcardSkipBtn").addEventListener("click", () => {
    nextFlashcard(false);
  });
  $("#flashcardKnowBtn").addEventListener("click", () => {
    nextFlashcard(true);
  });
}

function getFlashcardWords() {
  return state.words;
}

export function renderFlashcard() {
  const container = $(".flashcard-container");
  const cardsData = getFlashcardWords();
  $("#flashcardTotal").textContent = cardsData.length || 0;

  if (!cardsData.length) {
    container.innerHTML = `
      <div class="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div>
              <div class="flashcard-label">No words yet</div>
              <div class="flashcard-word" style="font-size:18px;margin-top:8px;">
                Add words to start training
              </div>
            </div>
            <div class="flashcard-footer">
              <div class="flashcard-hint">
                Go to the Words tab and add your first word.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#flashcardIndex").textContent = 0;
    return;
  }

  if (state.flashcards.index >= cardsData.length) {
    state.flashcards.index = 0;
  }
  const data = cardsData[state.flashcards.index];
  $("#flashcardIndex").textContent = state.flashcards.index + 1;

  const card = document.createElement("div");
  card.className = "flashcard";

  card.innerHTML = `
    <div class="flashcard-inner">
      <div class="flashcard-face flashcard-front">
        <div>
          <div class="flashcard-label">Tap to reveal</div>
          <div class="flashcard-word">${data.word}</div>
          <div class="flashcard-hint">Swipe left / right or use buttons below.</div>
        </div>
        <div class="flashcard-footer">
          <span class="flashcard-tag">Every ${data.interval} mins</span>
          <span class="flashcard-hint">${
            data.status === "learning" ? "Learning" : "Mastered"
          }</span>
        </div>
      </div>
      <div class="flashcard-face flashcard-back">
        <div>
          <div class="flashcard-label">Meaning</div>
          <div class="flashcard-meaning">${data.meaning}</div>
          ${
            data.example
              ? `<div class="flashcard-example">“${escapeHtml(
                  data.example
                )}”</div>`
              : ""
          }
        </div>
        <div class="flashcard-footer">
          <span class="flashcard-tag">Flashcard</span>
          <span class="flashcard-hint">Tap again to flip back.</span>
        </div>
      </div>
    </div>
  `;

  card.addEventListener("click", (e) => {
    if (card.classList.contains("swiping")) return;
    card.classList.toggle("flipped");
  });

  let startX = 0;
  let currentX = 0;
  let dragging = false;
  const threshold = 40;

  function onPointerDown(e) {
    dragging = true;
    startX = getClientX(e);
    currentX = startX;
    card.classList.add("swiping");
  }

  function onPointerMove(e) {
    if (!dragging) return;
    currentX = getClientX(e);
    const dx = currentX - startX;
    const rotate = dx / 18;
    card.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
    card.style.opacity = `${Math.max(0.4, 1 - Math.abs(dx) / 260)}`;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    card.classList.remove("swiping");
    const dx = currentX - startX;

    if (Math.abs(dx) > threshold) {
      const know = dx > 0;
      card.style.transition = "transform 220ms ease-out, opacity 200ms ease-out";
      card.style.transform = `translateX(${dx > 0 ? 260 : -260}px) rotate(${
        dx > 0 ? 18 : -18
      }deg)`;
      card.style.opacity = "0";
      setTimeout(() => nextFlashcard(know), 180);
    } else {
      card.style.transition =
        "transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out";
      card.style.transform = "";
      card.style.opacity = "1";
    }
  }

  const listeners = [
    ["pointerdown", onPointerDown],
    ["pointermove", onPointerMove],
    ["pointerup", onPointerUp],
    ["pointercancel", onPointerUp],
    ["touchstart", onPointerDown],
    ["touchmove", onPointerMove],
    ["touchend", onPointerUp],
    ["touchcancel", onPointerUp],
  ];

  listeners.forEach(([ev, fn]) => card.addEventListener(ev, fn));

  container.innerHTML = "";
  container.appendChild(card);
}

export function nextFlashcard(know) {
  const cardsData = getFlashcardWords();
  if (!cardsData.length) return;

  const current = cardsData[state.flashcards.index];
  if (know) {
    current.status = "mastered";
    addXP(5);
    updateStatsFromState();
  }
  state.flashcards.index = (state.flashcards.index + 1) % cardsData.length;
  renderWordList();
  renderFlashcard();
}