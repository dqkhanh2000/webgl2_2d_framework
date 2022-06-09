import Container from "../src/core/Container";
import { Sprite } from "../src/core/Sprite";
import { TextureCache } from "../src/core/Texture";
import { Tween } from "../src/core/tween";

export class GameUI extends Container {
  constructor(gl) {
    super(gl);
    this.gl = gl;
  }

  initStartUI() {
    let texturebgUI = TextureCache.get("./dist/images/UI/logo.png");
    let bgUI = new Sprite(this.gl, texturebgUI);
    bgUI.transform.position.x = this.gl.canvas.width / 2;
    bgUI.transform.position.y = this.gl.canvas.height / 2 - 200;
    bgUI.transform.scale.set(1, 1);
    this.addChild(bgUI);

    let textureButtonStart = TextureCache.get("./dist/images/UI/buttonStart.png");
    let buttonStart = new Sprite(this.gl, textureButtonStart);
    buttonStart.transform.position.x = this.gl.canvas.width / 2;
    buttonStart.transform.position.y = this.gl.canvas.height / 2 + 50;
    buttonStart.transform.scale.set(1.5, 1.5);

    this.addChild(buttonStart);
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
                this.emit("loadGame");
                bgUI.destroy();
                buttonStart.destroy();
              },
            }).start();
          }
        }
      }
    });
  }

  initGameOverUI() {
    let texturebgUI = TextureCache.get("./dist/images/UI/gameOverLogo.png");
    let bgUI = new Sprite(this.gl, texturebgUI);
    bgUI.transform.position.x = this.gl.canvas.width / 2;
    bgUI.transform.position.y = this.gl.canvas.height / 2;
    bgUI.transform.scale.set(1, 1);
    this.addChild(bgUI);
  }

  initWinUI() {
    let texturebgUI = TextureCache.get("./dist/images/UI/levelComplete.png");
    let bgUI = new Sprite(this.gl, texturebgUI);
    bgUI.transform.position.x = this.gl.canvas.width / 2;
    bgUI.transform.position.y = this.gl.canvas.height / 2 - 100;
    bgUI.transform.scale.set(2, 2);
    this.addChild(bgUI);

    let textureButtonStart = TextureCache.get("./dist/images/UI/buttonNext.png");
    let buttonStart = new Sprite(this.gl, textureButtonStart);
    buttonStart.transform.position.x = this.gl.canvas.width / 2;
    buttonStart.transform.position.y = this.gl.canvas.height / 2 + 80;
    buttonStart.transform.scale.set(1.5, 1.5);

    this.addChild(buttonStart);
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
                this.emit("loadGame");
                bgUI.destroy();
                buttonStart.destroy();
              },
            }).start();
          }
        }
      }
    });
  }
}
