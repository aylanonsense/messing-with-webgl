attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texturecoordinate;
attribute vec2 a_texturesize;
attribute vec2 a_textureoffset;

uniform mat4 u_matrix;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texturecoordinate;
varying vec2 v_texturesize;
varying vec2 v_textureoffset;

void main() {
  //multiply the position by the matrix
  gl_Position = u_matrix * a_position;

  //pass the texture coordinate to the fragment shader
  v_position = a_position.xyz;
  v_normal = a_normal;
  v_texturecoordinate = a_texturecoordinate;
  v_texturesize = a_texturesize;
  v_textureoffset = a_textureoffset;
}