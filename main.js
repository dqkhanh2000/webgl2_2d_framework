import Color from "./src/math/Color";
import Matrix2d from "./src/math/Matrix2d";
import Texture, { TextureCache } from "./src/core/Texture";
import { Sprite } from "./src/core/Sprite";
import Ticker from "./src/system/ticker";
import Engine2D from "./src/core/Engine";
import Particle from "./src/renderers/Particle";

export class MyGame {
  constructor() {
    let core = new Engine2D();
    core.init("canvas");
    core.resizeCanvasToDisplaySize();
    // let vertexBuffer = new VertexBuffer();
    // vertexBuffer.init(core.gl);

    let texture = Texture.FromURL(core.gl, "dist/images/sad.png");
    texture.once("load", () => {
      let particle = new Particle(texture, core.gl.canvas.width/4, core.gl.canvas.height/4, 100, 0.1, 0.5, 1, Math.PI / 2.0 - 0.5, Math.PI / 2.0 + 0.5, 0.5, 1, [0.0, -0.8]);
      core.stage.addChild(particle);
      particle.play();

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
      sprite.transform.position.x = core.core.gl.canvas.width/ 4;
      sprite.transform.position.y = core.core.gl.canvas.height / 4;
      // sprite.transform.scale.x = 0.2;
      // sprite.transform.scale.y = 0.5;
      core.stage.addChild(sprite);
      let sprite2 = new Sprite(core.gl, texture);
      sprite2.transform.position.x = 30;
      sprite2.transform.position.y = 30;
      sprite.addChild(sprite2);

      let sprite3 = new Sprite(core.gl, texture);
      sprite3.transform.position.x = 30;
      sprite3.transform.position.y = 30;
      sprite2.addChild(sprite3);

      let sprite4 = new Sprite(core.gl, texture);
      sprite4.transform.position.x = 30;
      sprite4.transform.position.y = 30;
      sprite3.addChild(sprite4);

      Ticker.SharedTicker.add((dt, msdt) => {
        sprite2.transform.rotation += 0.05;
        // sprite.position.x += 1;
        // sprite.position.y += 1;
        // particle.x += 1;
        // particle.y += 1;
        // particle.update();
      });

    });

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

      Ticker.SharedTicker.add((dt, msdt) => {
        sprite.transform.rotation += 0.01;
        sprite.transform.position.x += dt * 100 * dx;
        sprite.transform.position.y += dt * 100 * dy;

      });

    };
    core.core.gl.canvas.addEventListener("click", a);

    

    
    Ticker.SharedTicker.add((dt, msdt) => {
      core.update();
      // particle.update();
    });
  }
}

// run new game when document is ready
document.addEventListener("DOMContentLoaded", () => {
  new MyGame();
});
