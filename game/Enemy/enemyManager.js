import Container from "../../src/core/Container";
import { Sprite } from "../../src/core/Sprite";
import { TextureCache } from "../../src/core/Texture";
import { Tween } from "../../src/core/tween";
import Ticker from "../../src/system/ticker";
import { Enemy } from "./enemy";
import Utils from "../Helpers/Utils";
import { ShipEvent } from "../Ship/ship";
import { Howl, Howler } from "howler";

export const EnemyManagerEvent = Object.freeze({
  OnClearEnemy : "clear-enemy",
  RunTweenDone : "run-tween-done",
});
export class EnemyManager extends Container {
  constructor(gl, numEnemy, textureEnemy, player) {
    super();
    this.gl = gl;
    this.textureEnemy = textureEnemy;
    this.numEnemy = numEnemy;
    this.listEnemy = [];
    this.player = player;
    this.delaySpawn = true;
    this.isRunTween = true;
    this.initEnemy();
    this.update();
  }

  initEnemy() {
    for (let i = 0; i < this.numEnemy; i++) {
      let textureEnemy = this.textureEnemy;
      let enemy = new Enemy(this.gl, textureEnemy);
      enemy.type = "ship";
      enemy.setPosition(enemy.transform.width + enemy.transform.width * i * 2, 0);
      let posY = 0;
      if (i % 2 !== 0) {
        enemy.setPosition(enemy.transform.width + enemy.transform.width * i * 2, 100);
        posY = 100;
      }
      this.listEnemy.push(enemy);
      this.addChild(enemy);

      Tween.createTween(enemy, { y: posY + 100 }, {
        duration   : 1,
        onComplete : () => {
          this.isRunTween = false;
          this.emit(EnemyManagerEvent.RunTweenDone, this);
        },
      }).start();
    }

    for (let i = 0; i < this.listEnemy.length; i++) {
      let posX = this.listEnemy[i].transform.position.x + 50;
      if (i % 2 !== 0) {
        posX = this.listEnemy[i].transform.position.x - 50;
      }
      let enemy = this.listEnemy[i];
      let tweenMove = Tween.createTween({ x: enemy.position.x }, { x: posX }, {
        onUpdate: (data) => {
          if (enemy && !this.enemy?._destroyed && enemy.transform) {
            enemy.position.x = data.x;
          }
          else {
            tweenMove.stop();
          }
        },
        duration : 1,
        loop     : true,
        yoyo     : true,
      });
      tweenMove.start();
    }
    Ticker.SharedTicker.add((dt) => {
      if (this.delaySpawn) {
        this.delaySpawn = false;
        setTimeout(() => {
          this.spawnBulletEnemy();
        }, 1000);
      }
    });
  }

  updatePosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }

  spawnBulletEnemy() {
    this.delaySpawn = true;
    let textureBulletEnemy = TextureCache.get("./dist/images/enemy/bulletEnemy.png");
    let bulletEnemy = new Sprite(this.gl, textureBulletEnemy);
    bulletEnemy.type = "bullet";
    bulletEnemy.transform.scale.set(0.5, 0.5);
    this.listEnemy.push(bulletEnemy);
    this.addChild(bulletEnemy);
    let enemyTaget = this.listEnemy[Math.floor(Math.random() * (this.listEnemy.length - 1))];
    bulletEnemy.transform.position.x = enemyTaget.transform.position.x;
    bulletEnemy.transform.position.y = enemyTaget.transform.position.y;
    Ticker.SharedTicker.add((dt) => {
      if (!bulletEnemy._destroyed) {
        if (bulletEnemy.transform.position.y > 1000) {
          this.removeEnemy(bulletEnemy);
        }
        else {
          bulletEnemy.transform.position.y += dt * 100;
        }
      }
    });
  }

  removeEnemy(enemy) {
    if (!this.isRunTween) {
      this.removeChild(enemy);
      let index = this.listEnemy.indexOf(enemy);
      if (index >= 0) {
        this.listEnemy.splice(index, 1);
        enemy.destroy();
        if (enemy.type === "ship") {
          this.playSoundExplode();
        }
      }
    }
    let shipList = this.getEnemyShip();
    if (shipList.length === 0) {
      this.emit(EnemyManagerEvent.OnClearEnemy, this);
    }
  }

  playSoundExplode() {
    var sound = new Howl({
      src    : ["../../assets/audio/sfx_enemy_explode.mp3"],
      volume : 0.5,
    });

    sound.play();
  }

  getEnemyShip() {
    let result = [];
    for (let i = 0; i < this.listEnemy.length; i++) {
      var enemy = this.listEnemy[i];
      if (enemy.type === "ship") {
        result.push(enemy);
      }
    }
    return result;
  }

  update() {
    Ticker.SharedTicker.add(() => {
      for (let i = 0; i < this.listEnemy.length; i++) {
        let enemy = this.listEnemy[i];
        if (Utils.isCollision(this.player, enemy)) {
          this.player.emit(ShipEvent.TakeDamage);
          if (enemy.type === "bullet") {
            this.removeEnemy(enemy);
          }
        }
      }
    });
  }
}
