import Container from "./Container";
import Ticker from "../system/ticker";
import ParticleShader from "../renderers/ParticleShader";

export default class Particle extends Container {

  // eslint-disable-next-line max-params
  constructor(texture, x, y, numParticles, birthRate, minLifeRange, maxLifeRange, minTheta, maxTheta, minSpeed, maxSpeed, gravity) {
    super();
    this.texture = texture;
    this.numParticles = numParticles;
    this.birthRate = birthRate;
    this.minLifeRange = minLifeRange;
    this.maxLifeRange = maxLifeRange;
    this.minTheta = minTheta;
    this.maxTheta = maxTheta;
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;
    this.gravity = gravity;
    this.canPlay = false;
    this._x = x;
    this._y = y;
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
      this.state = {};
      this.state.numParticles = this.numParticles;
      this.state.birthRate = this.birthRate;
      this.state.minAge = this.minLifeRange;
      this.state.maxAge = this.maxLifeRange;
      this.state.minTheta = this.minTheta;
      this.state.maxTheta = this.maxTheta;
      this.state.minSpeed = this.minSpeed;
      this.state.maxSpeed = this.maxSpeed;
      this.state.gravity = this.gravity;
      this.state.origin = [this.particleX, this.particleY];
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
      this.shader.renderParticle(Ticker.SharedTicker.deltaTime, this.state);
    }
  }

  convertPositionToClipSpace() {
    this.particleX = (this.x / this.gl.canvas.width) * 2 - 1;
    this.particleY = -((this.y / this.gl.canvas.height) * 2 - 1);
    if (this.state && this.state.origin) {
      this.state.origin[0] = this.particleX;
      this.state.origin[1] = this.particleY;
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
