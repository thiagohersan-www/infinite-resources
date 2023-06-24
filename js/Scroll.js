import { Strip } from "./Strip.js";

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");

class Scroll {
  constructor(scene) {
    this.scene = scene;
    this.layers = Array(Scroll.NSTRIPS_TOTAL);
    this.previousTopIdx = 0;

    for (let i = 0; i < Scroll.NSTRIPS_TOTAL; i++) {
      this.layers[i] = Strip.getMesh(window.innerWidth, Scroll.STRIP_HEIGHT, i);
      this.scene.addBottom(this.layers[i]);
    }
  }

  update(topPosition) {
    const topIdx = Math.max(0, Math.floor(topPosition / Scroll.STRIP_HEIGHT - Scroll.NSTRIPS_TOTAL / 2));

    if (topIdx == 0 && this.previousTopIdx == 0) return;

    if (topIdx > this.previousTopIdx) {
      for (var i = this.previousTopIdx; i < topIdx; i++) {
        this.scene.removeTop();
        this.layers[i % Scroll.NSTRIPS_TOTAL] = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, i + Scroll.NSTRIPS_TOTAL);
        this.scene.addBottom(this.layers[i % Scroll.NSTRIPS_TOTAL]);
      }
    } else if (topIdx < this.previousTopIdx) {
      for (var i = this.previousTopIdx - 1; i > topIdx - 1; i--) {
        this.scene.removeBottom();
        this.layers[i % Scroll.NSTRIPS_TOTAL] = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, i);
        this.scene.addTop(this.layers[i % Scroll.NSTRIPS_TOTAL]);
      }
    }

    this.previousTopIdx = topIdx;
  }
}

Scroll.NSTRIPS_TOTAL = AUTO_SCROLL ? 32 : 32;
Scroll.NSTRIPS_ONSCREEN = AUTO_SCROLL ? 12 : 7;
Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;

export { Scroll };
