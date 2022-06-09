import Color from "./src/math/Color";
import Matrix2d from "./src/math/Matrix2d";
import Texture, { TextureCache } from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";
import Ticker from "./src/system/ticker";
import Engine2D from "./src/core/Engine";
import Particle from "./src/renderers/Particle";
import Loader from "./src/core/Loader";
import Container from "./src/core/Container";

export class MyGame {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();
    // let vertexBuffer = new VertexBuffer();
    // vertexBuffer.init(this.core.gl);
    this.numEnemy = 18;
    this.init();


    this.particle = new Particle(0, 0.5, 1000, 0.1, 0.5, 1, -Math.PI, Math.PI, 0.5, 1, [0.0, -0.8]);
    this.core.stage.addChild(this.particle);
    Ticker.SharedTicker.add((dt, msdt) => {

      this.core.update();
    });
  }

  init() {
    Loader.addSrc("./dist/images/ship/ship_9.png");
    Loader.addSrc("./dist/images/sad.png");
    Loader.addSrc("./dist/images/redBullet.png");
    Loader.addSrc("./dist/images/enemy/enemy_1.png");
    Loader.load(this.core.gl, this.playGame, this);
  }

  playGame() {
    let textureShip = TextureCache.get("./dist/images/ship/ship_9.png");
    this.ship = new Sprite(this.core.gl, textureShip);
    this.ship.transform.position.x = 100;
    this.ship.transform.position.y = 100;
    this.ship.transform.rotation = -Math.PI / 2;

    this.bulletWorld = new Container();
    this.core.stage.addChild(this.bulletWorld);
    this.core.stage.addChild(this.ship);

    this.enemyManager = new Container();
    for (let i = 0; i < this.numEnemy; i++) {
      let textureEnemy = TextureCache.get("./dist/images/enemy/enemy_1.png");
      let enemy = new Sprite(this.core.gl, textureEnemy);
      // console.log(this.core.core.gl.canvas.width);
      enemy.transform.position.x = enemy.transform.width + enemy.transform.width *i*2;
      enemy.transform.position.y = 0;
      this.enemyManager.addChild(enemy);
      Ticker.SharedTicker.add((dt, msdt) => {
        if (enemy.transform.position.y < 100) {
          enemy.transform.position.y += 5;
        }
        this.core.update();
      });
    }
    this.core.stage.addChild(this.enemyManager);

    window.addEventListener("mousemove", (e) => {
      this.ship.transform.position.x = e.pageX;
      this.ship.transform.position.y = e.pageY;
    });

    this.core.core.gl.canvas.addEventListener("click", (e) => {
      this.spawnBullet(e);
    });
  }

  spawnBullet(e) {
    let txure = TextureCache.get("./dist/images/redBullet.png");
    let sprite = new Sprite(this.core.gl, txure);
    // sprite.transform.scale.x = 1;
    // sprite.transform.scale.y = 1;
    sprite.transform.rotation = -Math.PI / 2;
    this.bulletWorld.addChild(sprite);
    let dy = 1;
    sprite.transform.position.x = e.pageX;
    sprite.transform.position.y = e.pageY;

    Ticker.SharedTicker.add((dt, msdt) => {
      // sprite.transform.rotation += 0.01;
      // sprite.transform.position.x += dt * 100 * dx;
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
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
