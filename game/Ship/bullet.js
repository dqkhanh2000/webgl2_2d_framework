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
        if (this.transform.position.y < 0) {
          this.destroy();
        }
        else {
          this.transform.position.y -= dt * 1000;
        }
      }
    });
  }

  updatePositionBoss() {
    Ticker.SharedTicker.add((dt, msdt) => {
      if (!this._destroyed) {
        if (this.transform.position.y > 900) {
          this.destroy();
        }
        else {
          this.transform.position.y += dt * 500;
        }
      }
    });
  }
}
