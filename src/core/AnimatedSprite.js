import Ticker from "../system/ticker";
import { Sprite } from "./Sprite";

export class AnimationConfig {
  static default = {
    duration   : 1,
    loop       : false,
    autoPlay   : true,
    onComplete : null,
    onLoop     : null,
  };

  constructor() {
    let defaultConfig = AnimationConfig.default;
    this.duration = defaultConfig.duration;
    this.loop = defaultConfig.loop;
    this.autoPlay = defaultConfig.autoPlay;
    this.onComplete = defaultConfig.onComplete;
    this.onLoop = defaultConfig.onLoop;
  }
}

export class AnimatedSprite extends Sprite {

  /**
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {Array<Texture>} textures - The texture contain image will be renderer.
   * @param {AnimationConfig} config - The animation config.
   * */
  constructor(gl, textures, config = AnimationConfig.default) {
    super(gl, textures[0]);
    this.textures = textures;
    this.config = config;
    this.progress = 0;
    this._curIndex = 0;
    this.isPlaying = this.config.autoPlay;
    this.isCompleted = false;
    this._curTimeCount = 0;
    Ticker.SharedTicker.on("tick", this._update, this);
  }

  play() {
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  reset() {
    this.currentIndex = 0;
    this._curTimeCount = 0;
  }

  _update() {
    if (!this.isPlaying || this.isCompleted) {
      return;
    }

    this._curTimeCount += Ticker.SharedTicker.deltaTime;
    if (this._curTimeCount > this.config.duration) {
      if (this.config.loop) {
        this._curTimeCount = 0;
        this.config.onLoop?.();
      }
      else if (!this.isCompleted) {
        this.isCompleted = true;
        this.config.onComplete?.();
      }
    }

    this.progress = Math.min(this._curTimeCount / this.config.duration, 1);
    this.currentIndex = Math.floor(this.progress * this.textures.length);
  }

  get currentIndex() {
    return this._curIndex || 0;
  }

  set currentIndex(value) {
    this._curIndex = value;
    this.texture = this.textures[this._curIndex];
  }
}
