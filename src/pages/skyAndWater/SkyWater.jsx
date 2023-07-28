import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
// import { Sky } from 'three/addons/objects/Sky.js';


export default function SkyWater() {

  const navigate = useNavigate()

  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000)
  const controls = new OrbitControls(camera, renderer.domElement)

  let water

  const init = () => {
    const container = document.getElementById('WebGL-output')
    
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5
    container.appendChild(renderer.domElement)

    camera.position.set(30, 30, 100)

    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 )

    water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('./textures/water/waternormals.jpg', (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
      }
    )
      
    water.rotation.x = -Math.PI / 2
    
    scene.add(water)

    controls.update()

    animate()

    window.addEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  const animate = () => {
    requestAnimationFrame(animate)
    render()
  }

  const render = () => {
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0

    controls.update()
    renderer.render(scene, camera)
  }


  useEffect(() => {
    init()
    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return (
    <>
      <span>PAGE SkyWater</span>
      <button onClick={handleClickBackHome}>back Home</button>
      <div id="WebGL-output"></div>
    </>
  )
}
