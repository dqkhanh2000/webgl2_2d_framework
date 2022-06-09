import { TextureCache } from "../src/core/Texture";
import Ticker from "../src/system/ticker";
import Engine2D from "../src/core/Engine";
import Loader from "../src/core/Loader";
import { Ship, ShipEvent } from "./Ship/ship";
import { EnemyManager, EnemyManagerEvent } from "./Enemy/enemyManager";
import { BulletEvent, BulletManager } from "./Ship/bulletManager";
import { Sprite } from "../src/core/Sprite";
import { Tween } from "../src/core/tween";
import { GameUI } from "./gameUI";


export class MyGame {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();
    this.numEnemy = 17;
    this.delaySpawn = true;
    this.speed = 70;
    this.delayAttack = true;
    this.checkLevel = 3;
    this.canShoot = false;
    this.load();
    Ticker.SharedTicker.add(() => {
      this.core.update();
    });
  }

  load() {
    for (let i = 1; i <= 16; i++) {
      Loader.addSrc(`./dist/images/ship/ship_${i}.png`);
    }
    Loader.addSrc("./dist/images/sad.png");
    Loader.addSrc("./dist/images/glow.png");
    Loader.addSrc("./dist/images/redBullet.png");
    Loader.addSrc("./dist/images/enemy/enemy_1.png");
    Loader.addSrc("./dist/images/enemy/bulletEnemy.png");
    Loader.addSrc("./dist/images/UI/gameOverLogo.png");
    Loader.addSrc("./dist/images/UI/buttonStart.png");
    Loader.addSrc("./dist/images/UI/buttonNext.png");
    Loader.addSrc("./dist/images/UI/levelComplete.png");
    Loader.addSrc("./dist/images/UI/logo.png");
    Loader.load(this.core.gl, this.initUI, this);
  }

  initUI() {
    this.gameUI = new GameUI(this.core.gl);
    this.core.stage.addChild(this.gameUI);
    this.gameUI.on("loadGame", this.playGame, this);
    this.gameUI.initStartUI();
  }

  playGame() {
    this.spawnShip();
    this.spawnEnemy();
    this.initBulletManager();
    this.initController();
  }

  initController() {
    Ticker.SharedTicker.add((dt) => {
      window.addEventListener("mousemove", (e) => {
        this.ship.updatePosition(e.pageX, e.pageY);
        if (this.delayAttack) {
          setTimeout(() => {
            if (this.canShoot) {
              this.spawnBullet(e);
            }
            this.delayAttack = true;
          }, this.speed);
          this.delayAttack = false;
        }
      });

    });
    // this.core.core.gl.canvas.addEventListener("click", (e) => {

    // });
  }

  spawnShip() {
    this.ship = new Ship(this.core.gl);
    this.ship.on(ShipEvent.TakeDamage, this.ship.takeDamage, this.ship);
    this.core.stage.addChild(this.ship);
    this.ship.on(ShipEvent.OnDead, this.defeat, this);
  }

  spawnEnemy() {
    let textureEnemy = TextureCache.get("./dist/images/enemy/enemy_1.png");
    this.enemyManager = new EnemyManager(this.core.gl, this.numEnemy, textureEnemy, this.ship);
    this.core.stage.addChild(this.enemyManager);
    this.enemyManager.on(EnemyManagerEvent.OnClearEnemy, this.win, this);
    this.enemyManager.on(EnemyManagerEvent.RunTweenDone, () => {
      this.canShoot = true;
    }, this);

  }

  spawnBullet(e) {
    this.bulletManager.updatePosition(e.pageX, e.pageY);
    this.bulletManager.spawnBullet();
  }

  initBulletManager() {
    let shipEnemy = this.enemyManager.getEnemyShip();
    let textureBullet = TextureCache.get("./dist/images/redBullet.png");
    this.bulletManager = new BulletManager(this.core.gl, this.checkLevel, textureBullet, shipEnemy);
    this.core.stage.addChild(this.bulletManager);

    this.bulletManager.on(BulletEvent.RemoveEnemy, this.enemyManager.removeEnemy, this.enemyManager);
  }

  defeat() {
    this.ship.destroy();
    this.enemyManager.destroy();
    this.canShoot = false;
    this.gameUI.initGameOverUI();
    console.log("on lose");
  }

  win() {
    this.ship.destroy();
    this.enemyManager.destroy();
    this.canShoot = false;
    this.gameUI.initWinUI();
    console.log("win");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
