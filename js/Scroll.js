import { AUTO_SCROLL } from "./AutoScroll.js";
import { Scene } from "./Scene.js";
import { Strip } from "./Strip.js";

class Scroll {
  static STRIPS_TOTAL = 64;
  static STRIPS_ONSCREEN = (window.innerWidth < window.innerHeight) ? 10 : 8;
  static STRIP_HEIGHT = window.innerHeight / Scroll.STRIPS_ONSCREEN;
  static MAX_NOISE_HEIGHT = Strip.AMPLITUDE * Scroll.STRIP_HEIGHT;
  static BUFFER_LAYERS = Math.ceil((Scroll.STRIPS_TOTAL - Scroll.STRIPS_ONSCREEN) / 2.0);
  static BUFFER_PIXELS = Scroll.BUFFER_LAYERS * Scroll.STRIP_HEIGHT;

  static setup() {
    for (let i = 0; i < Scroll.STRIPS_TOTAL; i++) {
      const nLayer = Strip.makeLayer(Scroll.STRIP_HEIGHT, i);
      Scene.addBottom(nLayer);
    }
    Scene.setLayersMarginTop(Scroll.MAX_NOISE_HEIGHT);
  }

  static update() {
    if (Scene.getTopLayerTop() < -Scroll.BUFFER_PIXELS) {
      Scene.removeTop();
      const nLayer = Strip.makeLayer(Scroll.STRIP_HEIGHT, Scene.getBottomLayerId() + 1);
      Scene.addBottom(nLayer);
    } else if (!AUTO_SCROLL && Scene.getBottomLayerBottom() > Scroll.BUFFER_PIXELS) {
      if (Scene.getTopLayerId() <= 0) return;
      Scene.removeBottom();
      const nLayer = Strip.makeLayer(Scroll.STRIP_HEIGHT, Scene.getTopLayerId() - 1);
      Scene.addTop(nLayer);
    }
  }
}

export { Scroll };
