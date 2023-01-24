import { Color, Fog, Mesh, Object3D, PerspectiveCamera, MeshNormalMaterial, Scene, WebGLCubeRenderTarget, PlaneGeometry, MeshBasicMaterial, InstancedMesh, Vector3, Euler, Quaternion, Matrix4, DoubleSide } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EnvMapMaterial } from '../materials'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
// import cloudMap from '../../public/img/cloud-map.png'

export default class EnvMapTest extends Scene {
	constructor() {
		super()

		this.particles = []
		this.dummy = new Object3D()
		this.count = 200
		this.spread = 10
		this.step = 15
		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 5000)
		this.camera.position.z = 15
		this.camera.position.y = 3
		this.background = new Color(0x000000)
		this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

		this.controls = new OrbitControls(this.camera, store.WebGL.renderer.domElement)
		this.controls.enableDamping = true
		console.log(store)
		this.load()

		E.on('App:start', () => {
			this.build()
			this.addEvents()
		})
	}

	build() {
		this.setEnv()
		this.addMountain()
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 2)
	}

	onResize = () => {
		this.camera.aspect = store.window.w / store.window.h
		this.camera.updateProjectionMatrix()
	}

	onRaf = (t) => {
		if (this.instanceMesh) {
			this.updadeInstanceMatrix()
		}
		this.controls.update()
		this.mountain.material.uniforms.uTime.value = t

		store.WebGL.renderer.render(this, this.camera)
	}

	addMountain() {
		this.assets.textures.rock.flipY = false

		const geometry = this.assets.models.rock.scene.children[0].geometry
		const material = new EnvMapMaterial({
			uDayEnvMap: this.dayText,
			uNightEnvMap: this.nightText,
			texture: this.assets.models.rock.scene.children[0].material.map,
			cameraPosition: this.camera.position,
			specularMap: this.assets.models.rock.scene.children[0].material.roughnessMap
		})
		this.mountain = new Mesh(geometry, material)
		this.mountain.rotation.x = Math.PI * 0.5
		console.log(this.mountain)
		this.mountain.scale.set(3, 3, 3)
		this.mountain.position.y = 3

		this.add(this.mountain)
	}

	setEnv() {
		const renderTargetNight = new WebGLCubeRenderTarget(this.assets.textures.nightEnv.image.naturalHeight / 2)
		const renderTargetDay = new WebGLCubeRenderTarget(this.assets.textures.dayEnv.image.naturalHeight / 2)
		renderTargetNight.fromEquirectangularTexture(store.WebGL.renderer, this.assets.textures.nightEnv)
		renderTargetDay.fromEquirectangularTexture(store.WebGL.renderer, this.assets.textures.dayEnv)
		this.nightText = renderTargetNight.texture
		this.dayText = renderTargetDay.texture
		store.WebGL.renderer.initTexture(this.nightText)
		store.WebGL.renderer.initTexture(this.dayText)
		console.log(this.nightText)
	}

	load() {
		this.assets = {
			textures: {
			},
			models: {}
		}
		const glb = {
			rock: 'RockEnv.glb'
		}
		const textures = {
			rock: 'rock.png',
			nightEnv: 'envMap1.png',
			dayEnv: 'envMap2.png'
		}
		for (const key in textures) {
			store.AssetLoader.loadTexture((`texture/${textures[key]}`)).then(texture => {
				this.assets.textures[key] = texture
			})
		}
		for (const key in glb) {
			store.AssetLoader.loadGltf((`models/${glb[key]}`)).then((gltf, animation) => {
				this.assets.models[key] = gltf
			})
		}
	}
}