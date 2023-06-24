// import { Scroll } from './Scroll.js';
// import { Strip } from './Strip.js';

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has('autoScroll');
const AUTO_SCROLL_SPEED = parseFloat(urlParams.get('autoScroll')) || 1.0;

// const LAYERS_Y_OFFSET = -window.innerHeight / 2.0 - (Scroll.STRIP_HEIGHT + 0.5 * Strip.AMPLITUDE * Scroll.STRIP_HEIGHT);

let currentHeight = window.innerHeight;
const setupScene = () => {
  if (window.innerHeight < currentHeight) return;

  currentHeight = window.innerHeight;
  document.getElementById('my-shadow-div').style.height = `${window.innerHeight}px`;
  // TODO:
  // camera.aspect = window.innerWidth / window.innerHeight;
  // if (window.mScroll === undefined) {
  //   scene.position.setY(LAYERS_Y_OFFSET);
  // }
};

window.addEventListener('resize', setupScene);

window.addEventListener('DOMContentLoaded', () => {
  // THREEJS
  setupScene();

  // INFO
  document.getElementById('hide-overlay-button').addEventListener('click', hideOverlay);
  document.getElementById('my-popup').addEventListener('click', (e) => e.stopPropagation());
  document.getElementById('my-overlay').addEventListener('click', hideOverlay);
  document.getElementById('my-info-button').addEventListener('click', showOverlay);

  // TODO:
  // window.mScroll = new Scroll(scene, () => renderer.render(scene, camera));
  onScrollCommon(0);
});

const hideOverlay = (event) => {
  document.getElementById('my-overlay').style.opacity = 0;
  setTimeout(() => document.getElementById('my-overlay').style.display = 'none', 200);
  window.addEventListener('wheel', onScrollDesktop, { passive: false });
  window.addEventListener('touchmove', onScrollMobile, { passive: false });
  window.removeEventListener('keyup', checkEscKey);
};

const showOverlay = (event) => {
  document.getElementById('my-overlay').style.display = 'flex';
  setTimeout(() => document.getElementById('my-overlay').style.opacity = 1, 100);
  window.removeEventListener('wheel', onScrollDesktop);
  window.removeEventListener('touchmove', onScrollMobile);
  window.addEventListener('keyup', checkEscKey);
};

const checkEscKey = (event) => {
  if (event.key && (event.key === 'Escape' || event.key === 'Esc')) {
    hideOverlay();
  }
};

const onScrollCommon = (deltaY) => {
  // TODO:
  // scene.position.setY(Math.max(LAYERS_Y_OFFSET, scene.position.y + deltaY));

  const mShadowDiv = document.getElementById('my-shadow-div');
  const mInfoButton = document.getElementById('my-info-button');

  // TODO:
  // const shadowOpacity = 2 * (scene.position.y - LAYERS_Y_OFFSET) / window.innerHeight;
  // const infoOpacity = 1.0 - (2 * (scene.position.y - LAYERS_Y_OFFSET) / window.innerHeight);

  // mShadowDiv.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
  // mInfoButton.style.opacity = Math.max(0, Math.min(1, infoOpacity));
  // mInfoButton.style.display = (infoOpacity <= 0) ? 'none' : 'block';

  // TODO:
  // window.mScroll.update(scene.position.y);

  if (AUTO_SCROLL) {
    requestAnimationFrame(() => onScrollCommon(AUTO_SCROLL_SPEED));
  }
};

const onScrollDesktop = (event) => {
  event.preventDefault();
  const deltaY = event.deltaY;
  onScrollCommon(deltaY);
};
window.addEventListener('wheel', onScrollDesktop, { passive: false });

let touchDownY = null;
window.addEventListener('touchstart', (event) => {
  touchDownY = event.touches[0].clientY;
});

const onScrollMobile = (event) => {
  event.preventDefault();
  const deltaY = event.touches[0].clientY - touchDownY;
  touchDownY = event.touches[0].clientY;
  onScrollCommon(-deltaY);
}
window.addEventListener('touchmove', onScrollMobile, { passive: false });
