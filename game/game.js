import { TextureCache } from "../src/core/Texture";
import { Sprite } from "../src/core/Sprite";
import Ticker from "../src/system/ticker";
import Engine2D from "../src/core/Engine";
import Particle from "../src/renderers/Particle";
import Loader from "../src/core/Loader";
import Container from "../src/core/Container";
import { Tween } from "../src/core/tween";
import { Ship } from "./Ship/ship";
import { EnemyManager } from "./Enemy/enemyManager";
import { BulletManager } from "./Ship/bulletManager";

export class MyGame {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();
    this.numEnemy = 17;
    this.delaySpawn = true;
    this.checkLevel = 1;
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
      this.ship.updatePosition(e.pageX, e.pageY);
    });

    this.core.core.gl.canvas.addEventListener("click", (e) => {
      this.spawnBullet(e);
    });
  }

  spawnShip() {
    let textureShip = TextureCache.get("./dist/images/ship/ship_9.png");
    this.ship = new Ship(this.core.gl, textureShip);

    let textureBullet = TextureCache.get("./dist/images/redBullet.png");
    this.bulletManager = new BulletManager(this.core.gl, this.checkLevel, textureBullet);
    this.core.stage.addChild(this.bulletManager);
    this.core.stage.addChild(this.ship);
  }

  spawnEnemy() {
    let textureEnemy = TextureCache.get("./dist/images/enemy/enemy_1.png");
    this.enemyManager = new EnemyManager(this.core.gl, this.numEnemy, textureEnemy);
    this.core.stage.addChild(this.enemyManager);

  }

  spawnBullet(e) {
    this.bulletManager.updatePosition(e.pageX, e.pageY);
    this.bulletManager.spawnBullet();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
