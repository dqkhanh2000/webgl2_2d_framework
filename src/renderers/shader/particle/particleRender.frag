#version 300 es
precision mediump float;

uniform sampler2D u_Sprite;

in float v_Age;
in float v_Life;
in vec2 v_TexCoord;

uniform vec4 u_Color;

out vec4 o_FragColor;

void main() {
  float t =  v_Age/v_Life;
  vec4 color = u_Color;
  color.a = 1.0 - t;
  vec4 texColor = texture(u_Sprite, v_TexCoord);
  texColor.rgb *= color.a;
  texColor.a = texColor.a * t;
  vec4 finalColor = color * texColor;
  o_FragColor = finalColor;
}