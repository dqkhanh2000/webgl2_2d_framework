import SimpleShader from "./SimpleShader";
import GLUtils from "../helpers/glutils.js";
import TexUtils from "../helpers/texutils.js";
import RobotoFont from "../../assets/fonts/roboto";
import textProgramVert from "./shader/textShader/textProgramVert.vert";
import texProgramFrag from "./shader/textShader/textProgramFrag.frag";

export default class TextureShader extends SimpleShader {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    this.glutils = new GLUtils();
    this.texutils = new TexUtils();

    this.attribs = [
      { loc: 0, name: "pos", size: 2 }, // Vertex position
      { loc: 1, name: "tex0", size: 2 }, // Texture coordinate
      { loc: 2, name: "sdf_size", size: 1 }, // Glyph SDF distance in screen pixels
    ];

    this.glutils.initAttribs(this.gl, this.attribs);

    this.vertexArray = new Float32Array(100000 * 6 * this.attribs[0].stride / 4);

    this.vertexBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    gl.enable(this.gl.BLEND);
    this.init();
    this.loadTexture();
  }

  init() {
    this.prog = this.glutils.createProgram(this.gl, textProgramVert, texProgramFrag, this.attribs);


    // var str_res;     // Result of a writeString function.
    // Contains text bounding rectangle.

    this.vcount = 0; // Text string vertex count
    // var tex;         // Font texture

    this.font_hinting = 1.0;
    this.subpixel = 0.0;

    this.font_color = [0.1, 0.1, 0.1];
    this.bg_color = [0.9, 0.9, 0.9];

    this.canvas_width = this.gl.canvas.width;
    this.canvas_height = this.gl.canvas.height;
    this.pixel_ratio = window.devicePixelRatio || 1;
    // this.loadTexture();

    // this.vertexBuffer = this.gl.createBuffer();
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    // this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexArray, this.gl.DYNAMIC_DRAW);
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    // this.gl.enable(this.gl.BLEND);

    // this.prog = this.glutils.createProgram(this.gl, textProgramVert, texProgramFrag, this.attribs);
  }

  loadTexture() {
    this.robotoFontTexture = this.glutils.loadTexture(this.gl, "/assets/fonts/roboto.png", this.gl.LUMINANCE, false);
  }

  _render() {
    this.font_color = this.glutils.colorFromString("#111111", [0.1, 0.1, 0.1]);

    this.font = RobotoFont;

    this.fontTexture = this.robotoFontTexture;
    this.fontSizeInput = 50;
    this.fontSize = Math.round(this.fontSizeInput * this.pixel_ratio);

    this.fmetrics = this.texutils.fontMetrics(this.font, this.fontSize, this.fontSize * 0.2);

    this.stringResult = this.texutils.writeString("1234567890", this.font, this.fmetrics, [0, 0], this.vertexArray);
    this.vcount = this.stringResult.array_pos / (this.attribs[0].stride / 4);


    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.vertexArray);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    var new_pixel_ratio = window.devicePixelRatio || 1;
    if (this.pixel_ratio != new_pixel_ratio) {
      // do_update = true;
      this.pixel_ratio = new_pixel_ratio;
    }

    var cw = Math.round(this.pixel_ratio * this.canvas_width * 0.5) * 2.0;
    var ch = Math.round(this.pixel_ratio * this.canvas_height * 0.5) * 2.0;

    var dx = Math.round(-0.5 * this.stringResult.rect[2]);
    var dy = Math.round(0.5 * this.stringResult.rect[3]);

    var ws = 2.0 / cw;
    var hs = 2.0 / ch;

    var screen_mat = new Float32Array([
      ws, 0, 0,
      0, hs, 0,
      dx * ws, dy * hs, 1,
    ]);

    this.gl.useProgram(this.prog.id);

    this.prog.font_tex.set(0);
    this.prog.sdf_tex_size.set(this.fontTexture.image.width, this.fontTexture.image.height);
    this.prog.sdf_border_size.set(this.font.iy);
    this.prog.transform.setv(screen_mat);
    this.prog.hint_amount.set(this.font_hinting);

    this.prog.font_color.set(this.font_color[0], this.font_color[1], this.font_color[2], 1.0);

    this.prog.subpixel_amount.set(this.subpixel);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.fontTexture.id);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    this.glutils.bindAttribs(this.gl, this.attribs);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.CONSTANT_COLOR, this.gl.ONE_MINUS_SRC_COLOR);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vcount);

  }
}
