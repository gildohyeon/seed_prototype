import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Object3D, SkeletonHelper } from 'three'
import hibiscusVertexShader from './vertex.glsl'
import hibiscusFragmentShader from './fragment.glsl'


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
camera.position.x = 1.5
camera.position.y = 
camera.position.z = 0.2

scene.add(camera)


// light

// const ambientLight = new THREE.AmbientLight(0xfff5c9, .2)
// scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xfff5c9, 4)
directionalLight.position.set(1,1,0)
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

const flowerNormalTexture = textureLoader.load('/models/flower/hibiscus_normal.png')
const flowerAlphaTexture = textureLoader.load('/models/flower/hibiscus_alpha.png')
const flowerColorTexture = textureLoader.load('/models/flower/hibiscus_color.png')

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



// setting object

let hibiscus = new Object3D();

let petal = null

let stamen = new Object3D();
let stamen_center = null
let stamen_top = null
let stamen_ring = null

let bud_inner = null
let bud_outer = null

let petal_geometry = null
let stamen_center_geometry = null
let stamen_top_geometry = null
let stamen_ring_geometry = null
let bud_inner_geometry = null
let bud_outer_geometry = null

// setting material


const hibiscusMaterial = new THREE.MeshPhysicalMaterial

hibiscusMaterial.side = THREE.DoubleSide
hibiscusMaterial.color = new THREE.Color('white')
hibiscusMaterial.map = flowerColorTexture
hibiscusMaterial.metalness = 0
hibiscusMaterial.roughness = 0
hibiscusMaterial.ior = 1.33
hibiscusMaterial.clearcoat = 1
hibiscusMaterial.transparent = true
hibiscusMaterial.transmission = 0.9
hibiscusMaterial.thickness = 0.5
hibiscusMaterial.vertexColors = true;
hibiscusMaterial.alphaMap = flowerAlphaTexture
hibiscusMaterial.normalMap = flowerNormalTexture
hibiscusMaterial.envMap = environmentMapTexture
hibiscusMaterial.alphaTest = 0.5

const testMaterial = new THREE.MeshStandardMaterial


hibiscusMaterial.onBeforeCompile = (shader) => {

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        float map(float value, float min1, float max1, float min2, float max2)
        {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        `
    )

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        hibiscusVertexShader
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        hibiscusFragmentShader
    )
    
}

// const hibiscusMaterial = new THREE.RawShaderMaterial({
//     vertexShader: hibiscusVertexShader,
//     fragmentShader: hibiscusFragmentShader,
//     side: THREE.DoubleSide
// })

// gltf

const gltfLoader = new GLTFLoader()

gltfLoader.load(
    'models/flower/hibiscus.gltf',
    (gltf) => {


  

        petal_geometry = gltf.scene.children[0].children[0].geometry
        stamen_center_geometry = gltf.scene.children[0].children[1].geometry
        stamen_top_geometry = gltf.scene.children[0].children[2].geometry
        stamen_ring_geometry = gltf.scene.children[0].children[3].geometry
        bud_inner_geometry = gltf.scene.children[0].children[4].geometry
        bud_outer_geometry = gltf.scene.children[0].children[5].geometry

        initial_setting()

    }
)

const map = (value, min1, max1, min2, max2) => {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1)
}


const initial_setting = () => {

    //petal

    let petal_count = Math.round(map(Math.random(),0,1,4,5))

    petal = new THREE.InstancedMesh(petal_geometry, hibiscusMaterial, petal_count)

    for(let i = 0; i < petal_count; i++){
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 0,
            (Math.random() - 0.5) * 0,
            (Math.random() - 0.5) * 0
        )



        const quaternion = new THREE.Quaternion()

        let euler = new THREE.Euler(
            Math.PI*0.3,
            Math.PI*0.05,
            (Math.PI*2)*(i/petal_count),
            'ZXY')

        quaternion.setFromEuler(euler)

        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
        petal.setMatrixAt(i, matrix)
    }



    // stamen_center

    stamen_center = new THREE.InstancedMesh(stamen_center_geometry, hibiscusMaterial, 1)

    const position = new THREE.Vector3(
        0,
        0,
        0
    )
    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler(
        0, 
        0,
        0
        ))
    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(quaternion)
    matrix.setPosition(position)
    stamen_center.setMatrixAt(0, matrix)
 


    // stamen_top

    let stamen_top_count = Math.round(map(Math.random(),0,1,2,6))

    stamen_top = new THREE.InstancedMesh(stamen_top_geometry, hibiscusMaterial, stamen_top_count)

    for(let i = 0; i < stamen_top_count; i++){
        const position = new THREE.Vector3(
            0,
            0,
            .07
        )

        const quaternion = new THREE.Quaternion()

        let euler = new THREE.Euler(
            0,
            0,
            (Math.PI*2)*(i/stamen_top_count),
            'ZXY')

        quaternion.setFromEuler(euler)

        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
        stamen_top.setMatrixAt(i, matrix)
    }



    // stamen_ring

    let stamen_ring_count = Math.round(map(Math.random(),0,1,5,13))

    stamen_ring = new THREE.InstancedMesh(stamen_ring_geometry, hibiscusMaterial, stamen_ring_count)

    for(let i = 0; i < stamen_ring_count; i++){
        const position = new THREE.Vector3(
            0,
            0,
            (i/stamen_ring_count)*0.08
        )

        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler(
            0, 
            0,
            0
            ))

        const instance_scale = (stamen_ring_count-i)*0.05 + 0.5

        const scale = new THREE.Vector3(
            instance_scale,
            instance_scale,
            instance_scale
        )
        
        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
        matrix.scale(scale)
        stamen_ring.setMatrixAt(i, matrix)
    }


    bud_inner = new THREE.InstancedMesh(bud_inner_geometry, hibiscusMaterial, 6)

    
    bud_outer = new THREE.InstancedMesh(bud_outer_geometry, hibiscusMaterial, 6)
    




    // petal.material = hibiscusMaterial
    // stamen_center.material = hibiscusMaterial
    // stamen_top.material = hibiscusMaterial
    // stamen_ring.material = hibiscusMaterial
    // bud_inner.material = hibiscusMaterial
    // bud_outer.material = hibiscusMaterial



    hibiscus.add(petal)

    stamen.add(stamen_center)
    stamen.add(stamen_top)
    stamen.add(stamen_ring)
    hibiscus.add(stamen)

    // scene.add(bud_inner)
    // scene.add(bud_outer)

    scene.add(hibiscus)

    stamen.position.z = 0.01

    hibiscus.scale.set(5, 5, 5)
    hibiscus.rotation.y = Math.PI / 2

 

    


}








// let flowerScene = new THREE.Object3D()
// let flower = null
// let mixer = null
// let action = null


// gltfLoader.load(
//     'models/flower/hibiscus.gltf',
//     (gltf) => {

//         console.log(gltf)


//         gltf.scene.scale.set(3, 3, 3)
//         gltf.scene.position.y = 0
//         gltf.scene.rotation.y = Math.PI / 2
//         flowerScene = gltf.scene
//         flower = flowerScene.children[1]

//         const flowerMaterial = new THREE.MeshPhysicalMaterial
//         flowerMaterial.color = new THREE.Color('#ffffff')
//         flowerMaterial.side = THREE.DoubleSide
//         flowerMaterial.map = flowerColorTexture
//         flowerMaterial.metalness = 0
//         flowerMaterial.roughness = 0
//         flowerMaterial.ior = 1.33
//         flowerMaterial.clearcoat = 1
//         flowerMaterial.transparent = true
//         flowerMaterial.transmission = 0.9
//         flowerMaterial.thickness = .5
//         flowerMaterial.alphaMap = flowerAlphaTexture
//         flowerMaterial.normalMap = flowerNormalTexture
//         flowerMaterial.envMap = environmentMapTexture
//         flowerMaterial.alphaTest = 0.5

//         flower.material = flowerMaterial

//         scene.add(flowerScene)

//         // animations

//         mixer = new THREE.AnimationMixer(gltf.scene)
//         action = mixer.clipAction(gltf.animations[0])
//         //action.play()

        

//     }
// )


// scene.add(flowerScene)




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

// const interaction = () => 
// {

//     const raycaster = new THREE.Raycaster()
//     raycaster.setFromCamera(mouse, camera)

//     if(flower){
//         const intersect = raycaster.intersectObject(flower)


//             if(intersect.length){
//                 //const randomcolor = '#' + Math.round(Math.random() * 0xffffff).toString(16)
//                 //flower.material.color.set(randomcolor)

//                 //action.play()

//                 }
//         }
    
// }


// click

// window.addEventListener('click', () =>
// {
//     interaction()
// })


const clock = new THREE.Clock()
let previousTime = 0


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
