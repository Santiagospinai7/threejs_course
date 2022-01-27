// attribute vec3 position;

varying vec3 vPosition;

void main() {
    vPosition = position;

    vec3 pos = position;
    pos.x *= 0.0;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 8.0 / -mvPosition.z;
} 