#version 300 es
in vec4 a_position;

uniform mat4 u_transform;
uniform mat4 u_textureMatrix;

out vec2 v_texcoord;

void main() {
   gl_Position = u_transform * a_position;
   v_texcoord = (u_textureMatrix * vec4(a_position, 1, 1)).xy;
}