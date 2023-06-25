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
  }

  update() {
    if (this.scene.getTopLayerTop() < -0.5 * Scroll.NSTRIPS_TOTAL * Scroll.STRIP_HEIGHT) {
      this.scene.removeTop();
      const nLayer = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, this.scene.getBottomLayerId() + 1);
      this.scene.addBottom(nLayer);
    }

    // TODO: take mountain height+margin into account
    if (this.scene.getBottomLayerBottom() > 1.0 * Scroll.NSTRIPS_TOTAL * Scroll.STRIP_HEIGHT) {
      if (this.scene.getTopLayerId() <= 0) return;
      this.scene.removeBottom();
      const nLayer = Strip.getLayer(window.innerWidth, Scroll.STRIP_HEIGHT, this.scene.getTopLayerId() - 1);
      this.scene.addTop(nLayer);
    }
  }
}

Scroll.NSTRIPS_TOTAL = AUTO_SCROLL ? 32 : 32;
Scroll.NSTRIPS_ONSCREEN = AUTO_SCROLL ? 12 : 7;
Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;

export { Scroll };
