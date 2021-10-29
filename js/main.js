import * as THREE from './three/three.module.js';
import { Scroll } from './Scroll.js';
import { Strip } from './Strip.js';
import { clearScene } from './clear.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

window.addEventListener('DOMContentLoaded', () => {
  // THREEJS
  scene.background = new THREE.Color(0xffffff);
  camera.position.set(0, 0, 110);
  renderer.domElement.classList.add('my-canvas');
  //document.body.appendChild(renderer.domElement);
  document.getElementById('my-container').appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // SCROLL
  mScrollDiv.style.height = `${15 * window.innerHeight}px`;
  setTimeout(centerScroll, 500);

  // GUI
  setParams();
  Array.from(document.getElementsByTagName('input')).forEach(el => {
    el.addEventListener('change', updateParams);
  });
});

function setParams() {
  document.getElementById('param-num-layer').value = 8;
  document.getElementById('param-amp').value = 1;
  document.getElementById('param-x-scale').value = 160;
  document.getElementById('param-y-scale').value = 10;
}

function updateParams(ev) {
  const inputId = ev.target.id;

  clearScene(scene);

  if (inputId.includes('-amp')) {
    Strip.AMPLITUDE = 1.000005 * ev.target.value;
  } else if (inputId.includes('-num-layer')) {
    Scroll.NSTRIPS_ONSCREEN = ev.target.value;
    Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;
  } else if (inputId.includes('-x-scale')) {
    Strip.DIVERSITY_X = ev.target.value;
  } else if (inputId.includes('-y-scale')) {
    Strip.DIVERSITY_Y = ev.target.value;
  }
  new Scroll(scene);
}

const mScroll = new Scroll(scene);
const MAX_DEPTH = -(Scroll.NSTRIPS_TOTAL - 1) * Scroll.STRIP_HEIGHT;

let previousScrollTop = 0;
let previousScrollTimeout;
const mScrollDiv = document.getElementById('my-scroll-div');

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

  camera.position.set(camera.position.x,
                      clamp(camera.position.y - deltaY, MAX_DEPTH, 0),
                      camera.position.z);
};

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
