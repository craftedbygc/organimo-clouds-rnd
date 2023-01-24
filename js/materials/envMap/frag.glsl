#include <defaultFrag>
#define USE_SPECULARMAP
#define ENVMAP_BLENDING_MULTIPLY
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vReflect;
uniform samplerCube uDayEnvMap;
uniform samplerCube uNightEnvMap;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D specularMap;
uniform float reflectivity;

void main() {
	vec3 outgoingLight = vec3(0.);
	float specularStrength;

	#ifdef USE_SPECULARMAP

		vec4 texelSpecular = texture2D( specularMap, vUv );
		specularStrength = 1. - texelSpecular.g;

	#else

		specularStrength = 1.0;

	#endif
	vec4 t = texture2D(uTexture, vUv);
	vec4 envMapColor = mix(textureCube(uDayEnvMap, vReflect + vNormal), textureCube(uNightEnvMap, vReflect + vNormal), abs(sin(uTime)));

	outgoingLight = t.rgb;
	// #ifdef ENVMAP_BLENDING_MULTIPLY

	// 	outgoingLight = mix( outgoingLight, outgoingLight * envMapColor.xyz, specularStrength * reflectivity );

	// #elif defined( ENVMAP_BLENDING_MIX )

	// 	outgoingLight = mix( outgoingLight, envMapColor.xyz, specularStrength * reflectivity );

	// #elif defined( ENVMAP_BLENDING_ADD )

	// 	outgoingLight += envMapColor.xyz * specularStrength * reflectivity;

	// #endif
	outgoingLight += envMapColor.xyz * specularStrength * reflectivity;
    gl_FragColor = vec4(outgoingLight, 1.);
	// gl_FragColor = vec4(vec3(specularStrength), 1.);
}