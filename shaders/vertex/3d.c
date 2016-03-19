attribute vec4 a_position;
 
uniform mat4 u_matrix;
 
void main() {
  //multiply the position by the matrix
  gl_Position = u_matrix * a_position;
}