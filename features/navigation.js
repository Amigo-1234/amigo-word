// removed: inline initNavigation implementation in app.js

import { $, $$ } from "../core/utils.js";
import { renderFlashcard } from "./flashcards.js";
import { ensureQuizQuestion } from "./quiz.js";

export function initNavigation() {
  const screens = $$(".screen");
  const navButtons = $$(".bottom-nav-item");

  function activateScreen(target) {
    screens.forEach((s) =>
      s.dataset.screen === target
        ? s.classList.add("screen-active")
        : s.classList.remove("screen-active")
    );
    navButtons.forEach((btn) =>
      btn.dataset.nav === target
        ? btn.classList.add("bottom-nav-item-active")
        : btn.classList.remove("bottom-nav-item-active")
    );

    if (target === "flashcards") renderFlashcard();
    if (target === "quiz") ensureQuizQuestion();
  }

  // Expose navigation helper globally for cross-feature flows (e.g. Add Word -> Flashcards).
  window.amigoNavigate = activateScreen;

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.nav;
      activateScreen(target);
    });
  });

  // In-card shortcuts
  $$("[data-nav-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.navTarget;
      activateScreen(target);
      const nav = document.querySelector(`.bottom-nav-item[data-nav="${target}"]`);
      if (nav) {
        nav.classList.add("bottom-nav-item-active");
      }
    });
  });
}