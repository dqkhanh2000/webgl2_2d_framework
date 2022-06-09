import { TextureCache } from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";
import Ticker from "./src/system/ticker";
import Engine2D from "./src/core/Engine";
import Particle from "./src/renderers/Particle";
import Loader from "./src/core/Loader";
import Container from "./src/core/Container";
import { Tween } from "./src/core/tween";

export class MyGame {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();
    this.numEnemy = 17;
    this.delaySpawn = true;
    this.load();
    this.particle = new Particle(0, 0.5, 1000, 0.1, 0.5, 1, -Math.PI, Math.PI, 0.5, 1, [0.0, -0.8]);
    this.core.stage.addChild(this.particle);
    Ticker.SharedTicker.add((dt, msdt) => {
      this.core.update();
    });
  }

  load() {
    Loader.addSrc("./dist/images/ship/ship_9.png");
    Loader.addSrc("./dist/images/sad.png");
    Loader.addSrc("./dist/images/redBullet.png");
    Loader.addSrc("./dist/images/enemy/enemy_1.png");
    Loader.addSrc("./dist/images/enemy/bulletEnemy.png");
    Loader.load(this.core.gl, this.playGame, this);
  }

  playGame() {
    this.spawnShip();
    this.spawnEnemy();
    this.initController();
  }

  initController() {
    window.addEventListener("mousemove", (e) => {
      this.ship.transform.position.x = e.pageX;
      this.ship.transform.position.y = e.pageY;
    });

    this.core.core.gl.canvas.addEventListener("click", (e) => {
      this.spawnBullet(e);
    });
  }

  spawnShip() {
    let textureShip = TextureCache.get("./dist/images/ship/ship_9.png");
    this.ship = new Sprite(this.core.gl, textureShip);
    this.ship.transform.position.x = 100;
    this.ship.transform.position.y = 100;
    this.ship.transform.rotation = -Math.PI / 2;

    this.bulletWorld = new Container();
    this.core.stage.addChild(this.bulletWorld);
    this.core.stage.addChild(this.ship);
  }

  spawnEnemy() {
    this.enemyManager = new Container();
    this.listEnemy = [];
    for (let i = 0; i < this.numEnemy; i++) {
      let textureEnemy = TextureCache.get("./dist/images/enemy/enemy_1.png");
      let enemy = new Sprite(this.core.gl, textureEnemy);
      enemy.transform.position.x = enemy.transform.width + enemy.transform.width * i * 2;
      enemy.transform.position.y = 0;
      let posY = 0;
      if (i % 2 !== 0) {
        enemy.transform.position.y = 100;
        posY = 100;
      }
      this.listEnemy.push(enemy);
      this.enemyManager.addChild(enemy);
      Ticker.SharedTicker.add((dt, msdt) => {
        if (enemy.transform.position.y < posY + 100) {
          enemy.transform.position.y += 5;
        }
        if (this.delaySpawn) {
          this.delaySpawn = false;
          setTimeout(() => {
            this.spawnBulletEnemy();
          }, 1000);
        }
        this.core.update();
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
    this.core.stage.addChild(this.enemyManager);

  }

  spawnBulletEnemy() {
    this.delaySpawn = true;
    let textureBulletEnemy = TextureCache.get("./dist/images/enemy/bulletEnemy.png");
    let bulletEnemy = new Sprite(this.core.gl, textureBulletEnemy);
    bulletEnemy.transform.scale.set(0.5, 0.5);
    this.bulletWorld.addChild(bulletEnemy);
    let enemyTaget = this.listEnemy[Math.floor(Math.random() * (this.listEnemy.length - 1))];
    bulletEnemy.transform.position.x = enemyTaget.transform.position.x;
    bulletEnemy.transform.position.y = enemyTaget.transform.position.y;
    Ticker.SharedTicker.add((dt, msdt) => {
      if (!bulletEnemy._destroyed) {
        if (bulletEnemy.transform.position.y > 1000) {
          this.particle.x = bulletEnemy.transform.position.x;
          this.particle.y = bulletEnemy.transform.position.y;
          if (!this.particle.canPlay) {
            // this.particle.play();
          }
          bulletEnemy.destroy();
        }
        else {
          bulletEnemy.transform.position.y += dt * 100;
        }
      }
      this.core.update();
    });
  }

  spawnBullet(e) {
    let txure = TextureCache.get("./dist/images/redBullet.png");
    for (let i = 0; i < this.checkLevel; i++) {
      let sprite = new Sprite(this.core.gl, txure);
      sprite.transform.rotation = -Math.PI / 2;
      this.bulletWorld.addChild(sprite);
      let dy = 1;
      sprite.transform.position.x = e.pageX;
      sprite.transform.position.y = e.pageY;

      Ticker.SharedTicker.add((dt, msdt) => {
        if (!sprite._destroyed) {
          if (sprite.transform.position.y < 10) {
            this.particle.x = sprite.transform.position.x;
            this.particle.y = sprite.transform.position.y;
            if (!this.particle.canPlay) {
            // this.particle.play();
            }
            sprite.destroy();
          }
          else {
            sprite.transform.position.y -= dt * 1000 * dy;
          }
        }
        this.core.update();
      });
    }

  }
}
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
