// removed: inline initProfile, updateStatsFromState implementations in app.js

import { $, $$ } from "../core/utils.js";
import { state } from "../core/state.js";
import { computeLevelLabel } from "../core/state.js";
import { createTapRippleFromElement } from "../ui/tapRipple.js";

export function initProfile() {
  $("#notificationsToggle").checked = state.settings.notifications;
  $("#notificationsToggle").addEventListener("change", (e) => {
    state.settings.notifications = e.target.checked;
    const slider = $("#notificationsToggle").parentElement;
    if (slider) {
      createTapRippleFromElement(slider);
    }
  });

  $$("#intensityRow .intensity-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.settings.intensity = chip.dataset.intensity;
      $$("#intensityRow .intensity-chip").forEach((c) =>
        c.classList.toggle("intensity-chip-active", c === chip)
      );
      createTapRippleFromElement(chip);
    });
  });

  updateStatsFromState();
}

export function updateStatsFromState() {
  const learnedCount = state.words.filter((w) => w.status === "mastered").length;
  $("#statsWords").textContent = learnedCount;
  $("#statsXP").textContent = state.xp;

  const accuracy =
    state.quiz.total > 0
      ? Math.round((state.quiz.correct / state.quiz.total) * 100)
      : 0;
  $("#statsAccuracy").textContent = `${accuracy}%`;
  $("#statsStreak").textContent = state.streakDays;

  $("#profileLevelLabel").textContent = computeLevelLabel(state.xp);
  $("#profileXP").textContent = state.xp;
  $("#profileNextXP").textContent = state.xpNext;
  $("#profileXPBar").style.width = `${Math.min(
    (state.xp / state.xpNext) * 100,
    100
  )}%`;

  const barsContainer = $("#statsChartBars");
  barsContainer.innerHTML = "";
  const days = 7;
  for (let i = 0; i < days; i++) {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    const fill = document.createElement("div");
    fill.className = "chart-bar-fill";
    const base = (state.xp % 80) + 20;
    const value = ((base + i * 7) % 100) + 10;
    fill.style.height = `${Math.max(10, value)}%`;
    bar.appendChild(fill);
    barsContainer.appendChild(bar);
  }

  // Keep home XP bar and label in sync when stats change
  const xpBar = document.getElementById("xpBar");
  const currentXP = document.getElementById("currentXP");
  const nextXP = document.getElementById("nextLevelXP");
  const currentLevelLabel = document.getElementById("currentLevelLabel");
  if (xpBar && currentXP && nextXP && currentLevelLabel) {
    currentXP.textContent = state.xp;
    nextXP.textContent = state.xpNext;
    xpBar.style.width = `${Math.min(
      (state.xp / state.xpNext) * 100,
      100
    )}%`;
    currentLevelLabel.textContent = computeLevelLabel(state.xp);
  }
}