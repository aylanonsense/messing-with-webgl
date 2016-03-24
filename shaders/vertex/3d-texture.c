attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {
  vec2 tileUV = vec2(dot(a_normal.zxy, a_position.xyz), dot(a_normal.yzx, a_position.xyz));
  // vec2 texCoord = tileOffset + tileSize * fract(tileUV)

  //multiply the position by the matrix
  gl_Position = u_matrix * a_position;

  //pass the texture coordinate to the fragment shader
  v_texcoord = a_texcoord;
  v_normal = a_normal;
}