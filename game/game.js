import { TextureCache } from "../src/core/Texture";
import Ticker from "../src/system/ticker";
import Engine2D from "../src/core/Engine";
import Loader from "../src/core/Loader";
import { Ship, ShipEvent } from "./Ship/ship";
import { EnemyManager, EnemyManagerEvent } from "./Enemy/enemyManager";
import { BulletEvent, BulletManager } from "./Ship/bulletManager";
import { Howl, Howler } from "howler";
import { Sprite } from "../src/core/Sprite";
import { Tween } from "../src/core/tween";
import { GameUI } from "./gameUI";
import Background from "./background";
import Font from "../src/core/Font";
import Text from "../src/core/Text";


export class MyGame {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();
    this.numEnemy = 15;
    this.delaySpawn = true;
    this.speed = 100;
    this.delayAttack = true;
    this.checkLevel = 2;
    this.canShoot = false;
    this.level = 1;
    this.load();
    Ticker.SharedTicker.add(() => {
      this.core.update();
    });
  }

  load() {
    Font.defaultFont(this.core.gl);
    Loader.addAnimationSprite("./dist/images/animation/ship/", 16);
    Loader.addAnimationSprite("./dist/images/animation/boss/", 48);
    Loader.addAnimationSprite("./dist/images/animation/explosion/", 20);
    Loader.addSrc("./dist/images/sad.png");
    Loader.addSrc("./dist/images/glow.png");
    Loader.addSrc("./dist/images/bg_top.png");
    Loader.addSrc("./dist/images/bg_bottom.png");
    Loader.addSrc("./dist/images/redBullet.png");
    Loader.addSrc("./dist/images/heart.png");
    Loader.addSrc("./dist/images/bullet_enemy.png");
    Loader.addSrc("./dist/images/bullet_purple.png");
    Loader.addSrc("./dist/images/enemy/enemy_1.png");
    Loader.addSrc("./dist/images/enemy/bulletEnemy.png");
    Loader.addSrc("./dist/images/UI/gameOverLogo.png");
    Loader.addSrc("./dist/images/UI/buttonStart.png");
    Loader.addSrc("./dist/images/UI/buttonNext.png");
    Loader.addSrc("./dist/images/UI/levelComplete.png");
    Loader.addSrc("./dist/images/UI/logo.png");
    Loader.addSrc("./dist/images/UI/bgWinner.png");
    Loader.load(this.core.gl, this.init, this);
  }

  init() {
    this.initBackground();
    this.initUI();
    this.initFPSWatcher();
  }

  initBackground() {
    this.bg = new Background();
    this.core.stage.addChild(this.bg);
  }

  initUI() {
    this.gameUI = new GameUI(this.core.gl);
    this.core.stage.addChild(this.gameUI);
    this.gameUI.on("loadGame", this.playGame, this);
    this.gameUI.initStartUI();

  }

  initFPSWatcher() {
    this.fpsWatcher = new Text(Font._defaultFont, "fps 0");
    this.fpsWatcher.transform.position.set(40, 70);
    this.fpsWatcher.transform.scale.set(-4, -4);
    this.core.stage.addChild(this.fpsWatcher);
    let lastTime = 0;
    let callTimes = 0;
    this.core.on("update", () => {
      callTimes++;
      let currentTime = performance.now();
      if (currentTime - lastTime > 1000) {
        this.fpsWatcher.text = `fps ${callTimes}`;
        lastTime = currentTime;
        callTimes = 0;
      }
    });
  }

  playGame() {
    this.spawnShip();
    if (this.level === 1) {
      this.spawnEnemy();
    }
    else {
      this.spawnBoss();
    }
    this.initBulletManager();
    this.initController();
    this.playBackgroundMusic();
  }

  playBackgroundMusic() {
    this.music = new Howl({
      src      : ["../assets/audio/music_bg.mp3"],
      loop     : true,
      volume   : 1,
      autoplay : true,
    });
  }

  initController() {

    window.addEventListener("mousemove", (e) => {
      this.ship.updatePosition(e.pageX, e.pageY);
    });
    Ticker.SharedTicker.add((dt) => {
      if (this.delayAttack) {
        setTimeout(() => {
          if (this.canShoot) {
            this.spawnBullet(this.ship.transform.position.x, this.ship.transform.position.y);
            this.sound = new Howl({
              src    : ["../assets/audio/sfx_shoot.wav"],
              volume : 0.5,
            });

            this.sound.play();
          }
          this.delayAttack = true;
        }, this.speed);
        this.delayAttack = false;
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

  spawnBoss() {
    this.enemyManager = new EnemyManager(this.core.gl, this.numEnemy, null, this.ship);
    this.core.stage.addChild(this.enemyManager);
    this.enemyManager.on(EnemyManagerEvent.OnClearEnemy, this.win, this);
    this.enemyManager.on(EnemyManagerEvent.RunTweenDone, () => {
      this.canShoot = true;
    }, this);

  }

  spawnBullet(x, y) {
    this.bulletManager.updatePosition(x, y);
    this.bulletManager.spawnBullet();
  }

  initBulletManager() {
    let shipEnemy = this.enemyManager.getEnemyShip();
    let textureBullet = TextureCache.get("./dist/images/bullet_purple.png");
    this.bulletManager = new BulletManager(this.core.gl, this.checkLevel, textureBullet, shipEnemy);
    this.core.stage.addChild(this.bulletManager);

    this.bulletManager.on(BulletEvent.RemoveEnemy, this.enemyManager.removeEnemy, this.enemyManager);
  }

  defeat() {
    this.music.stop();
    this.ship.destroy();
    this.enemyManager.destroy();
    this.canShoot = false;
    this.gameUI.initGameOverUI();
    console.log("on lose");
  }

  win() {
    this.music.stop();
    this.ship.destroy();
    this.enemyManager.destroy();
    this.canShoot = false;
    this.level = 2;
    this.checkLevel = 3;
    this.gameUI.initWinUI();
    console.log("win");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
