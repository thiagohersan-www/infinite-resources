import SimplexNoise from './simplex-noise/simplex-noise.js';
import * as THREE from './three/three.module.js';
import { by_rgb } from './by_rgb.js';
import { by_hls } from './by_hls.js';

const BY_RGB = JSON.parse(by_rgb);
const BY_HLS = JSON.parse(by_hls);

class Strip {
  static getMesh(width, height, yidx) {
    const mLoader = new THREE.TextureLoader();
    const tFilename = `./assets/textures/${BY_RGB[yidx % BY_RGB.length]}.jpg`;

    const mTexture = mLoader.load(tFilename, (texture) => {
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
    });

    const mShape = new THREE.Shape();
    const deltaX = width / Strip.NUM_POINTS_X;
    const spacer = 1;

    mShape.moveTo(0, height);
    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, yidx / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / Strip.DIVERSITY_X, yidx / Strip.DIVERSITY_Y);

      const y = (yidx === 0) ? 0 : height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      mShape.lineTo(x, height + y - spacer);
    }

    for (let i = 0; i <= Strip.NUM_POINTS_X; i++) {
      const x = width - i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / Strip.DIVERSITY_X, (yidx + 1) / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / Strip.DIVERSITY_X, (yidx + 1) / Strip.DIVERSITY_Y);

      const y = height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      mShape.lineTo(x, y + spacer);
    }
    mShape.lineTo(0, height);

    const mMesh = new THREE.Mesh(new THREE.ShapeGeometry(mShape),
      new THREE.MeshBasicMaterial({ map: mTexture })
    );

    mMesh.position.set(0, -yidx * height);

    return mMesh;
  }
}

// Strip.NOISE = new SimplexNoise(new Date());
Strip.NOISE = new SimplexNoise('new Date()');

Strip.NUM_POINTS_X = 256.0;

// amp: 0.6 - (1.0)
// amp(tgh): 0.6
Strip.AMPLITUDE = 1.0;

// x-diversity: 200 - (160)
// x(tgh): 200
Strip.DIVERSITY_X = 160.0;

Strip.DIVERSITY_X_HIGH_FACTOR = 4.0;
Strip.DIVERSITY_X_HIGH_AMP = 0.2;

// y-diversity: 45 - (20)
// y(tgh): 40
Strip.DIVERSITY_Y = 20.0;

Strip.counter = 0;

export { Strip };
