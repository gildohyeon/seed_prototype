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

const ambientLight = new THREE.AmbientLight(0xfff5c9, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xfff5c9, 4)
directionalLight.position.set(-1,1,0)
scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// environment map

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])


// BG

scene.background = environmentMapTexture

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

let flower = null

gltfLoader.load(
    'models/flower/flower_lod1.gltf',
    (gltf) => {

        flower = gltf.scene.children[0]
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
        flowerMaterial.transmission = 0.9
        flowerMaterial.thickness = 0.1
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


// mouse

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

})



// raycaster

const interaction = () => 
{

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    if(flower){
        const intersect = raycaster.intersectObject(flower)

            if(intersect.length){
                const randomcolor = '#' + Math.round(Math.random() * 0xffffff).toString(16)
                flower.material.color.set(randomcolor)
                }
        }
    
}


// click

window.addEventListener('click', () =>
{
    interaction()
})





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