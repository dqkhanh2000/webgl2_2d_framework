import Container from "../src/core/Container";
import { Sprite } from "../src/core/Sprite";
import { TextureCache } from "../src/core/Texture";
import Ticker from "../src/system/ticker";

export default class Background extends Container {
  constructor(speed = 100) {
    super();
    this.speed = speed;
    this._init();
    this.position.x = this.gl.canvas.width / 2;
    this.position.y = this.gl.canvas.height / 2;
    Ticker.SharedTicker.add(this._update, this);
  }

  _init() {
    this.bgTop = this._createBackground("/assets/images/bg_top.png");
    this.bgTop.pivot.y = 1;
    this.bgBottom = this._createBackground("/assets/images/bg_bottom.png");
    this.bgBottom.pivot.y = 1;

    this.bgBottom.position.y = this.bgTop.position.y + this.bgTop.texture.height * this.bgTop.scale.y - 1;

    this.addChild(this.bgTop);
    this.addChild(this.bgBottom);
  }

  _update(dt) {
    this.bgTop.position.y += this.speed * dt;
    this.bgBottom.position.y += this.speed * dt;

    if (this.bgTop.position.y >= this.bgTop.texture.height * this.bgTop.scale.y + this.gl.canvas.height / 2) {
      this.bgTop.position.y = this.bgBottom.position.y - this.bgBottom.texture.height * this.bgBottom.scale.y;
    }

    if (this.bgBottom.position.y >= this.bgBottom.texture.height * this.bgBottom.scale.y + this.gl.canvas.height / 2) {
      this.bgBottom.position.y = this.bgTop.position.y - this.bgTop.texture.height * this.bgTop.scale.y;
    }


  }

  _createBackground(key) {
    const texture = TextureCache.get(key);
    const sprite = new Sprite(this.gl, texture);
    let scaleRatio = this.gl.canvas.width / texture.width;
    sprite.scale.set(scaleRatio, scaleRatio);
    sprite.height = texture.height * scaleRatio;
    return sprite;
  }
}
