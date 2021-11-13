import * as THREE from './three/three.module.js';
import { Gui } from './Gui.js';
import { Scroll } from './Scroll.js';

const CAM_FOV = 150;
const LAYERS_Y_OFFSET = -window.innerHeight / 2.0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CAM_FOV, window.innerWidth / window.innerHeight, 1, 150);
const renderer = new THREE.WebGLRenderer({ antialias: true });

function setupScene() {
  const camZ = (window.innerHeight / 2) / Math.tan(CAM_FOV / 2 * Math.PI / 180);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.set(0, 0, camZ);
  camera.updateProjectionMatrix();

  scene.background = new THREE.Color(0xffffff);
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

  window.mScroll = new Scroll(scene, () => renderer.render(scene, camera));
  window.mGui = new Gui(scene, () => renderer.render(scene, camera));
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

  const currentScrollTop = getScrollTopPosition();
  const deltaY = currentScrollTop - previousScrollTop;
  previousScrollTop = currentScrollTop;

  if (currentScrollTop < (2 * window.innerHeight) ||
      currentScrollTop > (13 * window.innerHeight)) {
    clearTimeout(previousScrollTimeout);
    centerScroll();
  } else {
    clearTimeout(previousScrollTimeout);
    previousScrollTimeout = setTimeout(centerScroll, 2000);
  }

  scene.position.setY(Math.max(LAYERS_Y_OFFSET, scene.position.y + deltaY));
  window.mScroll.update(scene.position.y);
  mShadowDiv.style.opacity = Math.max(0, Math.min(1, 0.2 * scene.position.y / window.innerHeight));

  renderer.render(scene, camera);
};
