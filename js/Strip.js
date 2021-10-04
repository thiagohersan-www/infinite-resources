import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';

window.msn = new SimplexNoise();
const NOISE = new SimplexNoise('seed');
const NUM_POINTS_X = 100;
const DIVERSITY_X = 200;
const DIVERSITY_Y = 500;
const AMPLITUDE = .5;

class Strip {
  constructor(width, height, yidx) {
    this.width = width;
    this.height = height;

    this.shape = new THREE.Shape();
    const mLoader = new THREE.TextureLoader();

    // TODO: map yidx -> texture
    this.texture = mLoader.load('./assets/dolomita.jpg', (texture) => {
      // TODO: deal with cases when imageAspect < shapeAspect
      const shapeAspect = this.width / this.height;
      const imageAspect = texture.image.width / texture.image.height;

      const repeatX = 1 / this.width;
      const repeatY = imageAspect / this.width;
      texture.repeat.set(repeatX, repeatY);

      const offsetX = 0;
      const imageHeightInShapeUnits = this.width / imageAspect;
      const offsetY = repeatY * 0.5 * (imageHeightInShapeUnits - this.height);
      texture.offset.set(offsetX, offsetY);
    });
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });

    const deltaX = this.width / NUM_POINTS_X;

    this.shape.moveTo(0, 0);
    for (let i = 0; i <= NUM_POINTS_X; i++) {
      const x = i * deltaX;
      const y_noise = NOISE.noise2D(x / DIVERSITY_X, yidx / DIVERSITY_Y);
      const y = this.height * AMPLITUDE * y_noise;
      this.shape.lineTo(x, y);
    }

    for (let i = 0; i <= NUM_POINTS_X; i++) {
      const x = this.width - i * deltaX;
      const y_noise = NOISE.noise2D(x / DIVERSITY_X, (yidx + 1) / DIVERSITY_Y);
      const y = this.height + this.height * AMPLITUDE * y_noise;
      this.shape.lineTo(x, y);
    }
    this.shape.lineTo(0, 0);

    this.geometry = new THREE.ShapeGeometry(this.shape);
    this.mesh_ = new THREE.Mesh(this.geometry, this.material);
  }

  set mesh(mesh) {
    this.mesh_ = mesh;
  }
  get mesh() {
    return this.mesh_;
  }

}

export { Strip };
