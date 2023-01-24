import { Color, Fog, Mesh, Object3D, PerspectiveCamera, MeshNormalMaterial, Scene, PlaneGeometry, MeshBasicMaterial, InstancedMesh, Vector3, Euler, Quaternion, Matrix4, DoubleSide } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BasicMaterial, CloudsMaterial } from '../materials'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import cloudMap from '../../public/img/cloud-map.png'

export default class MountainScene extends Scene {
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
		// this.background = new Color(0x000000)
		// this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

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
		// store.WebGL.renderer.render(this, this.camera)
	}

	addMountain() {
		console.log(this.assets.models.rock.scene.children[0])
		const geometry = this.assets.models.rock.scene.children[0].geometry
		const material = new MeshNormalMaterial({
			depthWrite: true,
			depthTest: true,
			side: DoubleSide
		})
		const mountain = new Mesh(geometry, material)
		mountain.rotation.x = Math.PI * 0.5
		console.log(mountain)
		mountain.scale.set(3, 3, 3)
		mountain.position.y = -1

		this.add(mountain)
	}

	load() {
		this.assets = {
			textures: {
			},
			models: {}
		}
		const glb = {
			rock: 'rock.glb'
		}
		const textures = {
			smoke: 'smoke.png',
			cloudMap: 'cloud-map.png'
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