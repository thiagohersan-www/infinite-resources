import * as THREE from './three/three.module.js';
import { Scroll } from './Scroll.js';
import { Strip } from './Strip.js';

const CAM_FOV = 150;
const LAYERS_Y_OFFSET = -window.innerHeight / 2.0 - (Scroll.STRIP_HEIGHT + 0.5 * Strip.AMPLITUDE * Scroll.STRIP_HEIGHT);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CAM_FOV, window.innerWidth / window.innerHeight, 1, 150);
const renderer = new THREE.WebGLRenderer({ antialias: true });

function setupScene() {
  const camZ = (window.innerHeight / 2) / Math.tan(CAM_FOV / 2 * Math.PI / 180);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.set(0, 0, camZ);
  camera.updateProjectionMatrix();

  scene.background = new THREE.Color(0x666666);
  scene.position.setX(-window.innerWidth / 2);
  if (window.mScroll === undefined) {
    scene.position.setY(LAYERS_Y_OFFSET);
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.render(scene, camera);
}

window.addEventListener('resize', setupScene);

window.addEventListener('DOMContentLoaded', () => {
  // THREEJS
  setupScene();
  renderer.domElement.classList.add('my-canvas');
  document.getElementById('my-container').appendChild(renderer.domElement);

  // SCROLL
  document.getElementById('my-scroll-div').style.height = `${15 * window.innerHeight}px`;
  setTimeout(centerScroll, 500);

  // INFO
  document.getElementById('hide-overlay-button').addEventListener('click', hideOverlay);
  document.getElementById('my-popup').addEventListener('click', (e) => e.stopPropagation());
  document.getElementById('my-overlay').addEventListener('click', hideOverlay);
  document.getElementById('my-info-button').addEventListener('click', showOverlay);

  window.mScroll = new Scroll(scene, () => renderer.render(scene, camera));
});


let previousScrollTop = 0;
let previousScrollTimeout;
function getScrollTopPosition() {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function centerScroll() {
  const mScrollDiv = document.getElementById('my-scroll-div');

  const centerTop = (mScrollDiv.offsetHeight - window.innerHeight) / 2;

  window.removeEventListener('scroll', onScroll);
  window.scrollTo(0, centerTop);
  setTimeout(() => previousScrollTop = getScrollTopPosition(), 10);
  setTimeout(() => window.addEventListener('scroll', onScroll), 20);
}

const onScroll = (event) => {
  const mShadowDiv = document.getElementById('my-shadow-div');
  const mInfoButton = document.getElementById('my-info-button');

  const currentScrollTop = getScrollTopPosition();
  const deltaY = currentScrollTop - previousScrollTop;
  previousScrollTop = currentScrollTop;

  if (currentScrollTop < (2 * window.innerHeight) ||
      currentScrollTop > (13 * window.innerHeight)) {
    clearTimeout(previousScrollTimeout);
    centerScroll();
  } else {
    clearTimeout(previousScrollTimeout);
    previousScrollTimeout = setTimeout(centerScroll, 1000);
  }

  scene.position.setY(Math.max(LAYERS_Y_OFFSET, scene.position.y + deltaY));
  window.mScroll.update(scene.position.y);

  const shadowOpacity = 2 * (scene.position.y - LAYERS_Y_OFFSET) / window.innerHeight;
  const infoOpacity = 1.0 - (2 * (scene.position.y - LAYERS_Y_OFFSET) / window.innerHeight);

  mShadowDiv.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
  mInfoButton.style.opacity = Math.max(0, Math.min(1, infoOpacity));
  mInfoButton.style.display = (infoOpacity <= 0) ? 'none' : 'block';

  renderer.render(scene, camera);
};

const hideOverlay = (event) => {
  document.getElementById('my-overlay').style.opacity = 0;
  setTimeout(() => document.getElementById('my-overlay').style.display = 'none', 200);
  document.getElementById('my-scroll-div').style.display = 'block';
  centerScroll();
  window.removeEventListener('keyup', checkEscKey);
};

const showOverlay = (event) => {
  document.getElementById('my-overlay').style.display = 'flex';
  setTimeout(() => document.getElementById('my-overlay').style.opacity = 1, 100);
  window.removeEventListener('scroll', onScroll);
  document.getElementById('my-scroll-div').style.display = 'none';
  window.addEventListener('keyup', checkEscKey);
};

const checkEscKey = (event) => {
  if(event.key && (event.key === 'Escape' || event.key === 'Esc')) {
    hideOverlay();
  }
}
