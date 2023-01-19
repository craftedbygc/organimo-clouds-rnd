#include <defaultVert>

varying vec3 vNormal;
varying vec2 vUv;
attribute mat4 instanceMatrix;

void main()	{
    #include <normalsVert>
	vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
}