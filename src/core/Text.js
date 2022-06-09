import Container from "./Container";
import TextShader from "../renderers/TextShader";
import Color from "../math/Color";

export default class Text extends Container {
  constructor(font, text = "", color = Color.WHITE) {
    super();
    this.text = text;
    this.color = color;
    this.font = font;
  }

  _initBeforeFirstRender() {
    this.transform.isText = true;
    this.shader = new TextShader(this.gl);
    this.shader.init(this.font);
  }

  _render() {
    this.shader.activateShader(this.text, this.size, this.color);
  }

  updateTransform() {
    super.updateTransform();
    this.shader.updateTransform(this.transform.worldTransform.array);
  }
}
