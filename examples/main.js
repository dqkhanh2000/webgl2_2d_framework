/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */

import Background from "../game/background";
import { AnimatedSprite } from "../src/core/AnimatedSprite";
import Container from "../src/core/Container";
import Engine2D from "../src/core/Engine";
import Font from "../src/core/Font";
import Loader from "../src/core/Loader";
import Particle from "../src/core/Particle";
import { Sprite } from "../src/core/Sprite";
import Text from "../src/core/Text";
import Texture, { TextureCache } from "../src/core/Texture";
import { Tween } from "../src/core/tween";
import Color from "../src/math/Color";
import Ticker from "../src/system/ticker";

export class Example {
  constructor() {
    this.core = new Engine2D();
    this.core.init("canvas");
    this.core.resizeCanvasToDisplaySize();

    this.load();
    Ticker.SharedTicker.add(() => {
      this.core.update();
    });
  }

  load() {
    Font.defaultFont(this.core.gl);
    Loader.addAnimationSprite("/assets/images/animation/ship/", 16);
    Loader.addAnimationSprite("/assets/images/animation/boss/", 48);
    Loader.addAnimationSprite("/assets/images/animation/explosion/", 20);
    Loader.addSrc("/assets/images/sad.png");
    Loader.addSrc("/assets/images/keyboard.jpeg");
    Loader.addSrc("/assets/images/glow.png");
    Loader.addSrc("/assets/images/bg_top.png");
    Loader.addSrc("/assets/images/bg_bottom.png");
    Loader.addSrc("/assets/images/redBullet.png");
    Loader.addSrc("/assets/images/redBullet.png");
    Loader.addSrc("/assets/images/greengradient.png");
    Loader.addSrc("/assets/images/redgradient.png");
    Loader.addSrc("/assets/images/red.png");
    Loader.addSrc("/assets/images/green.png");
    Loader.addSrc("/assets/images/blue.png");
    Loader.addSrc("/assets/images/sword.png");
    Loader.addSrc("/assets/images/light.png");
    Loader.addSrc("/assets/images/particle.png");
    Loader.addSrc("/assets/images/bullet_enemy.png");
    Loader.addSrc("/assets/images/bullet_purple.png");
    Loader.addSrc("/assets/images/enemy/enemy_1.png");
    Loader.addSrc("/assets/images/enemy/bulletEnemy.png");
    Loader.addSrc("/assets/images/UI/gameOverLogo.png");
    Loader.addSrc("/assets/images/UI/buttonStart.png");
    Loader.addSrc("/assets/images/UI/buttonNext.png");
    Loader.addSrc("/assets/images/UI/levelComplete.png");
    Loader.addSrc("/assets/images/UI/logo.png");
    Loader.addSrc("/assets/images/UI/bgWinner.png");
    Loader.load(this.core.gl, this.init, this);
  }

  init() {
    this.background = new Background();
    this.core.stage.addChild(this.background);

    this.initSprite();
    this.initAnimatedSprite();
    this.blending();
    this.initTransformSprite();

    this.initBlendingSword();

    this.initParticle();


    this.initExampleInfo();
  }

  initParticle() {
    this.particle1 = new Particle(TextureCache.get("/assets/images/particle.png"), {
      x            : 0,
      y            : 0,
      numParticles : 1000,
      birthRate    : 1,
      minLifeRange : 0.2,
      maxLifeRange : 1,
      minTheta     : 0,
      maxTheta     : Math.PI * 2,
      minSpeed     : 0.5,
      maxSpeed     : 1,
      startScale   : 0.1,
      endScale     : 0.05,
      gravity      : [0, 0],
      color        : Color.WHITE,
    });
    this.core.stage.addChild(this.particle1);
    this.particle1.blendType = Texture.BLEND_TYPE.ADDITIVE;
    this.particle1.play();
    this.particle1.x = this._getX(0.5);
    this.particle1.y = this._getY(0.5);

    this.core.core.gl.canvas.onmousemove = (e) => {
      this.particle1.x = e.clientX;
      this.particle1.y = e.clientY;
    };

  }

  initSprite() {
    let sprite = this._createSpriteWithText("/assets/images/keyboard.jpeg", "render sprite", 0.05, 0.159, -70, -50, 5);
    this.core.stage.addChild(sprite);
    sprite.scale.set(0.3, 0.3);
  }

  blending() {
    let normal = this._createGroupColor(0.25, 0.155, Texture.BLEND_TYPE.NORMAL);
    this.core.stage.addChild(normal);
    let textNormal = this._createText("blending NONE", -150, -150, 5);
    normal.addChild(textNormal);

    let additive = this._createGroupColor(0.35, 0.155, Texture.BLEND_TYPE.ADDITIVE);
    this.core.stage.addChild(additive);
    let textAdditive = this._createText("blending additive", -150, -150, 5);
    additive.addChild(textAdditive);
  }

  initTransformSprite() {
    let translateX = this._createSpriteWithText("/assets/images/keyboard.jpeg", "translate x", 0.45, 0.159, 0, -30, 5);
    translateX.scale.set(0.3, 0.3);
    this.core.stage.addChild(translateX);
    Tween.createTween(translateX, { x: this._getX(0.5) }, {
      duration : 1,
      loop     : true,
      yoyo     : true,
    }).start();

    let translateY = this._createSpriteWithText("/assets/images/keyboard.jpeg", "translate y", 0.58, 0.1, -30, -50, 5);
    translateY.scale.set(0.3, 0.3);
    this.core.stage.addChild(translateY);
    Tween.createTween(translateY, { y: this._getY(0.2) }, {
      duration : 1,
      loop     : true,
      yoyo     : true,
    }).start();

    let rotate = this._createSpriteWithText("/assets/images/keyboard.jpeg", "rotation", 0.68, 0.156, 30, -50, 5);
    rotate.scale.set(0.3, 0.3);
    this.core.stage.addChild(rotate);
    Tween.createTween(rotate, { rotation: Math.PI * 2 }, {
      duration : 1,
      loop     : true,
    }).start();

    let scale = this._createSpriteWithText("/assets/images/keyboard.jpeg", "scale", 0.8, 0.156, 70, -50, 5);
    scale.scale.set(0.3, 0.3);
    this.core.stage.addChild(scale);
    Tween.createTween(scale.scale, { x: 0.4, y: 0.4 }, {
      duration : 1,
      loop     : true,
      yoyo     : true,
    }).start();

  }

  initBlendingSword() {
    let textureSword = TextureCache.get("/assets/images/sword.png");
    let sword = new Sprite(this.core.core.gl, textureSword);
    sword.pivot.set(0, 0.5);
    sword.transform.position.x = this._getX(0.2);
    sword.transform.position.y = this._getY(0.8);
    // sword.transform.scale.set(0.5, 0.5);
    this.core.stage.addChild(sword);

    let textureLight = TextureCache.get("/assets/images/light.png");
    let light = new Sprite(this.core.core.gl, textureLight);
    light.transform.scale.set(1.5, 1.5);
    light.blendType = Texture.BLEND_TYPE.ADDITIVE;
    light.y = -7;
    light.x = -400;
    sword.addChild(light);

    let tweenBlending = Tween.createTween(light, { x: 200, y: -25 }, {
      duration : 2,
      loop     : true,
      yoyo     : true,
    });
    tweenBlending.start();
  }

  _createGroupColor(px, py, blendType, scale = 0.3) {
    let group = new Container();
    group.x = this._getX(px);
    group.y = this._getY(py);
    group.scale.set(scale, scale);

    let red = new Sprite(this.core.core.gl, TextureCache.get("/assets/images/red.png"));
    red.blendType = blendType;
    // red.alpha = 0.5;
    group.addChild(red);

    let green = new Sprite(this.core.core.gl, TextureCache.get("/assets/images/green.png"));
    green.x = 100;
    green.blendType = blendType;
    // green.alpha = 0.5;
    group.addChild(green);

    let blue = new Sprite(this.core.core.gl, TextureCache.get("/assets/images/blue.png"));
    blue.blendType = blendType;
    blue.x = 50;
    blue.y = 100;
    // blue.alpha = 0.5;
    group.addChild(blue);

    return group;

  }

  initAnimatedSprite() {
    let textures = [];
    for (let i = 1; i <= 48; i++) {
      textures.push(TextureCache.get(`/assets/images/animation/boss/${i}.png`));
    }
    this.animatedSprite = new AnimatedSprite(this.core.core.gl, textures, { duration: 2, loop: true, autoPlay: true });
    this.core.stage.addChild(this.animatedSprite);
    this.animatedSprite.x = this._getX(0.15);
    this.animatedSprite.y = this._getY(0.2);
    this.animatedSprite.rotation = Math.PI / 2;
    this.animatedSprite.scale.set(0.7, 0.7);

    let text = this._createText("animated sprite", 0, 220, 2);
    text.rotation = -Math.PI / 2;
    text.alpha = 1;
    this.animatedSprite.addChild(text);

  }

  // eslint-disable-next-line max-params
  _createSpriteWithText(src, text, px, py, textX, textY, textScale) {
    let sprite = new Sprite(this.core.core.gl, TextureCache.get(src));
    sprite.x = this._getX(px);
    sprite.y = this._getY(py);
    let textSprite = this._createText(text, textX, textY, textScale);
    sprite.addChild(textSprite);
    return sprite;
  }

  _createText(text = "", x = 0, y = 0, scale = 1) {
    let txt = new Text(Font._defaultFont, text.toLowerCase());
    txt.transform.position.set(x, y);
    txt.transform.scale.set(-scale, -scale);
    return txt;
  }

  initExampleInfo() {
    this.fpsWatcher = this._createText("fps", this._getX(0.85), this._getY(0.88), -2);
    this.fpsWatcher.rotation = Math.PI;
    this.core.stage.addChild(this.fpsWatcher);

    let countParticle = this._createText("particle", this._getX(0.85), this._getY(0.92), -2);
    countParticle.rotation = Math.PI;
    this.core.stage.addChild(countParticle);

    let lastTime = 0;
    let callTimes = 0;
    this.core.on("update", () => {
      countParticle.text = `particle: ${this.particle1.state?.bornParticles || 0}`;
      callTimes++;
      let currentTime = performance.now();
      if (currentTime - lastTime > 1000) {
        this.fpsWatcher.text = `fps ${callTimes}`;
        lastTime = currentTime;
        callTimes = 0;
      }
    });


  }

  _getX(percent) {
    return this.core.core.gl.canvas.width * percent;
  }

  _getY(percent) {
    return this.core.core.gl.canvas.height * percent;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new Example();
});
