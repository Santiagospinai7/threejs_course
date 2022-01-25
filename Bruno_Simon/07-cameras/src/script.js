import './style.css'
import * as THREE from 'three'

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

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

// const aspectRation = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRation,
//     1 * aspectRation,
//     1,
//     -1,
//     0.1,
//     100
// )
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
// camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //mesh.rotation.y = elapsedTime;
    
    // Update camera y que se mueva con el cubo en el centro
    camera.position.x = cursor.x * 3
    camera.position.y = cursor.y * 3
    camera.lookAt(new THREE.Vector3())

    //move camera around the cube and could see behind the cube
     


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()