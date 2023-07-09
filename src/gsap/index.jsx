import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function Gsap() {
  
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

  // 控制物体移动
  const move = gsap.to(
    cube.position, {
      // 哪个轴
      y: 5, 
      // 周期
      duration: 5, 
      // 运动模式
      ease: "power3.inOut",
      // 重复次数， 无限次为 -1
      repeat: -1,
      // 往返
      yoyo: "true",
      onStart: () => {
        console.log("Animation Start");
      }
    },
  )
  // 控制物体旋转
  const rotation = gsap.to(
    cube.rotation, {
      y: 2* Math.PI,
      duration: 5,
      ease: "power3.inOut",
      repeat: -1,
    }
  )
  let renderID
  // 定义渲染方法
  const render = () => {

    renderID = requestAnimationFrame( render )

    controls.update()
    // 渲染场景
    renderer.render( scene, camera )
  }
  // 初始化方法
  const initThree = () => {
    const container = document.getElementById("WebGL-output")
    container.appendChild( renderer.domElement )

    render()
  }

  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }

  const handleClickControlAnimation = () => {
    // 判断是否在运动中
    if (move.isActive()) {
      // 停止
      move.pause()
      rotation.pause()
    } else {
      // 恢复
      move.resume()
      rotation.resume()
    }
  }

  

  useEffect(() => {
    // 初始化3D图形
    initThree()
    // 开启页面监听
    window.addEventListener("resize", handleResize)
    return () => {
      // 停止动画
      cancelAnimationFrame(renderID)
      // 停止监听
      window.removeEventListener("resize", handleResize)
    }
  }, [])


  return (
    <>
      <span>PAGE GSAP</span>
      <button onClick={handleClickBackHome}>back Home</button>
      <button onClick={handleClickControlAnimation}>Anination START/PAUSE</button>
      <div id="WebGL-output"></div>
    </>
  )
}
