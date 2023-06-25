import { Strip } from "./Strip.js";

const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");

class Scroll {
  constructor(scene) {
    this.scene = scene;

    for (let i = 0; i < Scroll.NSTRIPS_TOTAL; i++) {
      const nLayer = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, i);
      this.scene.addBottom(nLayer);
    }

    const bufferLayers = Math.ceil((Scroll.NSTRIPS_TOTAL - Scroll.NSTRIPS_ONSCREEN) / 2);
    this.topThreshold = -bufferLayers * Scroll.STRIP_HEIGHT;
    this.bottomThreshold = bufferLayers * Scroll.STRIP_HEIGHT;
  }

  update() {
    if (this.scene.getTopLayerTop() < this.topThreshold) {
      this.scene.removeTop();
      const nLayer = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, this.scene.getBottomLayerId() + 1);
      this.scene.addBottom(nLayer);
    } else if (this.scene.getBottomLayerBottom() > this.bottomThreshold) {
      if (this.scene.getTopLayerId() <= 0) return;
      this.scene.removeBottom();
      const nLayer = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, this.scene.getTopLayerId() - 1);
      this.scene.addTop(nLayer);
    }
  }
}

Scroll.NSTRIPS_TOTAL = AUTO_SCROLL ? 128 : 64;
Scroll.NSTRIPS_ONSCREEN = AUTO_SCROLL ? 12 : 8;
Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;

export { Scroll };
