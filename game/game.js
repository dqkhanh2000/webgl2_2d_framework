import { TextureCache } from "../src/core/Texture";
import Ticker from "../src/system/ticker";
import Engine2D from "../src/core/Engine";
import Particle from "../src/core/Particle";
import Loader from "../src/core/Loader";
import { Ship, ShipEvent } from "./Ship/ship";
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
    Ticker.SharedTicker.add(() => {
      this.core.update();
    });
  }

  load() {
    Loader.addSrc("./dist/images/ship/ship_1.png");
    Loader.addSrc("./dist/images/ship/ship_2.png");
    Loader.addSrc("./dist/images/ship/ship_3.png");
    Loader.addSrc("./dist/images/ship/ship_4.png");
    Loader.addSrc("./dist/images/ship/ship_5.png");
    Loader.addSrc("./dist/images/ship/ship_6.png");
    Loader.addSrc("./dist/images/ship/ship_7.png");
    Loader.addSrc("./dist/images/ship/ship_8.png");
    Loader.addSrc("./dist/images/ship/ship_9.png");
    Loader.addSrc("./dist/images/ship/ship_10.png");
    Loader.addSrc("./dist/images/ship/ship_11.png");
    Loader.addSrc("./dist/images/ship/ship_12.png");
    Loader.addSrc("./dist/images/ship/ship_13.png");
    Loader.addSrc("./dist/images/ship/ship_14.png");
    Loader.addSrc("./dist/images/ship/ship_15.png");
    Loader.addSrc("./dist/images/ship/ship_16.png");
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
    this.ship = new Ship(this.core.gl);
    this.ship.on(ShipEvent.TakeDamage, this.ship.takeDamage, this.ship);

    let textureBullet = TextureCache.get("./dist/images/redBullet.png");
    this.bulletManager = new BulletManager(this.core.gl, this.checkLevel, textureBullet);
    this.core.stage.addChild(this.bulletManager);
    this.core.stage.addChild(this.ship);
  }

  spawnEnemy() {
    let textureEnemy = TextureCache.get("./dist/images/enemy/enemy_1.png");
    this.enemyManager = new EnemyManager(this.core.gl, this.numEnemy, textureEnemy, this.ship);
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
