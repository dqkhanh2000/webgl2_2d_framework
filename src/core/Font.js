import Texture from "./Texture";

export default class Font extends Texture {

  static defaultFont(gl) {
    if (!this._defaultFont) {
      this._defaultFont = new Font(gl, {
        letterHeight  : 8,
        spaceWidth    : 8,
        spacing       : -1,
        textureWidth  : 64,
        textureHeight : 40,
        glyphInfos    : {
          a   : { x: 0, y: 0, width: 8 },
          b   : { x: 8, y: 0, width: 8 },
          c   : { x: 16, y: 0, width: 8 },
          d   : { x: 24, y: 0, width: 8 },
          e   : { x: 32, y: 0, width: 8 },
          f   : { x: 40, y: 0, width: 8 },
          g   : { x: 48, y: 0, width: 8 },
          h   : { x: 56, y: 0, width: 8 },
          i   : { x: 0, y: 8, width: 8 },
          j   : { x: 8, y: 8, width: 8 },
          k   : { x: 16, y: 8, width: 8 },
          l   : { x: 24, y: 8, width: 8 },
          m   : { x: 32, y: 8, width: 8 },
          n   : { x: 40, y: 8, width: 8 },
          o   : { x: 48, y: 8, width: 8 },
          p   : { x: 56, y: 8, width: 8 },
          q   : { x: 0, y: 16, width: 8 },
          r   : { x: 8, y: 16, width: 8 },
          s   : { x: 16, y: 16, width: 8 },
          t   : { x: 24, y: 16, width: 8 },
          u   : { x: 32, y: 16, width: 8 },
          v   : { x: 40, y: 16, width: 8 },
          w   : { x: 48, y: 16, width: 8 },
          x   : { x: 56, y: 16, width: 8 },
          y   : { x: 0, y: 24, width: 8 },
          z   : { x: 8, y: 24, width: 8 },
          0   : { x: 16, y: 24, width: 8 },
          1   : { x: 24, y: 24, width: 8 },
          2   : { x: 32, y: 24, width: 8 },
          3   : { x: 40, y: 24, width: 8 },
          4   : { x: 48, y: 24, width: 8 },
          5   : { x: 56, y: 24, width: 8 },
          6   : { x: 0, y: 32, width: 8 },
          7   : { x: 8, y: 32, width: 8 },
          8   : { x: 16, y: 32, width: 8 },
          9   : { x: 24, y: 32, width: 8 },
          "-" : { x: 32, y: 32, width: 8 },
          "*" : { x: 40, y: 32, width: 8 },
          "!" : { x: 48, y: 32, width: 8 },
          "?" : { x: 56, y: 32, width: 8 },
        },
      }, "dist/images/font_default.png");
    }
    return this._defaultFont;
  }

  static _defaultFont = null;

  constructor(gl, info, src) {
    super(gl, src);
    this.info = info;
    this.src = src;
  }

  update() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  }

}
