import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

export default function Three() {

  const navigate = useNavigate()

  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize( window.innerHeight, window.innerHeight )
  const geometry = new THREE.BoxGeometry( 1, 1, 1 )
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh( geometry, material )
  scene.add( cube )

  camera.position.z = 5

  let AnimationID

  const animate = () => {
    AnimationID = requestAnimationFrame( animate )

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    console.log('1')

    renderer.render( scene, camera )
  }

  const initThree = () => {
    const container = document.getElementById("WebGL-output")
    container.appendChild( renderer.domElement )

    animate()
  }

  useEffect(() => {
    initThree()

    return () => {
      cancelAnimationFrame(AnimationID)
    }
  }, [])


  return (
    <>
      <button onClick={handleClickBackHome}>back Home</button>
      <div id="WebGL-output"></div>
    </>
  )
}
