import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// /**
//  * Test cube
//  */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Particles
 */
// // // Geometry
// const particlesSphereGeometry = new THREE.SphereGeometry(1, 32, 32)

//  // Material
//  const particlesMaterial = new THREE.PointsMaterial({
//      colr: 0xff88cc,
//      size: 0.02,
//      sizeAttenuation: true
//  })

//  // Points
//  const particles = new THREE.Points(particlesSphereGeometry, particlesMaterial)
//  scene.add(particles)


// Geometry
const particlesGeometry = new THREE.BufferGeometry()    
const count = 500
const positions = new Float32Array(count * 3)//multiply by 3 because each position is composed of 3 values (x, y, z)    
const color = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 10 //Math.random() - 0.5 to have a random value between -0.5 and +0.5
    color[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(color, 3))



const particlesMaterial = new THREE.PointsMaterial
    particlesMaterial.size = 0.5
    particlesMaterial.sizeAttenuation = true
    //color: new THREE.Color(0xff88cc)
    particlesMaterial.vertexColors = true


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/2.png')
particlesMaterial.map = particlesTexture
particlesMaterial.alphaMap = particlesTexture
particlesMaterial.transparent = true
particlesMaterial.alphaTest = 0.001
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending


// //add cube
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)







// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)



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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // update particles
    //particles.rotation.y = elapsedTime * 0.2

    //update particles
    for (let i = 0; i < count; i++)
    {
        let i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        particlesGeometry.attributes.position.needsUpdate = true
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()