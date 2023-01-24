#include <defaultVert>

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vReflect;
uniform float uTime;
uniform bool isOrthographic;
uniform vec3 cameraPosition;
void main()	{
    #include <normalsVert>

	vec3 cameraToVertex;
	vec4 worldPosition = modelMatrix * vec4( position, 1.0);
	if ( isOrthographic ) {
		cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
	}
	else {
		cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
	}
    vUv = uv;
	vReflect = reflect( cameraToVertex, vNormal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}