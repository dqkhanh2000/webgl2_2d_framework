import { Sprite } from "../../src/core/Sprite";
import Ticker from "../../src/system/ticker";

export class Bullet extends Sprite {
  constructor(gl, textureBullet) {
    super(gl, textureBullet);
    this.gl = gl;
    this.textureBullet = textureBullet;
    this.transform.rotation = -Math.PI / 2;
  }

  setPosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }

  updatePosition() {
    Ticker.SharedTicker.add((dt, msdt) => {
      if (!this._destroyed) {
        this.transform.position.y -= dt * 1000;
      }
    });
  }
}
