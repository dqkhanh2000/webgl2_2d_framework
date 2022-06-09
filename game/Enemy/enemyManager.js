import Container from "../../src/core/Container";
import { Sprite } from "../../src/core/Sprite";
import { TextureCache } from "../../src/core/Texture";
import { Tween } from "../../src/core/tween";
import Ticker from "../../src/system/ticker";
import { Enemy } from "./enemy";
import Utils from "../Helpers/Utils";
import { ShipEvent } from "../Ship/ship";
export class EnemyManager extends Container {
  constructor(gl, numEnemy, textureEnemy, player) {
    super();
    this.gl = gl;
    this.textureEnemy = textureEnemy;
    this.numEnemy = numEnemy;
    this.listEnemy = [];
    this.player = player;
    this.delaySpawn = true;
    this.initEnemy();
    this.update();
  }

  initEnemy() {
    for (let i = 0; i < this.numEnemy; i++) {
      let textureEnemy = this.textureEnemy;
      let enemy = new Enemy(this.gl, textureEnemy);
      enemy.setPosition(enemy.transform.width + enemy.transform.width * i * 2, 0);
      let posY = 0;
      if (i % 2 !== 0) {
        enemy.setPosition(enemy.transform.width + enemy.transform.width * i * 2, 100);
        posY = 100;
      }
      this.listEnemy.push(enemy);
      this.addChild(enemy);
      Ticker.SharedTicker.add(() => {
        if (enemy.transform.position.y < posY + 100) {
          enemy.updatePosition(5);
        }
        if (this.delaySpawn) {
          this.delaySpawn = false;
          setTimeout(() => {
            this.spawnBulletEnemy();
          }, 1000);
        }
      });
    }

    for (let i = 0; i < this.listEnemy.length; i++) {
      let posX = this.listEnemy[i].transform.position.x + 50;
      if (i % 2 !== 0) {
        posX = this.listEnemy[i].transform.position.x - 50;
      }
      let tweenMove = Tween.createTween(this.listEnemy[i], { x: posX }, {
        duration : 1,
        loop     : true,
        yoyo     : true,
      });
      tweenMove.start();
    }
  }

  updatePosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }

  spawnBulletEnemy() {
    this.delaySpawn = true;
    let textureBulletEnemy = TextureCache.get("./dist/images/enemy/bulletEnemy.png");
    let bulletEnemy = new Sprite(this.gl, textureBulletEnemy);
    bulletEnemy.transform.scale.set(0.5, 0.5);
    this.addChild(bulletEnemy);
    let enemyTaget = this.listEnemy[Math.floor(Math.random() * (this.listEnemy.length - 1))];
    bulletEnemy.transform.position.x = enemyTaget.transform.position.x;
    bulletEnemy.transform.position.y = enemyTaget.transform.position.y;
    Ticker.SharedTicker.add((dt) => {
      if (!bulletEnemy._destroyed) {
        if (bulletEnemy.transform.position.y > 1000) {
          bulletEnemy.destroy();
        }
        else {
          bulletEnemy.transform.position.y += dt * 100;
        }
      }
    });
  }

  update() {
    Ticker.SharedTicker.add(() => {
      for (let i = 0; i < this.listEnemy.length; i++) {
        if (Utils.isCollision(this.player, this.listEnemy[i])) {
          this.player.emit(ShipEvent.TakeDamage);
        }
      }
    });
  }
}
