import { Overlay } from "./Overlay.js";
import { Scene } from "./Scene.js";
import { Scroll } from "./Scroll.js";
import { Strip } from "./Strip.js";

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");
const AUTO_SCROLL_SPEED = parseFloat(urlParams.get("autoScroll")) || 1.0;

// TODO: add this as padding/margin to hide layers
const LAYERS_Y_OFFSET = () => {
  return 0;
  return window.innerHeight / 2.0 - (Scroll.STRIP_HEIGHT + 0.5 * Strip.AMPLITUDE * Scroll.STRIP_HEIGHT);
};

let currentLayersOffsetY = LAYERS_Y_OFFSET();
let currentHeight = window.innerHeight;

const setupScene = () => {
  if (window.innerHeight < currentHeight) return;

  currentHeight = window.innerHeight;
  currentLayersOffsetY = LAYERS_Y_OFFSET();
  document.getElementById("my-shadow-div").style.height = `${window.innerHeight}px`;
  document.getElementById("my-layer-container").style.paddingTop = `${currentLayersOffsetY}px`;
};

const setup = () => {
  setupScene();
  window.mOverlay = new Overlay();
  window.mScene = new Scene();
  window.mScroll = new Scroll(window.mScene);
  onScrollCommon(0);
};

const onScrollCommon = (deltaY) => {
  const pageOffsetY = window.pageYOffset;
  window.mScene.updateY(deltaY);
  // console.log(pageOffsetY, " X ", window.mScene.deltaY);

  const scenePositionY = pageOffsetY;

  const mShadowDiv = document.getElementById("my-shadow-div");
  const mInfoButton = document.getElementById("my-info-button");

  const shadowOpacity = 0.5 * (scenePositionY - currentLayersOffsetY) / window.innerHeight;
  const infoOpacity = 1.0 - 4.0 * shadowOpacity;

  mShadowDiv.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
  mInfoButton.style.opacity = Math.max(0, Math.min(1, infoOpacity));
  mInfoButton.style.display = infoOpacity <= 0 ? "none" : "block";

  window.mScroll.update(scenePositionY);

  if (AUTO_SCROLL) {
    requestAnimationFrame(() => onScrollCommon(AUTO_SCROLL_SPEED));
  }
};

const onScrollDesktop = (event) => {
  const deltaY = parseInt(event.deltaY / window.devicePixelRatio);
  onScrollCommon(deltaY);
};

const onTouchMobile = (event) => {
  window.touchDownY = event.touches[0].clientY;
};

const onScrollMobile = (event) => {
  const deltaY = event.touches[0].clientY - window.touchDownY;
  window.touchDownY = event.touches[0].clientY;

  onScrollCommon(-deltaY);
};

window.addEventListener("resize", setupScene);
window.addEventListener("wheel", onScrollDesktop, { passive: false });
window.addEventListener("touchmove", onScrollMobile, { passive: false });
window.addEventListener("touchstart", onTouchMobile);
window.addEventListener("DOMContentLoaded", setup);
