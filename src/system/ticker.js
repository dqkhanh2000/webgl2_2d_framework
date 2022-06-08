import EventEmitter from "eventemitter3";

/**
 * @class Ticker
 * @extends EventEmitter
 *
 * @property {number} deltaTime- The time elapsed since the last tick.
 * @property {number} deltaMS- The time elapsed since the last tick in milliseconds.
 * @property {number} elapsedMS - The number of milliseconds that have elapsed since the game was started.
 * @property {number} _maxElapsedMS - The maximum time to be elapsed in a tick.
 * @property {number} _minElapsedMS - The minimum time to be elapsed in a tick.
 * @property {number} lastTime - The time elapsed in the previous tick.
 * @property {boolean} started - Has this ticker started running?
 * @property {boolean} paused - Is this ticker paused?
 * @property {number} maxFPS - The maximum of frames per second.
 * @property {number} minFPS - The minimum of frames per second.
 * @property {number} timeScale - A global time scale factor.
 * @property {number} _lastFrame  - The time of the last frame.
 *
 * @example
 * const ticker = new Ticker();
 * ticker.add(() => {
 *    console.log("tick");
 * });
 * ticker.start();
 */
export default class Ticker extends EventEmitter {

  /**
     * @param {Object} options Ticker config options
     * @param {boolean} [options.autoStart=false] - Whether or not this ticker should start automatically.
     */
  constructor(options) {
    super();
    this.deltaTime = 0;
    this.deltaMS = 1;
    this.elapsedMS = 0;
    this.lastTime = 0;
    this.timeScale = 1;
    this.started = false;
    this.paused = false;
    this.autoStart = options.autoStart || false;

    if (this.autoStart) {
      this.start();
    }
  }

  start() {
    this.emit("start");
    this.lastTime = performance.now();
    this.started = true;
    requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    this.emit("stop");
    this.started = false;
  }

  update() {
    if (!this.started || this.paused || this.timeScale === 0) {
      return;
    }

    const currentTime = performance.now();
    if (currentTime > this.lastTime) {
      this.elapsedMS = currentTime - this.lastTime;

      if (this.elapsedMS > this._maxElapsedMS) {
        this.elapsedMS = this._maxElapsedMS;
      }
      if (this.timeScale !== 1) {
        this.elapsedMS *= this.timeScale;
      }

      if (this._minElapsedMS) {
        const delta = this.currentTime - this._lastFrame | 0;
        if (delta < this._minElapsedMS) {
          return;
        }
        this._lastFrame = this.currentTime - (delta % this._minElapsedMS);
      }

      this.deltaMS = this.elapsedMS;
      this.deltaTime = this.elapsedMS / 1000;
      this.emit("tick", this.deltaTime, this.deltaMS);

    }
    else {
      this.elapsedMS = 0;
      this.deltaMS = 0;
    }
    this.lastTime = currentTime;
    requestAnimationFrame(this.update.bind(this));
  }

  /**
     * Pause the ticker and all of its children.
     * @return {Ticker} This instance.
     * @fires Ticker#pause
     */
  pause() {
    this.paused = true;
    this.emit("pause");
    return this;
  }

  /**
     * Resume the ticker and all of its children.
     * @return {Ticker} This instance.
     * @fires Ticker#resume
     * @example
     * ticker.pause();
     */
  resume() {
    this.paused = false;
    this.emit("resume");
    return this;
  }

  /**
     * Add a callback to the ticker.
     * @param {Function} callback - The callback to add.
     * @param {any} [context] - The context in which to call the callback.
     * @return {Ticker} This instance.
     * @example
     * ticker.add(() => {
     *   console.log("tick");
     * });
     */
  add(callback, context) {
    this.on("tick", callback, context);
    return this;
  }

  get FPS() {
    return Math.round(1000 / this.elapsedMS);
  }

  get minFPS() {
    return Math.round(1000 / this._maxElapsedMS);
  }

  set minFPS(value) {
    const minFPS = Math.min(this.maxFPS, value);
    this._maxElapsedMS = 1000 / minFPS;
  }

  get maxFPS() {
    return Math.round(1000 / this._minElapsedMS);
  }

  set maxFPS(value) {
    if (value === 0) {
      this._minElapsedMS = 0;
    }
    else {
      this._minElapsedMS = 1000 / value;
    }
  }

  static SharedTicker = new Ticker({ autoStart: true });


}
