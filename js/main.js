// TODO:
// - detect up/down to prevent add/rm layer loop/fight
// - detect scroll to prevent calling update every frame
// - add more than 1 <svg> per frame
// - look into opacity logic when removing larger top layer
// - mobile: check noise peaks. pattern image is wrapping
// - mobile: random reset

import "./Overlay.js";
import { AUTO_SCROLL, AUTO_SCROLL_SPEED } from "./AutoScroll.js";
import { Scene } from "./Scene.js";
import { Scroll } from "./Scroll.js";

let previousHeight = null;
let previousWidth = null;

const setup = () => {
  if (window.innerHeight !== previousHeight) Scene.resizeShadow();
  if (window.innerWidth === previousWidth) return;

  previousHeight = window.innerHeight;
  previousWidth = window.innerWidth;

  Scene.setup();
  Scroll.setup();

  update();
};

const update = () => {
  Scene.update();
  Scroll.update();

  if (AUTO_SCROLL) {
    window.scrollBy(0, AUTO_SCROLL_SPEED);
  }
  requestAnimationFrame(() => update());
};

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

window.addEventListener("DOMContentLoaded", setup);
window.addEventListener("resize", setup);
