import * as THREE from './three/three.module.js';
import { Strip } from './Strip.js';

class Scroll {
  constructor(scene) {
    this.scene = scene;

    for(let i = -Scroll.NSTRIPS_TOTAL; i <= Scroll.NSTRIPS_ONSCREEN; i++) {
      // TODO: might be better to just create and return the THREE.Mesh() object
      const mS = new Strip(window.innerWidth,
                           0.9999 * Scroll.STRIP_HEIGHT,
                           i + Scroll.NSTRIPS_TOTAL);

      mS.mesh.position.set(-window.innerWidth / 2,
                           -window.innerHeight / 2 + i * Scroll.STRIP_HEIGHT);
      scene.add(mS.mesh);
    }
  }
}

Scroll.NSTRIPS_TOTAL = 100;
Scroll.NSTRIPS_ONSCREEN = 8;
Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;

export { Scroll };
