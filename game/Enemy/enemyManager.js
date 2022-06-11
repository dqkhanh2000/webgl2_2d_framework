import Container from "../../src/core/Container";
import { Sprite } from "../../src/core/Sprite";
import { TextureCache } from "../../src/core/Texture";
import { Tween } from "../../src/core/tween";
import Ticker from "../../src/system/ticker";
import { Enemy } from "./enemy";
import Utils from "../Helpers/Utils";
import { ShipEvent } from "../Ship/ship";
import { Howl, Howler } from "howler";
import { Boss } from "./boss";
import { Bullet } from "../Ship/bullet";

export const EnemyManagerEvent = Object.freeze({
  OnClearEnemy : "clear-enemy",
  RunTweenDone : "run-tween-done",
});
export class EnemyManager extends Container {
  constructor(gl, numEnemy, textureEnemy, player) {
    super();
    this.gl = gl;
    this.numEnemy = numEnemy;
    this.listEnemy = [];
    this.listBullet = [];
    this.player = player;
    this.delaySpawn = true;
    this.attackSkill = true;
    this.isRunTween = true;
    if (textureEnemy !== null) {
      this.textureEnemy = textureEnemy;
      this.initEnemy();
    }
    else {
      this.initBoss();
    }
    this.update();
  }

  initEnemy() {
    for (let i = 0; i < this.numEnemy; i++) {
      let textureEnemy = this.textureEnemy;
      let enemy = new Enemy(this.gl, textureEnemy);
      enemy.type = "ship";
      let margin = this.gl.canvas.width / (this.numEnemy + 1);
      enemy.setPosition(margin * i + margin / 2, 0);
      let posY = 0;
      if (i % 2 !== 0) {
        enemy.setPosition(margin * i + margin / 2, 100);
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

  initBoss() {
    this.boss = new Boss(this.gl);
    this.boss.type = "ship";
    this.boss.setPosition(this.gl.canvas.width / 2, 0);
    let posY = 0;
    this.listEnemy.push(this.boss);
    this.addChild(this.boss);
    Ticker.SharedTicker.add((dt) => {
      if (this.delaySpawn) {
        this.delaySpawn = false;
        setTimeout(() => {
          this.spawnBulletBoss();
        }, 500);
      }
    });
    Tween.createTween(this.boss, { y: posY + 200 }, {
      duration   : 1,
      onComplete : () => {
        this.isRunTween = false;
        this.emit(EnemyManagerEvent.RunTweenDone, this);
      },
    }).start();
    for (let i = 0; i < this.listEnemy.length; i++) {
      let posX = this.listEnemy[i].transform.position.x + 700;
      let enemy = this.listEnemy[i];
      let tweenMove = Tween.createTween({ x: enemy.position.x - 700 }, { x: posX }, {
        onUpdate: (data) => {
          if (enemy && !this.enemy?._destroyed && enemy.transform) {
            enemy.position.x = data.x;
          }
          else {
            tweenMove.stop();
          }
        },
        duration : 4,
        loop     : true,
        yoyo     : true,
      });
      tweenMove.start();
    }
    let tweenMove2 = Tween.createTween({ y: this.boss.position.y - 100 }, { y: 300 }, {
      onUpdate: (data) => {
        if (this.boss && !this.boss?._destroyed && this.boss.transform) {
          this.boss.position.y = data.y;
        }
        else {
          tweenMove2.stop();
        }
      },
      duration   : 9,
      loop       : true,
      yoyo       : true,
      onComplete : () => {
        this.attackSkill = true;
      },
    });
    tweenMove2.start();
  }

  updatePosition(x, y) {
    this.transform.position.x = x;
    this.transform.position.y = y;
  }

  spawnBulletEnemy() {
    this.delaySpawn = true;
    let textureBulletEnemy = TextureCache.get("/assets/images/enemy/bulletEnemy.png");
    let bulletEnemy = new Bullet(this.gl, textureBulletEnemy);
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
          this.removeEnemy(bulletEnemy, false);
        }
        else {
          bulletEnemy.transform.position.y += dt * 100;
        }
      }
    });
  }

  spawnBulletBoss() {
    let dy = Math.random() * 20;
    let dx = Math.random() * 20;
    this.delaySpawn = true;
    let textureBulletEnemy = TextureCache.get("/assets/images/bullet_enemy.png");
    for (let i = 0; i < 3; i++) {
      let bullet;
      bullet = new Bullet(this.gl, textureBulletEnemy);
      bullet.transform.width = 25;
      bullet.transform.height = 50;
      bullet.type = "bullet";
      this.addChild(bullet);
      bullet.setPosition(this.boss.transform.position.x - 200 + 200 * i, this.boss.transform.position.y - 0.1 * i);
      this.listBullet.push(bullet);
      this.listEnemy.push(bullet);
    }
    this.listBullet.forEach((bullet) => {
      bullet.updatePositionBoss();
    });
    this.listBullet = [];
  }

  removeEnemy(enemy, sound = true) {
    if (!this.isRunTween) {
      let index = this.listEnemy.indexOf(enemy);
      if (index >= 0) {
        this.listEnemy.splice(index, 1);
        if (enemy.type === "ship" && sound) {
          this.playSoundExplode();
        }
        else {
          enemy.onEnemyDead();
          if (sound) {
            this.playSoundExplode();
          }
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
      src    : ["/assets/audio/sfx_enemy_explode.mp3"],
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
