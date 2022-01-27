import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import * as THREE from 'three'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'

class Model {
    constructor (obj) {
        console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.isActive = true;

        this.color1 = obj.color1
        this.color2 = obj.color2

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            /*------------------------------
            Original mesh
            ------------------------------*/
            this.mesh = response.scene.children[0]
            
            /*------------------------------
            Material
            ------------------------------*/
            this.material = new THREE.MeshBasicMaterial({
                color: 'red',
                wireframe: true
            })
            this.mesh.material = this.material

            /*------------------------------
            Geometry
            ------------------------------*/
            this.geometry = this.mesh.geometry

            /*------------------------------
            Particles material
            ------------------------------*/
            // this.particlesMaterial = new THREE.PointsMaterial({
            //     color:'red',
            //     size: 0.02
            // })
            this.particlesMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uColor1: { value: new THREE.Color(this.color1) },
                    uColor2: { value: new THREE.Color(this.color2) },
                    uTime: { value: 0}
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })

            /*------------------------------
            Particles geometry
            ------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 20000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles * 3)

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPosition.set([
                    newPosition.x, //0 - 3
                    newPosition.y, //1 - 4
                    newPosition.z  //2 - 5
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))

            /*------------------------------
            Particles
            ------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
            
            //Place On Load
            if(this.placeOnLoad) {
                this.add()
            }
        })
    }

    add() {
        this.scene.add(this.particles)
        // this.isActive = true;
    }

    remove() {
        this.scene.remove(this.particles)
        // this.isActive = false;
    }
}
export default Model