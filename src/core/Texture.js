import { EventEmitter } from "eventemitter3";

export default class Texture extends EventEmitter {

  /**
      * @param {WebGL2RenderingContext} gl - The WebGL context.
      * @param {string} src - The source of the texture.
      */
  constructor(gl, src) {
    super();
    this.gl = gl;
    this.src = src;
    this.width = 1;
    this.height = 1;
    this.texture = gl.createTexture();
    this.texture.image = new Image();
    this.texture.image.onload = this._handleLoad.bind(this);
    this.texture.image.src = src;
  }

  /**
   * Handle the load event of the image.
   * @private
   */
  _handleLoad() {
    this.update();
    this.emit("load");
  }

  /**
   * Update the texture.
   * @returns {void}
   */
  update() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.width = this.texture.image.width;
    this.height = this.texture.image.height;
  }

  static FromURL(gl, url) {
    let texture = new Texture(gl, url);
    TextureCache.add(url, texture);
    return texture;
  }

  static BLEND_TYPE = {
    NORMAL   : 0,
    ADDITIVE : 1,
    MULTIPLY : 2,
  };

}

export class TextureCache {

  static textures = {};

  /**
     * Get a texture from the cache.
     * @param {string} key - The source of the texture.
     * @returns {Texture} - The texture.
     */
  static get(key) {
    if (this.textures[key]) {
      return this.textures[key];
    }
    return null;
  }

  /**
   * Add a texture to the cache.
   * @param {string} key - The source of the texture.
   * @param {Texture} texture - The texture.
   * @returns {void}
   */
  static add(key, texture) {
    if (!this.textures[key]) {
      this.textures[key] = texture;
    }
    else {
      console.warn("Texture already exists in cache.");
    }
  }

  /**
   * Remove a texture from the cache.
   * @param {string} key - The source of the texture.
   * @returns {void}
   */
  static remove(key) {
    if (this.textures[key]) {
      delete this.textures[key];
    }
    else {
      console.warn("Texture does not exist in cache.");
    }
  }

  /**
   * Clear the cache.
   * @returns {void}
   */
  static clear() {
    this.textures = {};
  }
}
