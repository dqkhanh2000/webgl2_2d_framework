import Container from "../../src/core/Container";
import Ticker from "../../src/system/ticker";
import Utils from "../Helpers/Utils";
import { Bullet } from "./bullet";

export const BulletEvent = Object.freeze({
  RemoveEnemy: "remove-enemy",
});
export class BulletManager extends Container {
  constructor(gl, checkLevel, textureBullet, enemy) {
    super();
    this.gl = gl;
    this.enemy = enemy;
    this.textureBullet = textureBullet;
    this.checkLevel = checkLevel;
    this.listBullet = [];
    this.bulletChecker = [];

    this.update();
  }

  updatePosition(x, y) {
    this.posX = x;
    this.posY = y;
  }

  removeGo(go, isBullet = true) {
    if (isBullet) {
      let index = this.bulletChecker.indexOf(go);
      if (index >= 0) {
        this.bulletChecker.splice(index, 1);
      }
    }
    else {
      let index = this.enemy.indexOf(go);
      if (index >= 0) {
        this.enemy.splice(index, 1);
        go.destroy();
      }
    }
  }

  spawnBullet() {
    for (let i = 0; i < this.checkLevel; i++) {
      let bullet;
      if (this.checkLevel === 1) {
        bullet = new Bullet(this.gl, this.textureBullet);

        this.addChild(bullet);
        bullet.setPosition(this.posX, this.posY);
        this.listBullet.push(bullet);
      }
      else if (this.checkLevel === 2 || this.checkLevel === 3) {
        bullet = new Bullet(this.gl, this.textureBullet);
        this.addChild(bullet);
        bullet.setPosition(this.posX - 10 + 20 * i, this.posY - 0.1 * i);
        this.listBullet.push(bullet);
      }
      bullet.transform.width = 25;
      bullet.transform.height = 60;
      this.bulletChecker.push(bullet);
    }
    this.listBullet.forEach((bullet) => {
      bullet.updatePosition();
    });
    this.listBullet = [];
  }

  update() {
    Ticker.SharedTicker.add(() => {
      for (let i = 0; i < this.enemy.length; i++) {
        let enemy = this.enemy[i];
        for (let j = 0; j < this.bulletChecker.length; j++) {
          let bullet = this.bulletChecker[j];
          if (Utils.isCollision(enemy, bullet)) {
            this.removeGo(bullet);
            bullet.destroy();
            enemy.takeDamage();
            let health = enemy.getHealth();
            if (health === 0) {
              this.removeGo(enemy, false);
              this.emit(BulletEvent.RemoveEnemy, enemy);
            }
          }
        }
      }
    });
  }
}
