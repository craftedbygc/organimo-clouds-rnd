import { RawShaderMaterial } from 'three'
import store from '../../store'

import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class EnvMapMaterial extends RawShaderMaterial {
	constructor(options) {
		super({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: store.WebGL.globalUniforms.uTime,
				uTexture: { value: options.texture },
				uDayEnvMap: { value: options.uDayEnvMap },
				uNightEnvMap: { value: options.uNightEnvMap },
				cameraPosition: { value: options.cameraPosition },
				reflectivity: { value: 0.3 },
				specularMap: { value: options.specularMap },
				hourProgress: { value: options.hourProgress }
			}
		})
	}
}