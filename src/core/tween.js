import TWEEN from "@tweenjs/tween.js";
import Ticker from "../system/ticker";
import { Tweener } from "./tweener";

export class Tween {
  static defaultConfig = Object.freeze({
    duration    : 1,
    easing      : TWEEN.Easing.Linear.None,
    loop        : false,
    yoyo        : false,
    delay       : 0,
    repeatDelay : 0,
    repeat      : 0,
    onStart     : () => { },
    onRepeat    : () => { },
    onStop      : () => { },
    onUpdate    : () => { },
    onComplete  : () => { },
  });

  /**
   * @param {PIXI.Application} app
   */
  static init() {
    Ticker.SharedTicker.add(this.update, this);
  }

  static update() {
    TWEEN.update();
  }

  static createTween(target, dest = {}, config = Tween.defaultConfig) {
    let tweenConfig = this._setupConfig(config);
    let tween = new Tweener(target);
    tween.to(dest, tweenConfig.duration * 1000);
    this._setupTween(tween, tweenConfig);
    return tween;
  }

  static _setupConfig(config) {
    return Tween.copyObject(config, Tween.copyObject(Tween.defaultConfig));
  }

  static copyObject(src, dst = {}) {
    Object.keys(src).forEach((key) => {
      dst[key] = src[key];
    });
    return dst;
  }

  static _setupTween(tween, config) {
    tween.delay(config.delay * 1000);
    tween.repeatDelay(config.repeatDelay * 1000);
    if (config.loop) {
      tween.repeat(Infinity);
    }
    else {
      tween.repeat(config.repeat);
    }
    tween.yoyo(config.yoyo);
    tween.easing(config.easing);
    tween.onStart(config.onStart);
    tween.onRepeat(config.onRepeat);
    tween.onStop(config.onStop);
    tween.onUpdate(config.onUpdate);
    tween.onComplete(config.onComplete);
  }

  static get Easing() {
    return TWEEN.Easing;
  }
}
