#include <defaultFrag>
#define USE_SPECULARMAP
#define ENVMAP_BLENDING_MULTIPLY
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vReflect;
varying vec3 worldPosition;

uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform samplerCube uDayEnvMap;
uniform samplerCube uNightEnvMap;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D specularMap;
uniform float reflectivity;
uniform float hourProgress;
uniform vec3 cameraPosition;


vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}


float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}


void main() {
	vec3 outgoingLight = vec3(0.);
	vec3 cameraToFrag = normalize( worldPosition - cameraPosition );
	float specularStrength;

	#ifdef USE_SPECULARMAP

		vec4 texelSpecular = texture2D( specularMap, vUv );
		specularStrength =texelSpecular.g; 

	#else

		specularStrength = 1.0;

	#endif
	vec4 t = texture2D(uTexture, vUv);
	vec3 worldNormal = inverseTransformDirection( vNormal, modelViewMatrix );
	vec3 reflectVec = refract( cameraToFrag, worldNormal, 0.8 );
	vec4 envMapColor = mix(textureCube(uDayEnvMap, vec3( -1. * reflectVec.x, reflectVec.yz )), textureCube(uNightEnvMap, vec3( -1. * reflectVec.x, reflectVec.yz )), hourProgress);

	outgoingLight = t.rgb;
	// #ifdef ENVMAP_BLENDING_MULTIPLY

	// 	outgoingLight = mix( outgoingLight, outgoingLight * envMapColor.xyz, specularStrength * reflectivity );

	// #elif defined( ENVMAP_BLENDING_MIX )

	// 	outgoingLight = mix( outgoingLight, envMapColor.xyz, specularStrength * reflectivity );

	// #elif defined( ENVMAP_BLENDING_ADD )

	// 	outgoingLight += envMapColor.xyz * specularStrength * reflectivity;

	// #endif
	outgoingLight += envMapColor.xyz * specularStrength * reflectivity;

	vec3 softLight = blendSoftLight(t.rgb, envMapColor.rgb, 0.5);	
    gl_FragColor = vec4(softLight, 1.);
	// gl_FragColor = vec4(vec3(texelSpecular.b), 1.);
}