import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export default function HDR() {

  const navigate = useNavigate()
  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }

  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  const scene = new THREE.Scene()
  
  
  const init = () => {
    camera.position.set(-1, 0, 0)

    const axesHelper = new THREE.AxesHelper( 5 )

    const container = document.getElementById("WebGL-output")
    container.appendChild( renderer.domElement )
    
    
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    
    
    
    new RGBELoader().load('./textures/hdr/memorial.hdr', (texture) => {
      
      const geometry = new THREE.BoxGeometry(5, 5, 5)

      const material = new THREE.MeshBasicMaterial({ map: texture })
    
      const sphere = new THREE.Mesh(geometry, material)
      // 物体内部可见
      sphere.geometry.scale(1, 1, -1)
    
      scene.add(sphere, axesHelper)

      render()

      window.addEventListener('resize', onWindowResize )
    })
  }

  const onWindowResize = () => {
     // 更新摄像头视锥体宽高比
    camera.aspect = aspect
    // 更新摄像头的投影矩阵
    // 在任何参数改变后 必须调用
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.setPixelRatio( window.devicePixelRatio )
  }

  
  // 创建轨道控制器
  const controls = new OrbitControls( camera, renderer.domElement )
  
  // 需要在所有定义之后
  controls.update()
  
  const render = () => {
    requestAnimationFrame( render )
    controls.update()
    renderer.render( scene, camera )
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
        <span>PAGE HDR</span>
        <button onClick={handleClickBackHome}>back Home</button>
      </div>
    </>
  )
}
