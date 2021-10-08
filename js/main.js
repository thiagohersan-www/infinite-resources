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

let startY = 0;
let startMillis = 0;
let lastY = 0;
let velocityY = 0;
const SCROLL_DAMPENING = 0.9;

window.addEventListener('wheel', (event) => {
  velocityY += event.deltaY / 16;
});

window.addEventListener('touchmove', (event) => {
  velocityY += (lastY - event.touches[0].screenY) / 10;
  lastY = event.touches[0].screenY;
});

window.addEventListener('touchstart', (event) => {
  startY = event.touches[0].screenY;
  lastY = event.touches[0].screenY;
  startMillis = event.timeStamp;
});

window.addEventListener('touchend', (event) => {
  velocityY += 10 * (startY - event.changedTouches[0].screenY) / (event.timeStamp - startMillis);
});

function render() {
  camera.position.set(camera.position.x,
                      clamp(camera.position.y - velocityY, MAX_DEPTH, 0),
                      camera.position.z);
  velocityY *= SCROLL_DAMPENING;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
