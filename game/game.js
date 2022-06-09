import { TextureCache } from "../src/core/Texture";
import Ticker from "../src/system/ticker";
import Engine2D from "../src/core/Engine";
import Loader from "../src/core/Loader";
import { Ship, ShipEvent } from "./Ship/ship";
import { EnemyManager, EnemyManagerEvent } from "./Enemy/enemyManager";
import { BulletEvent, BulletManager } from "./Ship/bulletManager";
import { Sprite } from "../src/core/Sprite";
import { Tween } from "../src/core/tween";


export class MyGame {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();
    this.numEnemy = 17;
    this.delaySpawn = true;
    this.checkLevel = 3;
    this.canShoot = false;
    this.load();
    Ticker.SharedTicker.add(() => {
      this.core.update();
    });
  }

  load() {
    Loader.addAnimationSprite("./dist/images/animation/ship/", 16);
    Loader.addAnimationSprite("./dist/images/animation/explosion/", 20);
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
    let texturebgUI = TextureCache.get("./dist/images/UI/logo.png");
    let bgUI = new Sprite(this.core.gl, texturebgUI);
    bgUI.transform.position.x = this.core.core.gl.canvas.width / 2;
    bgUI.transform.position.y = this.core.core.gl.canvas.height / 2 - 200;
    bgUI.transform.scale.set(1, 1);
    this.core.stage.addChild(bgUI);

    let textureButtonStart = TextureCache.get("./dist/images/UI/buttonStart.png");
    let buttonStart = new Sprite(this.core.gl, textureButtonStart);
    buttonStart.transform.position.x = this.core.core.gl.canvas.width / 2;
    buttonStart.transform.position.y = this.core.core.gl.canvas.height / 2 + 50;
    buttonStart.transform.scale.set(1.5, 1.5);

    this.core.stage.addChild(buttonStart);
    window.addEventListener("mousedown", (e) => {
      if (!buttonStart._destroyed) {
        if (e.pageX >= buttonStart.transform.position.x - buttonStart.transform.width / 2
        && e.pageX < buttonStart.transform.position.x + buttonStart.transform.width / 2) {
          if (e.pageY >= buttonStart.transform.position.y - buttonStart.transform.height / 2
          && e.pageY < buttonStart.transform.position.y + buttonStart.transform.height / 2) {
            let tweenRotate = Tween.createTween({ x: 1.5 }, { x: 1 }, {
              duration : 0.2,
              yoyo     : true,
              repeat   : 1,
              onUpdate : (data) => {
                buttonStart.transform.scale.set(data.x, data.x);
              },
              onComplete: () => {
                this.playGame();
                bgUI.destroy();
                buttonStart.destroy();
              },
            }).start();
          }
        }
      }
    });
  }

  playGame() {
    this.spawnShip();
    this.spawnEnemy();
    this.initBulletManager();
    this.initController();
  }

  initController() {
    window.addEventListener("mousemove", (e) => {
      this.ship.updatePosition(e.pageX, e.pageY);
    });

    this.core.core.gl.canvas.addEventListener("click", (e) => {
      if (this.canShoot) {
        this.spawnBullet(e);
      }
    });
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
    console.log("on lose");
  }

  win() {
    console.log("win");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
