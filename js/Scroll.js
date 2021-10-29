import * as THREE from './three/three.module.js';
import { Strip } from './Strip.js';

class Scroll {
  constructor(scene) {
    this.scene = scene;
    this.meshes = Array(Scroll.NSTRIPS_TOTAL);
    this.previousTopIdx = 0;

    for(let i = 0; i < Scroll.NSTRIPS_TOTAL; i++) {
      // TODO: might be better to just create and return the THREE.Mesh() object
      const mS = new Strip(window.innerWidth, Scroll.STRIP_HEIGHT, i);

      scene.add(mS.mesh);
    }
  }

  update(topPosition) {
    const topIdx = topPosition / Scroll.STRIP_HEIGHT;

    if (topIdx > this.previousTopIdx) {
      for (var i = this.previousTopIdx; i < topIdx; i++) {
        // this.meshes[i % Scroll.NSTRIPS_TOTAL].clear()
        // this.meshes[i % Scroll.NSTRIPS_TOTAL] = Strip(w, h, i + Scroll.NSTRIPS_TOTAL)
      }
    } else if (topIdx < this.previousTopIdx) {
      for (var i = this.previousTopIdx; i > topIdx - 1; i--) {
        // this.meshes[i % Scroll.NSTRIPS_TOTAL].clear()
        // this.meshes[i % Scroll.NSTRIPS_TOTAL] = Strip(w, h, i)
      }
    }

    this.previousTopIdx = topIdx;
  }
}

Scroll.NSTRIPS_TOTAL = 120;
Scroll.NSTRIPS_ONSCREEN = 8;
Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;

export { Scroll };
