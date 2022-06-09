import TWEEN from "@tweenjs/tween.js";
import Ticker from "../system/ticker";

export class Tweener extends TWEEN.Tween {
  constructor(object, group) {
    super(object, group);
  }

  start() {
    return super.start(Ticker.SharedTicker.deltaMS);
  }
}
