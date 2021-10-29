import { Scroll } from './Scroll.js';
import { Strip } from './Strip.js';
import { clearScene } from './clear.js';

class Gui {
  constructor(threeStuff) {
    this.three = threeStuff;

    document.getElementById('param-num-layer').value = 8;
    document.getElementById('param-amp').value = 1;
    document.getElementById('param-x-scale').value = 160;
    document.getElementById('param-y-scale').value = 10;

    Array.from(document.getElementsByTagName('input')).forEach(el => {
      el.addEventListener('change', this.updateParam);
      el.parentElement.getElementsByClassName('param-value')[0].innerHTML = el.value;
    });
  }

  updateParam = (ev) => {
    const el = ev.target;
    const elId = el.id;

    el.parentElement.getElementsByClassName('param-value')[0].innerHTML = el.value;

    clearScene(this.three.scene);

    if (elId.includes('-amp')) {
      Strip.AMPLITUDE = 1.000005 * el.value;
    } else if (elId.includes('-num-layer')) {
      Scroll.NSTRIPS_ONSCREEN = el.value;
      Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;
    } else if (elId.includes('-x-scale')) {
      Strip.DIVERSITY_X = el.value;
    } else if (elId.includes('-y-scale')) {
      Strip.DIVERSITY_Y = el.value;
    }

    new Scroll(this.three.scene);
    setTimeout(() => this.three.renderer.render(this.three.scene, this.three.camera), 500);
  }
}

export { Gui }
