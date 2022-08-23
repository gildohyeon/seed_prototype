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
// mesh.position.z = -2
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


// environment map

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])


// textures

const textureLoader = new THREE.TextureLoader()

const flowerNormalTexture = textureLoader.load('/models/flower/flower_Normal.jpg')
const flowerAlphaTexture = textureLoader.load('/models/flower/flower_Opacity.jpg')
const flowerColorTexture = textureLoader.load('/models/flower/flower_Albedo.jpg')

const repeat = -1

flowerNormalTexture.repeat.x = repeat
flowerAlphaTexture.repeat.y = repeat
flowerColorTexture.repeat.y = repeat
flowerNormalTexture.wrapS = THREE.RepeatWrapping
flowerNormalTexture.wrapT = THREE.RepeatWrapping
flowerAlphaTexture.wrapS = THREE.RepeatWrapping
flowerAlphaTexture.wrapT = THREE.RepeatWrapping
flowerColorTexture.wrapS = THREE.RepeatWrapping
flowerColorTexture.wrapT = THREE.RepeatWrapping



// gltf

const gltfLoader = new GLTFLoader()

gltfLoader.load(
    'models/flower/flower_lod1.gltf',
    (gltf) => {

        console.log(gltf)

        const flower = gltf.scene.children[0]
        flower.scale.set(0.01, 0.01, 0.01)
        flower.position.y = -0.7
        
        const flowerMaterial = new THREE.MeshPhysicalMaterial
        // flowerMaterial.color = new THREE.Color('#ffffff')
        flowerMaterial.side = THREE.DoubleSide
        flowerMaterial.map = flowerColorTexture
        flowerMaterial.metalness = 0
        flowerMaterial.roughness = 0
        flowerMaterial.ior = 2.5
        flowerMaterial.clearcoat = 1
        flowerMaterial.transparent = true
        flowerMaterial.transmission = .8
        flowerMaterial.thickness = 0
        flowerMaterial.alphaMap = flowerAlphaTexture
        flowerMaterial.normalMap = flowerNormalTexture
        flowerMaterial.envMap = environmentMapTexture
        flowerMaterial.alphaTest = 0.5

        flower.material = flowerMaterial

        scene.add(flower)

        
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