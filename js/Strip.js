import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';

window.msn = new SimplexNoise();

// TODO: noise
// TODO: map yidx -> texture

class Strip {
  constructor(width, height, yidx) {
    this.width = width;
    this.height = height;

    this.shape = new THREE.Shape();
    const mLoader = new THREE.TextureLoader();
    this.texture = mLoader.load('./assets/dolomita.jpg', (texture) => {
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

    this.shape.moveTo(0, 0);
    this.shape.lineTo(this.width, 0);
    this.shape.lineTo(this.width, this.height);
    this.shape.lineTo(0, this.height);
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

  static noise2D = (new SimplexNoise()).noise2D;
}

export { Strip };
