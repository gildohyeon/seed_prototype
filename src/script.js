import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// scene
const scene = new THREE.Scene()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// object
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// size
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

// camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2

scene.add(camera)


// light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)





// gltf

const gltfLoader = new GLTFLoader()

gltfLoader.load(
    'models/flower/flower_lod1.gltf',
    (gltf) => {
        console.log(gltf)
        const flower = gltf.scene.children[0]
        flower.scale.set(0.01, 0.01, 0.01)
        flower.position.y = -0.7
        
        scene.add(flower)

        // const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        // const mesh = new THREE.Mesh(geometry, material)
        // scene.add(mesh)
        
    }
)



// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


// controls

const controls = new OrbitControls(camera, canvas)



const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()