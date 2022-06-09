/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */
import Color from "./src/math/Color";
import Matrix2d from "./src/math/Matrix2d";
import Texture, { TextureCache } from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";
import Ticker from "./src/system/ticker";
import Engine2D from "./src/core/Engine";
import Particle from "./src/core/Particle";
import { AnimatedSprite } from "./src/core/AnimatedSprite";
import Font from "./src/core/Font";
import Text from "./src/core/Text";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.resizeCanvasToDisplaySize();

    let texture = Texture.FromURL(core.gl, "dist/images/sad.png");
    texture.once("load", () => {
      // eslint-disable-next-line max-len
      let particle = new Particle(texture, core.gl.canvas.width / 4, core.gl.canvas.height / 4, 100, 0.1, 0.5, 1, Math.PI / 2.0 - 0.5, Math.PI / 2.0 + 0.5, 0.5, 1, [0.0, -0.8]);
      // core.stage.addChild(particle);
      // particle.play();

      core.core.gl.canvas.onmousemove = function(e) {
        particle.x = e.clientX;
        particle.y = e.clientY;
      };

      core.core.gl.canvas.onmousedown = function(e) {
        particle.play();
      };

      core.core.gl.canvas.onmouseup = function(e) {
        particle.stop();
      };

      let sprite = new Sprite(core.gl, texture);
      sprite.transform.position.x = core.core.gl.canvas.width / 4;
      sprite.transform.position.y = core.core.gl.canvas.height / 4;
      core.stage.addChild(sprite);
      let sprite2 = new Sprite(core.gl, texture);
      sprite2.transform.position.x = 30;
      sprite2.transform.position.y = 30;
      sprite.addChild(sprite2);

    this.particle = new Particle(0, 0.5, 1000, 0.1, 0.5, 1, -Math.PI, Math.PI, 0.5, 1, [0.0, -0.8]);
    this.core.stage.addChild(this.particle);
    Ticker.SharedTicker.add((dt, msdt) => {

      this.core.update();
    });
  }

      Ticker.SharedTicker.add((dt, msdt) => {
        sprite2.transform.rotation += 0.05;
      });

  playGame() {
    let textureShip = TextureCache.get("./dist/images/ship/ship_9.png");
    this.ship = new Sprite(this.core.gl, textureShip);
    this.ship.transform.position.x = 100;
    this.ship.transform.position.y = 100;
    this.ship.transform.rotation = -Math.PI / 2;

    Font.defaultFont(core.gl).once("load", () => {
      let font = Font.defaultFont(core.gl);
      let text = new Text(font, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toLowerCase());
      text.transform.position.x = core.core.gl.canvas.width / 2;
      text.transform.position.y = core.core.gl.canvas.height / 2;
      text.transform.pivot.x = 0.5;
      text.transform.pivot.y = 0.5;
      text.transform.rotation = Math.PI;
      text.scale.set(2, 2);
      core.stage.addChild(text);
      Ticker.SharedTicker.add(() => {
        text.transform.rotation += 0.01;
      });
    });
  }

    let a = () => {
      let txure = TextureCache.get("dist/images/sad.png");
      let sprite = new Sprite(core.gl, txure);
      sprite.transform.position.x = 0;
      sprite.transform.position.y = 0;
      sprite.transform.scale.x = 0.5;
      sprite.transform.scale.y = 0.5;
      core.stage.addChild(sprite);
      let dx = Math.random();
      let dy = Math.random();


    this.enemyManager = new Container();
    for (let i = 0; i < this.numEnemy; i++) {
      let textureEnemy = TextureCache.get("./dist/images/enemy/enemy_1.png");
      let enemy = new Sprite(this.core.gl, textureEnemy);
      // console.log(this.core.core.gl.canvas.width);
      enemy.transform.position.x = enemy.transform.width + enemy.transform.width *i*2;
      enemy.transform.position.y = 0;
      this.enemyManager.addChild(enemy);
      Ticker.SharedTicker.add((dt, msdt) => {
        sprite.transform.rotation += 0.01;
        sprite.transform.position.x += dt * 100 * dx;
        sprite.transform.position.y += dt * 100 * dy;

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

    };


    core.core.gl.canvas.addEventListener("click", a);


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

    // let anim = new AnimatedSprite()
    let loadedTex = 0;
    let textures = [];
    for (let i = 1; i <= 6; i++) {
      let tex = Texture.FromURL(core.gl, `dist/images/coin_${i}.png`);
      textures.push(tex);
      tex.once("load", () => {
        loadedTex++;
        if (loadedTex === 6) {
          let anim = new AnimatedSprite(core.gl, textures, { duration: 0.5, loop: true, autoPlay: true });
          core.stage.addChild(anim);
          anim.position.x = 300;
          anim.position.y = 150;
        }
      });
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
