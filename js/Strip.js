import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';
import { by_rgb } from './by_rgb.js';
import { by_hls } from './by_hls.js';

const BY_RGB = JSON.parse(by_rgb);
const BY_HLS = JSON.parse(by_hls);
const BY_COLOR = BY_RGB.concat(BY_HLS);

class Strip {
  static getTopMesh(width, stripHeight, render) {
    const mLoader = new THREE.TextureLoader();
    const tFilename = `./assets/map00.jpg`;

    mLoader.load(tFilename, (texture) => {
      const imageHeight = width * texture.image.height / texture.image.width;

      texture.repeat.set(1 / width, 1 / imageHeight);

      mMesh.material.map = texture;
      mMesh.material.needsUpdate = true;
      if (render) render();
    });

    const mShape = new THREE.Shape();
    mShape.moveTo(0, 2 * width);
    mShape.lineTo(width, 2 * width);
    mShape.lineTo(width, 0);
    mShape.lineTo(0, 0);
    mShape.lineTo(0, 2 * width);

    const mMesh = new THREE.Mesh(new THREE.ShapeGeometry(mShape), new THREE.MeshBasicMaterial());

    mMesh.position.set(0, 0.5 * Strip.AMPLITUDE * stripHeight, -0.005);

    return mMesh;
  }

  static getMesh(width, height, yidx, render) {
    if (yidx === 0) {
      return Strip.getTopMesh(width, height, render);
    }

    yidx = yidx - 1;
    const mLoader = new THREE.TextureLoader();
    const tFilename = `./assets/textures/${BY_COLOR[(yidx + 0) % BY_COLOR.length]}.jpg`;

    mLoader.load(tFilename, (texture) => {
      const shape = {
        width: width,
        height: height + (Strip.AMPLITUDE * height * 2)
      };

      const shapeAspect = shape.width / shape.height;
      const imageAspect = texture.image.width / texture.image.height;

      shape.width = Math.max(shape.width, shape.height * imageAspect);
      shape.height = shape.width / shapeAspect;

      const repeatX = 1 / shape.width;
      const repeatY = imageAspect / shape.width;
      texture.repeat.set(repeatX, repeatY);

      const imageHeightInShapeUnits = shape.width / imageAspect;
      const offsetX = repeatX * 0.5 * (shape.width - width);
      const offsetY = repeatY * 0.5 * (imageHeightInShapeUnits - height);
      texture.offset.set(offsetX, offsetY);

      mMesh.material.map = texture;
      mMesh.material.needsUpdate = true;
      if (render) render();
    });

    const mShape = new THREE.Shape();
    const deltaX = width / Strip.NUM_POINTS_X;

    mShape.moveTo(0, height);
    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, yidx / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / Strip.DIVERSITY_X, yidx / Strip.DIVERSITY_Y);

      const firstLayerDamp = (yidx === 0) ? 0.5 : 1.0;
      const y = firstLayerDamp * height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      mShape.lineTo(x, height + y - Strip.SPACER);
    }

    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = width - i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, (yidx + 1) / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / Strip.DIVERSITY_X, (yidx + 1) / Strip.DIVERSITY_Y);

      const y = height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      mShape.lineTo(x, y + Strip.SPACER);
    }
    mShape.lineTo(0, height);

    const mMesh = new THREE.Mesh(new THREE.ShapeGeometry(mShape), new THREE.MeshBasicMaterial());

    mMesh.position.set(0, -yidx * height);

    return mMesh;
  }
}

// Strip.NOISE = new SimplexNoise(new Date());
Strip.NOISE = new SimplexNoise('infinitum');

Strip.NUM_POINTS_X = 256.0;

// amp: 0.6 - (1.0)
Strip.AMPLITUDE = 0.7;

// x-diversity: 200 - (160)
Strip.DIVERSITY_X = 180.0;

Strip.DIVERSITY_X_HIGH_FACTOR = 4.0;
Strip.DIVERSITY_X_HIGH_AMP = 0.2;

// y-diversity: 45 - (20)
Strip.DIVERSITY_Y = 20.0;

Strip.SPACER = 0;

export { Strip };
