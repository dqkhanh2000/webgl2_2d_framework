import Container from "../../src/core/Container";
import { Sprite } from "../../src/core/Sprite";
import Ticker from "../../src/system/ticker";
import { Bullet } from "./bullet";

export class BulletManager extends Container {
  constructor(gl, checkLevel, textureBullet) {
    super();
    this.gl = gl;
    this.textureBullet = textureBullet;
    this.checkLevel = checkLevel;
    this.listBullet = [];
  }

  updatePosition(x, y) {
    this.posX = x;
    this.posY = y;
  }

  spawnBullet() {
    // for (let i = 0; i < this.checkLevel; i++) {
    //   if (this.checkLevel === 1) {
    let bullet = new Bullet(this.gl, this.textureBullet);

    this.addChild(bullet);
    bullet.setPosition(this.posX, this.posY);
    this.listBullet.push(bullet);
    //   }
    //   else if (this.checkLevel === 2) {
    //     let bullet = new Bullet(this.gl, this.textureBullet);
    //     this.addChild(bullet);
    //     bullet.setPosition(this.posX - 10 + 20 * i, this.posY - 10 + 20 * i);
    //     this.listBullet.push(bullet);
    //   }
    // }
    Ticker.SharedTicker.add((dt, msdt) => {
    //   this.listBullet.forEach((bullet) => {
      if (!bullet._destroyed) {
        if (bullet.transform.position.y < 10) {
          bullet.destroy();
        }
        else {
          bullet.transform.position.y -= dt * 1000;
        }
      }
    //   });
    });
  }
}
