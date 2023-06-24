import { Overlay } from './Overlay.js';
import { Scene } from './Scene.js';
import { Scroll } from './Scroll.js';
import { Strip } from './Strip.js';

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has('autoScroll');
const AUTO_SCROLL_SPEED = parseFloat(urlParams.get('autoScroll')) || 1.0;

const LAYERS_Y_OFFSET = () => {
  return window.innerHeight / 2.0 - (Scroll.STRIP_HEIGHT + 0.5 * Strip.AMPLITUDE * Scroll.STRIP_HEIGHT);
};

let currentLayersOffsetY = LAYERS_Y_OFFSET();
let currentHeight = window.innerHeight;

const setupScene = () => {
  if (window.innerHeight < currentHeight) return;

  currentHeight = window.innerHeight;
  currentLayersOffsetY = LAYERS_Y_OFFSET();
  document.getElementById('my-shadow-div').style.height = `${window.innerHeight}px`;
  document.getElementById("my-layer-container").style.paddingTop = `${currentLayersOffsetY}px`;
};
window.addEventListener('resize', setupScene);

window.addEventListener('DOMContentLoaded', () => {
  setupScene();

  window.mOverlay = new Overlay();
  window.mScene = new Scene();
  window.mScroll = new Scroll(window.mScene);
  onScrollCommon(0);
});

const onScrollCommon = (deltaY) => {
  // TODO:
  // scene.position.setY(Math.max(currentLayersOffsetY, scene.position.y + deltaY));

  const scenePositionY = window.pageYOffset;

  const mShadowDiv = document.getElementById('my-shadow-div');
  const mInfoButton = document.getElementById('my-info-button');

  const shadowOpacity = 0.5 * (scenePositionY - currentLayersOffsetY) / window.innerHeight;
  const infoOpacity = 1.0 - (2 * (scenePositionY - currentLayersOffsetY) / window.innerHeight);

  mShadowDiv.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
  mInfoButton.style.opacity = Math.max(0, Math.min(1, infoOpacity));
  mInfoButton.style.display = (infoOpacity <= 0) ? 'none' : 'block';

  // TODO:
  // window.mScroll.update(scene.position.y);

  if (AUTO_SCROLL) {
    requestAnimationFrame(() => onScrollCommon(AUTO_SCROLL_SPEED));
  }
};

const onScrollDesktop = (event) => {
  // event.preventDefault();
  const deltaY = event.deltaY;
  onScrollCommon(deltaY);
};
window.addEventListener('wheel', onScrollDesktop, { passive: false });

// let touchDownY = null;
// window.addEventListener('touchstart', (event) => {
//   touchDownY = event.touches[0].clientY;
// });
// 
// const onScrollMobile = (event) => {
//   event.preventDefault();
//   const deltaY = event.touches[0].clientY - touchDownY;
//   touchDownY = event.touches[0].clientY;
//   onScrollCommon(-deltaY);
// }
// window.addEventListener('touchmove', onScrollMobile, { passive: false });
// Overlay.addEvent('touchmove', onScrollMobile);
