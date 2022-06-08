import Texture, { TextureCache } from "./Texture";

export default class Loader {

  static textureSrc = [];

  static _countTextureLoaded = 0;

  static addSrc(src) {
    this.textureSrc.push(src);
  }

  static load(gl, cb, context) {
    this.textureSrc.forEach((src) => {
      let texure = new Texture(gl, src);
      texure.once("load", () => {
        this._onTexureLoaded(src, texure, cb, context);
      });
    });
  }

  static _onTexureLoaded(key, texture, cb, context) {
    TextureCache.add(key, texture);
    this._countTextureLoaded++;
    if (this._countTextureLoaded === this.textureSrc.length) {
    //   cb.bind(context);
      cb.call(context);
    }
  }

}
