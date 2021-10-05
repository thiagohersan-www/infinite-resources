import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';

window.msn = new SimplexNoise();
const NOISE = new SimplexNoise('seed');
const NUM_POINTS_X = 100.0;
const DIVERSITY_X = 160.0;
const DIVERSITY_Y = 10.0;
const AMPLITUDE = 1.000005;

class Strip {
  constructor(width, height, yidx) {
    this.width = width;
    this.height = height;

    this.shape = new THREE.Shape();
    const mLoader = new THREE.TextureLoader();

    // TODO: map yidx -> texture
    const tFilename = `./assets/texture0${Math.floor(6 * Math.random())}.jpg`;
    this.texture = mLoader.load(tFilename, (texture) => {
      const shape = {
        width: this.width,
        height: ((2 * AMPLITUDE + 1) * this.height)
      };

      const shapeAspect = shape.width / shape.height;
      const imageAspect = texture.image.width / texture.image.height;

      shape.width = Math.max(shape.width, shape.height * imageAspect);
      shape.height = shape.width / shapeAspect;

      const repeatX = 1 / shape.width;
      const repeatY = imageAspect / shape.width;
      texture.repeat.set(repeatX, repeatY);

      const imageHeightInShapeUnits = shape.width / imageAspect;
      const offsetX = repeatX * 0.5 * (shape.width - this.width);
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
      const y = this.height * (1 + AMPLITUDE * y_noise);
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
