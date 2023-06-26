// TODO:
// - mobile: check noise peaks. pattern image is wrapping
// - mobile: random reset

import "./Overlay.js";
import { AUTO_SCROLL, AUTO_SCROLL_SPEED } from "./AutoScroll.js";
import { Scene } from "./Scene.js";
import { Scroll } from "./Scroll.js";

let previousHeight = window.innerHeight;
let previousWidth = window.innerWidth;

const setupScene = () => {
  if (window.innerHeight < previousHeight && window.innerWidth === previousWidth) return;

  previousHeight = window.innerHeight;
  previousWidth = window.innerWidth;

  Scene.setup();
  Scroll.setup();

  onScrollCommon();
};

const onScrollCommon = () => {
  Scene.update();
  Scroll.update();

  if (AUTO_SCROLL) {
    window.scrollBy(0, AUTO_SCROLL_SPEED);
    requestAnimationFrame(() => onScrollCommon());
  }
};

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

window.addEventListener("DOMContentLoaded", setupScene);
window.addEventListener("resize", setupScene);

if (!AUTO_SCROLL) {
  window.addEventListener("wheel", onScrollCommon, { passive: true });
  window.addEventListener("touchmove", onScrollCommon, { passive: true });
}
