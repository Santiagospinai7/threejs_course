import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Audio, Color, Scene } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/js/postprocessing/EffectComposer'
import { HorizontalBlurShader } from 'three/examples/js/shaders/HorizontalBlurShader.js'
import { ShaderPass } from 'three/examples/js/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/js/postprocessing/RenderPass'
import { VerticalBlurShader } from 'three/examples/js/shaders/VerticalBlurShader.js'

import gsap from 'gsap'

//console.log(THREE)

let planet = new THREE.Mesh()
let waterPlanet = new THREE.Mesh()
let landPlanet = new THREE.Mesh()
let letters = new THREE.Group()

let blurEffect = false

/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x0B0B0B)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
//  const texture = textureLoader.load('/Zenly_globe/studio_small_09_4k.hdr')  
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/zenly_globe/px.png',
    '/zenly_globe/nx.png',
    '/zenly_globe/py.png',
    '/zenly_globe/ny.png',
    '/zenly_globe/pz.png',
    '/zenly_globe/nz.png'
])

const matcapTexture = textureLoader.load('/zenly_globe/matcap5.jpg')
const waterMatcapTexture = textureLoader.load('/zenly_globe/blue_matcap.jpg')
const landMatcapTexture = textureLoader.load('/zenly_globe/matcap2.jpg')
const sphereGradientTexture = textureLoader.load('/zenly_globe/gradient_sphere.jpg')

const sphereAlpha = textureLoader.load('/zenly_globe/light_circle.jpg')
const sphereAlphaTransparent = textureLoader.load('/zenly_globe/light_circle_transparent.png')

//const env_sphere = textureLoader.load('/zenly_globe/gradient_sphere.jpg')

const sphereAlphaTransparentTest = textureLoader.load('/zenly_globe/bake spehere.png')

/**
 * Materials
 */

// Environment Material
 const environmentMaterial = new THREE.MeshStandardMaterial()
 environmentMaterial.metalness = 0.7
 environmentMaterial.roughness = 0.2
 environmentMaterial.envMap = environmentMapTexture

const sphereMaterial = new THREE.MeshStandardMaterial()

const landMaterial = new THREE.MeshMatcapMaterial()
landMaterial.matcap = landMatcapTexture

const waterMaterial = new THREE.MeshStandardMaterial()

const sphereTestMaterial = new THREE.MeshStandardMaterial()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

let baoPosition = new THREE.Vector3()

let action = null   //el bao en el columpio

let baoFell = false

/**
 * Cursor
 */
 const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y =  - (event.clientY / sizes.height - 0.5)
})

gltfLoader.load(
    '/zenly_globe/Zenly Refresh_Materials exploration_Milo_Planet__test2.gltf',
    (gltf) =>
    {
        gltf.scene.position.z = -5

        //Set meshes
        planet = gltf.scene
        letters = gltf.scene.children[0]
        landPlanet = gltf.scene.children[1]
        waterPlanet = gltf.scene.children[2]

        landPlanet.material = landMaterial

        //waterPlanet.material = waterMaterial

        //landPlanet.visible = false
        waterPlanet.visible = false

        console.log(waterPlanet.material)

        letters.visible = true

        gui.add(gltf.scene.position, 'y').min(-3).max(3).step(0.01).name('position y')
        gui.add(gltf.scene.position, 'x').min(-3).max(3).step(0.01).name('position x')
        gui.add(gltf.scene.position, 'z').min(-3).max(3).step(0.01).name('position z')

        scene.add(gltf.scene)
    }
)

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(2.1,64,64),
    sphereMaterial
)
sphere.position.z = -5
scene.add(sphere)


new RGBELoader()
				.setPath( '/Zenly_globe/' )
				.load( 'abandoned_tank_farm_05_4k.hdr', function ( texture ) {

					texture.mapping = THREE.EquirectangularReflectionMapping;

                    // sphereMaterial.map = texture
                    sphereMaterial.opacity = 0.25
                    sphereMaterial.transparent = true
                    sphereMaterial.alpha = 1
                    sphereMaterial.aoMap = sphereAlphaTransparent
                    sphereMaterial.aoMapIntensity = 1
                    //sphereMaterial.alphaMap = sphereAlphaTransparent

                    gui.add(sphereMaterial, 'opacity').min(0).max(1).name('Land material opacity')
                    gui.add(sphereMaterial, 'alpha').min(0).max(1).name('Land material alpha')
                    gui.add(sphereMaterial, 'aoMapIntensity').min(0).max(1).name('Land material aoMapIntensity')

					// scene.background = texture;
					scene.environment = texture;
				} );



/**
 * Lights
 */


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, -5)
controls.enableDamping = true

//const container = document.getElementById("container");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setPixelRatio(window.devicePixelRatio);
//container.appendChild(renderer.domElement);

/**
 * Blur effect
 */
const composer = new EffectComposer( renderer )
composer.addPass( new RenderPass( scene, camera ) )

const hblur = new ShaderPass( HorizontalBlurShader )
composer.addPass( hblur );

const vblur = new ShaderPass( VerticalBlurShader );
// set this shader pass to render to screen so we can see the effects
vblur.renderToScreen = true
composer.addPass( vblur );

console.log(composer);

/**
 * Detect Click
 */
document.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(e) {
    //console.log(`action time: ${action.time}`)

    var result = 0;
    
    var vectorMouse = new THREE.Vector3( //vector from camera to mouse
        -(window.innerWidth/2-e.clientX)*2/window.innerWidth,
        (window.innerHeight/2-e.clientY)*2/window.innerHeight,
        -1/Math.tan(22.5*Math.PI/180)); //22.5 is half of camera frustum angle 45 degree
    vectorMouse.applyQuaternion(camera.quaternion);
    vectorMouse.normalize();        

    var vectorObject = new THREE.Vector3(); //vector from camera to object

    vectorObject.set(sphere.position.x - camera.position.x,
        sphere.position.y - camera.position.y,
        sphere.position.z - camera.position.z);
    vectorObject.normalize();  

    result = vectorMouse.angleTo(vectorObject)*180/Math.PI

    console.log(result);

    if (vectorMouse.angleTo(vectorObject)*180/Math.PI < 6.5) {
        if(blurEffect){
            gsap.to(sphere.position, {duration: 3, x: 0})
            gsap.to(planet.position, {duration: 3, x: 0})
            // controls.target.set(0, 0, -5)
            blurEffect = false
        } else {
            gsap.to(sphere.position, {duration: 3, x: -5})
            gsap.to(planet.position, {duration: 3, x: -5})
            // controls.target.set(-5, 0, -5)
            blurEffect = true
        }

        console.log(`Toco el planeta`);
    } else if (vectorMouse.angleTo(vectorObject)*180/Math.PI < 22 && blurEffect ) {
            gsap.to(sphere.position, {duration: 3, x: 0})
            gsap.to(planet.position, {duration: 3, x: 0})
            // controls.target.set(0, 0, -5)
            blurEffect = false

        console.log(`Toco el planeta`);
    }
}

/**
 * Animate
 */

const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    // controls.update()

    // camera.position.x = cursor.x * 5
    // camera.position.y = cursor.y * 5
    // camera.lookAt(new THREE.Vector3())

    // Render
    renderer.render(scene, camera)

    if (blurEffect) {
        composer.render();
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()