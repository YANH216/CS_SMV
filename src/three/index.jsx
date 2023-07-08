import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function Three() {
  const getWindowSize = () => (
    {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    }
  )

  const [windowSize, setWindowSize] = useState(getWindowSize())
  // 监听页面变化
  const handleResize = () => {
    setWindowSize(getWindowSize())
  }

  const navigate = useNavigate()

  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }
  // 创建坐标系
  const axesHelper = new THREE.AxesHelper( 5 )
  // 创建场景
  const scene = new THREE.Scene()
  // 创建摄像头  定义视锥
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  // 定义渲染器大小
  renderer.setSize( windowSize.innerWidth, windowSize.innerHeight )
  // 定义3D图形形状
  const geometry = new THREE.BoxGeometry( 1, 1, 1 )

  // 定义3D图形材质
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // 创建3D图形
  const cube = new THREE.Mesh( geometry, material )
  // 将3D图形, 坐标系添加进场景
  scene.add( cube, axesHelper )
  // 定义摄像头位置
  camera.position.set( 10, 0, 0 )

  // 创建轨道控制器
  const controls = new OrbitControls( camera, renderer.domElement )

  // 需要在所有定义之后
  controls.update()
  // 定义动画ID
  let AnimationID
  // 定义动画方法
  const animate = () => {
    AnimationID = requestAnimationFrame( animate )
    // 控制图形旋转
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    if (cube.position.y >= 5) {
      cube.position.y = 0
    } 
    console.log('cubeY', cube.position.y)

    controls.update()
    // 渲染场景
    renderer.render( scene, camera )
  }
  // 初始化方法
  const initThree = () => {
    const container = document.getElementById("WebGL-output")
    container.appendChild( renderer.domElement )

    animate()
  }

  useEffect(() => {
    // 初始化3D图形
    initThree()
    // 开启页面监听
    window.addEventListener("resize", handleResize)
    return () => {
      // 停止动画
      cancelAnimationFrame(AnimationID)
      // 停止监听
      window.removeEventListener("resize", handleResize)
    }
  }, [])


  return (
    <>
      <button onClick={handleClickBackHome}>back Home</button>
      <div id="WebGL-output"></div>
    </>
  )
}
