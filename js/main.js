import * as THREE from './three/three.module.js';
import { Strip } from './Strip.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 300, 600);
const renderer = new THREE.WebGLRenderer({ antialias: true });

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

scene.background = new THREE.Color(0xffffff);
camera.position.set(0, 0, 530);
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

// TODO: make scroll object
const NSTRIPS = 8;
const STRIP_HEIGHT = window.innerHeight / NSTRIPS;

for(let i = 0; i < NSTRIPS; i++) {
  const mS = new Strip(window.innerWidth, STRIP_HEIGHT, i);
  mS.mesh.position.set(-window.innerWidth / 2,
                       -window.innerHeight / 2 + i * STRIP_HEIGHT);
  scene.add(mS.mesh);  
}

renderer.render(scene, camera);

window.addEventListener('click', () => {
  renderer.render(scene, camera);
});

window.renderer = renderer;