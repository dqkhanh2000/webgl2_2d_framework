import Container from "./Container";
import Ticker from "../system/ticker";
import ParticleShader from "../renderers/ParticleShader";
import Color from "../math/Color";
import Texture from "./Texture";

export class ParticleConfig {
  static default = {
    x            : 0,
    y            : 0,
    numParticles : 11,
    birthRate    : 1,
    minLifeRange : 0.5,
    maxLifeRange : 0.5,
    minTheta     : 0,
    maxTheta     : 0,
    minSpeed     : 0,
    maxSpeed     : 0,
    startScale   : 1,
    endScale     : 0,
    gravity      : [0, 1],
    color        : Color.WHITE,
  };

  constructor() {
    let defaultConfig = ParticleConfig.default;
    this.x = defaultConfig.x;
    this.y = defaultConfig.y;
    this.numParticles = defaultConfig.numParticles;
    this.birthRate = defaultConfig.birthRate;
    this.minLifeRange = defaultConfig.minLifeRange;
    this.maxLifeRange = defaultConfig.maxLifeRange;
    this.minTheta = defaultConfig.minTheta;
    this.maxTheta = defaultConfig.maxTheta;
    this.minSpeed = defaultConfig.minSpeed;
    this.maxSpeed = defaultConfig.maxSpeed;
    this.startScale = defaultConfig.startScale;
    this.endScale = defaultConfig.endScale;
    this.gravity = defaultConfig.gravity;
    this.color = defaultConfig.color;
  }
}
export default class Particle extends Container {

  // eslint-disable-next-line max-params
  constructor(texture, config = ParticleConfig.default) {
    super();
    this.texture = texture;
    this.config = config;
    this.canPlay = false;
    this.blendType = Texture.BLEND_TYPE.NORMAL;
  }

  _initBeforeFirstRender() {
    if (this.gl !== null) {
      if (this.maxLifeRange < this.minLifeRange) {
        throw "Invalid min-max age range.";
      }
      if (this.maxTheta < this.minTheta
              || this.minTheta < -Math.PI
              || this.maxTheta > Math.PI) {
        throw "Invalid theta range.";
      }
      if (this.minSpeed > this.maxSpeed) {
        throw "Invalid min-max speed range.";
      }
      this.convertPositionToClipSpace();
      this.state = this.config;
      this.state.pause = false;

      this.state.bornParticles = 0;
      this.state.read = 0;
      this.state.write = 1;
      this.state.oldTimestamp = 0.0;
      this.state.totalTime = 0.0;

      this.shader = new ParticleShader(this.gl);
      this.shader.texture = this.texture;
      this.shader.init(this.state);
    }
    else {
      document.write("WebGL2 is not supported by your browser");
    }
  }

  play() {
    this.canPlay = true;
    if (this.state) {
      this.state.pause = false;
    }
  }

  _render() {
    if (this.canPlay) {
      this.shader.renderParticle(Ticker.SharedTicker.deltaTime, this.state, this.blendType);
    }
  }

  convertPositionToClipSpace() {
    this.particleX = (this.x / this.gl.canvas.width) * 2 - 1;
    this.particleY = -((this.y / this.gl.canvas.height) * 2 - 1);
    if (this.state) {
      this.state.x = this.particleX;
      this.state.y = this.particleY;
    }
  }

  pause() {
    this.state.pause = true;
  }

  stop() {
    this.canPlay = false;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    if (this._x !== value) {
      this._x = value;
      this.convertPositionToClipSpace();
    }
  }

  get y() {
    return this._y;
  }

  set y(value) {
    if (this._y !== value) {
      this._y = value;
      this.convertPositionToClipSpace();
    }
  }


}
