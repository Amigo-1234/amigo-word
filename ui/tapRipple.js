// removed: inline tap ripple helpers in app.js (createTapRippleFromEvent, createTapRippleFromElement, triggerTapRipple, initGlobalTapRipple)

import { $ } from "../core/utils.js";

let tapRippleEl;
let tapRippleTimeout = null;

function ensureTapRippleElement() {
  if (!tapRippleEl) {
    tapRippleEl = $("#tapRipple");
  }
  return tapRippleEl;
}

export function triggerTapRipple(x, y) {
  const tapRipple = ensureTapRippleElement();
  if (!tapRipple) return;

  tapRipple.style.left = `${x - 21}px`;
  tapRipple.style.top = `${y - 21}px`;
  tapRipple.classList.remove("tap-ripple-active");
  void tapRipple.offsetWidth; // reflow
  tapRipple.classList.add("tap-ripple-active");

  clearTimeout(tapRippleTimeout);
  tapRippleTimeout = setTimeout(() => {
    tapRipple.classList.remove("tap-ripple-active");
  }, 380);
}

export function createTapRippleFromEvent(e) {
  const x = e.clientX;
  const y = e.clientY;
  triggerTapRipple(x, y);
}

export function createTapRippleFromElement(el) {
  const rect = el.getBoundingClientRect();
  triggerTapRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

export function initGlobalTapRipple() {
  document.addEventListener("pointerdown", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (
      e.target.closest(
        ".primary-btn, .secondary-btn, .bottom-nav-item, .fab, .pill-btn, .intensity-chip, .word-card, .icon-button"
      )
    ) {
      createTapRippleFromEvent(e);
    }
  });
}