import Container from "../../src/core/Container";
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
    for (let i = 0; i < this.checkLevel; i++) {
      if (this.checkLevel === 1) {
        let bullet = new Bullet(this.gl, this.textureBullet);

        this.addChild(bullet);
        bullet.setPosition(this.posX, this.posY);
        this.listBullet.push(bullet);
      }
      else if (this.checkLevel === 2) {
        let bullet = new Bullet(this.gl, this.textureBullet);
        this.addChild(bullet);
        bullet.setPosition(this.posX - 10 + 20 * i, this.posY - 0.1 * i);
        this.listBullet.push(bullet);
      }
    }
    this.listBullet.forEach((bullet) => {
      bullet.updatePosition();
    });
    this.listBullet = [];
  }
}
