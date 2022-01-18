import logo from './logo.svg';
import './App.css';

import * as THREE from 'three'

import gsap from 'gsap'


function App() {
  // Canvas
  const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()

  // Object
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Sizes
  const sizes = {
      width: 800,
      height: 600
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 3
  scene.add(camera)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)

  //Adapt frame rate
  //Time
  //let time = Date.now()

  // CLock
  //const clock = new THREE.Clock()

  gsap.to(mesh.position, {
      duration: 1, delay: 1, x: 2,
  })

  gsap.to(mesh.position, {
      duration: 1, delay: 2, x:0
  })

  //Animations
  const tick = () => 
  {
      /* Adapt frame rate
      //Time
      const currenTime = Date.now()
      const deltaTime = currenTime - time
      time = currenTime

      console.log(deltaTime);
      */

      // Clock
      //const elapsedTime = clock.getElapsedTime()

      // Update object
      //mesh.rotation.y += 0.001 * deltaTime
      //mesh.rotation.y = elapsedTime * Math.PI * 1

      //Another way to animate shapes is with libraries, for example: CSAP
      // npm install --save gsap@3.5.1

      //mesh.position.y = Math.sin(elapsedTime)
      //mesh.position.x = Math.cos(elapsedTime)

      //Render 
      renderer.render(scene, camera)

      window.requestAnimationFrame(tick)
  }

  tick()

  console.log('testing');

  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
