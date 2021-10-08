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


const mTouch = {
  start: {
    x: 0,
    y: 0,
    t: 0
  },
  previous: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  }
};

window.addEventListener('wheel', (event) => {
  mTouch.velocity.y += event.deltaY / 16;
});

window.addEventListener('touchmove', (event) => {
  const eventY = event.touches[0].screenY;
  mTouch.velocity.y += (mTouch.previous.y - eventY) / 10;
  mTouch.previous.y = eventY;
});

window.addEventListener('touchstart', (event) => {
  mTouch.start.y = event.touches[0].screenY;
  mTouch.previous.y = event.touches[0].screenY;
  mTouch.start.t = event.timeStamp;
});

window.addEventListener('touchend', (event) => {
  const eventY = event.changedTouches[0].screenY;
  mTouch.velocity.y += 10 * (mTouch.start.y - eventY) / (event.timeStamp - mTouch.start.t);
});

function updateCamera() {
  const SCROLL_DAMPENING = 0.9;
  camera.position.set(camera.position.x,
                      clamp(camera.position.y - mTouch.velocity.y, MAX_DEPTH, 0),
                      camera.position.z);
  mTouch.velocity.y *= SCROLL_DAMPENING;
}

function render() {
  updateCamera();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
