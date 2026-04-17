// removed: monolithic state object and all feature functions (navigation, home, words, flashcards, quiz, profile, tap ripple)

import { initNavigation } from "./features/navigation.js";
import { initHome } from "./features/home.js";
import { initWords } from "./features/words.js";
import { initFlashcards } from "./features/flashcards.js";
import { initQuiz } from "./features/quiz.js";
import { initProfile } from "./features/profile.js";
import { initGlobalTapRipple } from "./ui/tapRipple.js";

// App bootstrap
window.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHome();
  initWords();
  initFlashcards();
  initQuiz();
  initProfile();
  initGlobalTapRipple();
});