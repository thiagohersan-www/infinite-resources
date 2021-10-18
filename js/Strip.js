import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';

class Strip {
  constructor(width, height, yidx) {
    this.width = width;
    this.height = height;

    this.shape = new THREE.Shape();
    const mLoader = new THREE.TextureLoader();

    // TODO: map yidx -> texture
    const tFilename = `./assets/texture0${(Strip.counter++) % 6}.jpg`;
    this.texture = mLoader.load(tFilename, (texture) => {
      const shape = {
        width: this.width,
        height: ((2 * Strip.AMPLITUDE + 1) * this.height)
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

    const deltaX = this.width / Strip.NUM_POINTS_X;

    this.shape.moveTo(0, 0);
    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, yidx / Strip.DIVERSITY_Y);
      const y = this.height * Strip.AMPLITUDE * y_noise;
      this.shape.lineTo(x, y);
    }

    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = this.width - i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, (yidx + 1) / Strip.DIVERSITY_Y);
      const y = this.height * (1 + Strip.AMPLITUDE * y_noise);
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

Strip.NOISE = new SimplexNoise('seed');
Strip.AMPLITUDE = 1.000005;
Strip.NUM_POINTS_X = 100.0;
Strip.DIVERSITY_X = 160.0;
Strip.DIVERSITY_Y = 10.0;
Strip.counter = 0;

export { Strip };
