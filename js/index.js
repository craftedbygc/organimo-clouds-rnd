// import MainScene from './scenes/MainScene'
import MountainScene from './scenes/MountainScene'
import CloudScene from './scenes/CloudScene'
import EnvMapTest from './scenes/EnvMapTest'
import store from './store'
import { AssetLoader, E, RAFCollection } from './utils'
import GlobalEvents from './utils/GlobalEvents'
import WebGL from './WebGL'

store.RAFCollection = new RAFCollection()
store.AssetLoader = new AssetLoader()

store.WebGL = new WebGL()
// store.MountainScene = new MountainScene()
store.EnvMapTest = new EnvMapTest()
store.CloudScene = new CloudScene()

GlobalEvents.detectTouchDevice()
GlobalEvents.enableRAF(true)
GlobalEvents.enableResize()
GlobalEvents.enableMousemove()

window.store = store

store.AssetLoader.load().then(() => {
	E.emit('App:start')
})

if (new URLSearchParams(window.location.search).has('gui')) {
	import('./utils/Gui').then(({ Gui }) => {
		E.on('App:start', () => {
			store.Gui = new Gui()
		})
	})
}