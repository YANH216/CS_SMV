import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function Room() {
  const navigate = useNavigate()
  const handleClickBackHome = () => {
    navigate('/', { replace: true })
  }

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const controls = new OrbitControls( camera, renderer.domElement )

  const init = () => {
    const container = document.getElementById('WebGL-output')

    camera.position.set(1, 0, 0)
    
    const geometry = new THREE.IcosahedronGeometry( 5, 15 )
    
    const texture = new THREE.TextureLoader().load('./textures/room/room.jpg')
    texture.colorSpace = THREE.SRGBColorSpace
    
    const material = new THREE.MeshBasicMaterial({ map: texture })
    
    const sphere = new THREE.Mesh(geometry, material)
    sphere.geometry.scale(1, 1, -1)
    
    scene.add(sphere)
    
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    container.appendChild( renderer.domElement )

    controls.update()

    render()

    window.addEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  } 

  const render = () => {
    requestAnimationFrame( render )
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
      <div id="WebGL-output">
        <span>PAGE THREE</span>
        <button onClick={handleClickBackHome}>back Home</button>
      </div>
    </>
  )
}
