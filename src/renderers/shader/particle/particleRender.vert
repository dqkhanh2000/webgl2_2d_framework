#version 300 es
precision mediump float;

in vec2 i_Position;
in float i_Age;
in float i_Life;
in vec2 i_Velocity;

in vec2 i_Coord;
in vec2 i_TexCoord;

uniform float u_StartScale;
uniform float u_EndScale;

out float v_Age;
out float v_Life;
out vec2 v_TexCoord;

void main() {
  vec2 vert_coord = i_Position +
					(u_StartScale*(1.0-i_Age / i_Life) + u_EndScale) * 0.1 * i_Coord +
					i_Velocity * 0.0;
  v_Age = i_Age;
  v_Life = i_Life;

  v_TexCoord = i_TexCoord;

  gl_Position = vec4(vert_coord, 0, 1);
}