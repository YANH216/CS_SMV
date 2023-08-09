import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
// import { domAddToCanvas } from '../../utils/domAddToCanvas';
import Styles from './index.module.css'

export default function First() {

  const navigate = useNavigate()

  const container = useRef(null)

  const handleLoginClick = () => {
    navigate('/home', { replace: true })
  }

  const clock = new THREE.Clock()
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  // const renderer2D = new CSS2DRenderer()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  const controls = new OrbitControls(camera, renderer.domElement)
  
  const stats = new Stats()

  let mixer

  const init = () => {
    // const domObject = {
    //   dom: [
    //     container.current
    //   ],
    //   renderer2D
    // }
    // const dom2DObject = domAddToCanvas(domObject)
    // camera.add(dom2DObject.dom2D)
		// container.appendChild(dom2DObject.renderer2D.domElement)
    
    scene.background = new THREE.Color(0xbfe3dd)
    
    camera.position.set(5, 2, 8)

    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85

    // 
    container.current.appendChild(renderer.domElement, stats)

    const pmremGenerator = new THREE.PMREMGenerator( renderer )
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture

    
    controls.target.set(0, 0.5, 0)
    controls.update()
    controls.enablePan = false
    controls.enableDamping = true

    const dracoloader = new DRACOLoader()
    dracoloader.setDecoderPath('./textures/draco/gltf/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoloader)
    loader.load('./textures/littleTokyo/LittlestTokyo.glb', (gltf) => {
      const model = gltf.scene
      model.position.set(1,1,0)
      model.scale.setScalar(0.01)
      scene.add(model)

      mixer = new THREE.AnimationMixer(model)
      mixer.clipAction(gltf.animations[0]).play()

      animate()

    }, undefined, (e) => {
      console.error(e)
    })

    window.addEventListener('resize', onWindowResize)

  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )
  }

  const animate = () => {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    mixer.update(delta)

    controls.update()

    stats.update()

    renderer.render(scene, camera)
  }


  useEffect(() => {
    init()
    return () => {
      window.removeEventListener('resize', onWindowResize)
      renderer.clear()
      scene.clear()
    }
  }, [])


  return (
    <Fragment>
      <div ref={container}>
        <div className={Styles.content}>
          <button onClick={handleLoginClick}>login</button>
          <span>FIRST</span>
        </div>
      </div>
    </Fragment>
  )
}
