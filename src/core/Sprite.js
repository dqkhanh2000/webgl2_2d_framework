/* eslint-disable no-unused-vars */
import TextureShader from "../renderers/TextureShader";
import Container from "./Container";
import Texture from "./Texture";

export class Sprite extends Container {

  /**
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {Texture} texture - The texture contain image will be renderer.
   * */
  constructor(gl, texture) {
    super();
    this.texture = texture;
    this.transform.textureMode = true;

    this.transform.width = texture.width;
    this.transform.height = texture.height;

    this.shader = new TextureShader(gl);
    this.shader.transform = this.transform;
    this.shader.init();
  }

  _render(renderer) {
    this.shader.activateShader(this.texture.texture);
  }

  updateTransform() {
    super.updateTransform();
    this.shader.updateTransform(this.transform.worldTransform.array);
  }
}
