import textProgramVert from "./shader/textureProgram.vert";
import texProgramFrag from "./shader/textureProgram.frag";
import TextureShader from "./TextureShader";


export default class TextShader extends TextureShader {
  constructor(gl) {
    super(gl);
  }

  init(font) {
    this.font = font;
    this._initShaderProgram(textProgramVert, texProgramFrag);
    this._initShaderAttributes();
  }

  makeVerticesForString(fontInfo, s) {
    var len = s.length;
    var numVertices = len * 6;
    var positions = new Float32Array(numVertices * 2);
    var texcoords = new Float32Array(numVertices * 2);
    var offset = 0;
    var x = 0;
    var maxX = fontInfo.textureWidth;
    var maxY = fontInfo.textureHeight;
    for (var ii = 0; ii < len; ++ii) {
      var letter = s[ii];
      var glyphInfo = fontInfo.glyphInfos[letter];
      if (glyphInfo) {
        var x2 = x + glyphInfo.width;
        var u1 = glyphInfo.x / maxX;
        var v1 = (glyphInfo.y + fontInfo.letterHeight - 1) / maxY;
        var u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX;
        var v2 = glyphInfo.y / maxY;

        // 6 vertices per letter
        positions[offset + 0] = x;
        positions[offset + 1] = 0;
        texcoords[offset + 0] = u1;
        texcoords[offset + 1] = v1;

        positions[offset + 2] = x2;
        positions[offset + 3] = 0;
        texcoords[offset + 2] = u2;
        texcoords[offset + 3] = v1;

        positions[offset + 4] = x;
        positions[offset + 5] = fontInfo.letterHeight;
        texcoords[offset + 4] = u1;
        texcoords[offset + 5] = v2;

        positions[offset + 6] = x;
        positions[offset + 7] = fontInfo.letterHeight;
        texcoords[offset + 6] = u1;
        texcoords[offset + 7] = v2;

        positions[offset + 8] = x2;
        positions[offset + 9] = 0;
        texcoords[offset + 8] = u2;
        texcoords[offset + 9] = v1;

        positions[offset + 10] = x2;
        positions[offset + 11] = fontInfo.letterHeight;
        texcoords[offset + 10] = u2;
        texcoords[offset + 11] = v2;

        x += glyphInfo.width + fontInfo.spacing;
        offset += 12;
      }
      else {
        // we don't have this character so just advance
        x += fontInfo.spaceWidth;
      }
    }

    // return ArrayBufferViews for the portion of the TypedArrays
    // that were actually used.
    return {
      arrays: {
        position : new Float32Array(positions.buffer, 0, offset),
        texcoord : new Float32Array(texcoords.buffer, 0, offset),
      },
      numVertices: offset / 2,
    };
  }

  activateShader(text, alpha) {
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);

    var vertices = this.makeVerticesForString(this.font.info, text);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices.arrays.position, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices.arrays.texcoord, this.gl.DYNAMIC_DRAW);

    this.gl.uniform1f(this.alphaLocation, alpha);

    this.gl.uniform1i(this.textureLocation, 0);
    this.gl.activeTexture(this.gl.TEXTURE0 + 0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.font.texture);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.numVertices);
  }

}
