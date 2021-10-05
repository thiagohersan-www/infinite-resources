import * as THREE from './three/three.module.js';
import { Strip } from './Strip.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });

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

for(let i = -NSTRIPS_TOTAL; i <= NSTRIPS_ONSCREEN; i++) {
  const mS = new Strip(window.innerWidth, 0.9999 * STRIP_HEIGHT, i);
  mS.mesh.position.set(-window.innerWidth / 2,
                       -window.innerHeight / 2 + i * STRIP_HEIGHT);
  scene.add(mS.mesh);  
}

window.addEventListener('click', () => {
  renderer.render(scene, camera);
});

let cy = 0;
function render() {
  cy -= 0.6666;
  cy = Math.max(cy, -(NSTRIPS_TOTAL - 1) * STRIP_HEIGHT);
  camera.position.set(0, cy, 110);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
