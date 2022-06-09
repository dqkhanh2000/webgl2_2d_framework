import Container from "./Container";
import TextShader from "../renderers/TextShader"
import RobotoFont from "../../assets/fonts/roboto";

export default class Text extends Container {
  constructor() {
    super();
    this.shader = new TextShader(this.gl);
  }

  _render() {
    this.shader._render();
  }

  // updateTransform() {
  //   super.updateTransform();
  // }
}
