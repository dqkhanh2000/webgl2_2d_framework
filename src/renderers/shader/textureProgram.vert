#version 300 es
in vec2 a_position;

uniform mat3 u_transform;
uniform mat4 u_textureMatrix;

out vec2 v_texcoord;

void main() {
   gl_Position = vec4((u_transform * vec3(a_position, 1)).xy, 0, 1);
   v_texcoord = (u_textureMatrix * vec4(a_position, 1, 1)).xy;
}