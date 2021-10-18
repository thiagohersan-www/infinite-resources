import * as THREE from './three/three.module.js';
import { Strip } from './Strip.js';

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

scene.background = new THREE.Color(0xffffff);
camera.position.set(0, 0, 110);
renderer.domElement.classList.add('my-canvas');
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

// TODO: make scroll object
const NSTRIPS_TOTAL = 100;
const NSTRIPS_ONSCREEN = 8;
const STRIP_HEIGHT = window.innerHeight / NSTRIPS_ONSCREEN;
const MAX_DEPTH = -(NSTRIPS_TOTAL - 1) * STRIP_HEIGHT;

for(let i = -NSTRIPS_TOTAL; i <= NSTRIPS_ONSCREEN; i++) {
  const mS = new Strip(window.innerWidth, 0.9999 * STRIP_HEIGHT, i);
  mS.mesh.position.set(-window.innerWidth / 2,
                       -window.innerHeight / 2 + i * STRIP_HEIGHT);
  scene.add(mS.mesh);  
}

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

window.addEventListener('load', (event) => {
  mScrollDiv.style.height = `${15 * window.innerHeight}px`;
  setTimeout(centerScroll, 500);
});

const onScroll = (event) => {
  const currentScrollTop = getScrollTopPosition();
  const deltaY = currentScrollTop - previousScrollTop;
  previousScrollTop = currentScrollTop;

  clearTimeout(previousScrollTimeout);
  previousScrollTimeout = setTimeout(centerScroll, 500);
  camera.position.set(camera.position.x,
                      clamp(camera.position.y - deltaY, MAX_DEPTH, 0),
                      camera.position.z);
};

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
