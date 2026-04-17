// removed: inline initHome implementation in app.js

import { $, $$ } from "../core/utils.js";
import { state } from "../core/state.js";
import { computeLevelLabel } from "../core/state.js";
import { createTapRippleFromElement } from "../ui/tapRipple.js";

export function initHome() {
  $("#dailyLearnedCount").textContent = state.dailyLearned;
  const ratio = Math.min(state.dailyLearned / state.dailyGoal, 1);
  $("#dailyProgressBar").style.width = `${Math.round(ratio * 100)}%`;

  $("#currentLevelLabel").textContent = computeLevelLabel(state.xp);
  $("#currentXP").textContent = state.xp;
  $("#nextLevelXP").textContent = state.xpNext;
  $("#xpBar").style.width = `${Math.min(
    (state.xp / state.xpNext) * 100,
    100
  )}%`;

  function setRandomWOTD() {
    const word =
      state.words[Math.floor(Math.random() * state.words.length)] ||
      state.words[0];
    if (!word) return;
    $("#wotdWord").textContent = word.word;
    $("#wotdMeaning").textContent = word.meaning;
    $("#wotdExample").textContent = word.example || "";
  }
  setRandomWOTD();

  $("#shuffleWOTDBtn").addEventListener("click", () => {
    setRandomWOTD();
    createTapRippleFromElement($("#shuffleWOTDBtn"));
  });
}