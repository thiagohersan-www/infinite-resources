import { Overlay } from "./Overlay.js";
import { Scene } from "./Scene.js";
import { Scroll } from "./Scroll.js";
import { Strip } from "./Strip.js";

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");
const AUTO_SCROLL_SPEED = parseFloat(urlParams.get("autoScroll")) || 1.0;

let currentLayersOffsetY = 0;
let currentHeight = window.innerHeight;
let currentWidth = window.innerWidth;

const getLayersOffsetY = () => {
  const layerContainer = document.getElementById("my-layer-container");
  if (layerContainer.children.length < 2) return 0;

  const firstLayerTop = layerContainer.children[1].getBoundingClientRect()["top"];
  return window.innerHeight - (firstLayerTop - 0.5 * Strip.AMPLITUDE * Scroll.STRIP_HEIGHT);
};

const setupInitial = () => {
  window.mOverlay = new Overlay();
  setupScene();
};

const setupScene = () => {
  if (window.innerHeight < currentHeight && window.innerWidth === currentWidth) return;

  window.mScene = new Scene();
  window.mScroll = new Scroll(window.mScene);

  currentHeight = window.innerHeight;
  currentWidth = window.innerWidth;
  document.getElementById("my-shadow-div").style.height = `${currentHeight}px`;

  currentLayersOffsetY = getLayersOffsetY();
  document.getElementById("my-layer-container").style.marginTop = `${currentLayersOffsetY}px`;
  onScrollCommon();
};

const unLoad = () => {
  document.getElementById("my-container").innerHTML = "";
  window.scrollTo(0, 0);
};

const onScrollCommon = () => {
  const scenePositionY = window.pageYOffset;

  const mShadowDiv = document.getElementById("my-shadow-div");
  const mInfoButton = document.getElementById("my-info-button");

  const shadowOpacity = 0.5 * (scenePositionY - currentLayersOffsetY) / window.innerHeight;
  const infoOpacity = 1.0 - 4.0 * shadowOpacity;

  mShadowDiv.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
  mInfoButton.style.opacity = Math.max(0, Math.min(1, infoOpacity));
  mInfoButton.style.display = infoOpacity <= 0 ? "none" : "block";

  window.mScroll.update(scenePositionY);

  if (AUTO_SCROLL) {
    window.scrollBy(0, AUTO_SCROLL_SPEED);
    requestAnimationFrame(() => onScrollCommon());
  }
};

const onScrollDesktop = (event) => {
  const deltaY = parseInt(event.deltaY / window.devicePixelRatio);
  onScrollCommon();
};

const onTouchMobile = (event) => {
  window.touchDownY = event.touches[0].clientY;
};

const onScrollMobile = (event) => {
  const deltaY = -(event.touches[0].clientY - window.touchDownY);
  window.touchDownY = event.touches[0].clientY;
  onScrollCommon();
};

window.addEventListener("DOMContentLoaded", setupInitial);
window.addEventListener("resize", setupScene);
window.addEventListener("beforeunload", unLoad);

window.addEventListener("wheel", onScrollDesktop, { passive: false });
window.addEventListener("touchmove", onScrollMobile, { passive: false });
window.addEventListener("touchstart", onTouchMobile);
