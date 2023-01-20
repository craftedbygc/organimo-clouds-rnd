#include <defaultVert>

varying vec3 vNormal;
varying vec2 vUv;
attribute mat4 instanceMatrix;

uniform float uCameraRotation;

mat4 rotationMatrix(vec3 axis, float angle)
{
		axis = normalize(axis);
		float s = sin(angle);
		float c = cos(angle);
		float oc = 1.0 - c;

		return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
														oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
														oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
														0.0,                                0.0,                                0.0,                                1.0);
}
mat4 translationMatrix(vec3 axis)
{

		return mat4(1., 0., 0., 0.,
					0., 1., 0., 0.,
					0., 0., 1., 0., 
					axis.r , axis.g , axis.b , 1.);
}


void main()	{
    #include <normalsVert>
	vUv = uv;
	mat4 transformedMatrix = instanceMatrix;

    gl_Position = projectionMatrix * modelViewMatrix * transformedMatrix * vec4( position, 1.0 );
}