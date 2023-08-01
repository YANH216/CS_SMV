import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';

export default function Three() {
  const getWindowSize = () => (
    {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
      pixelRatio: window.devicePixelRatio
    }
  )

  let windowSize = getWindowSize()

  
  const navigate = useNavigate()
  
  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }
  // 创建时钟
  const clock = new THREE.Clock()
  // 创建坐标系
  const axesHelper = new THREE.AxesHelper( 5 )
  // 创建场景
  const scene = new THREE.Scene()
  // 创建摄像头  定义视锥
  const camera = new THREE.PerspectiveCamera( 75, windowSize.aspect, 0.1, 1000)
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  // 创建2D渲染器
  const renderer2D = new CSS2DRenderer()
  // 定义渲染器大小
  renderer.setSize( windowSize.width, windowSize.height )
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
  const animate = (timeStampPerMs) => {
    // console.log(timeStampPerMs);  时间戳  一帧动画的时间戳
    // 通过requestAnimationFrame提供的时间戳，单位为毫秒
    // 时间戳 单位为毫秒， 除1000 换算成秒
    // let timeStampPerS = timeStampPerMs / 1000  
    
    // 通过THREE内置方法，Clock  获取当前时间戳  单位为秒
    let timeStampPerS = clock.getElapsedTime()
    
    // 与动画单程总时间 5 取余  当时间超过5秒 重新从0开始
    const time = timeStampPerS % 5
    
    
    // 定义速度  1单位每秒
    let speed = 1
    
    // 定义变向标识
    // 0为向上  1为向下 
    // 单程时间为 5  计算目前时间已经走过多少趟  与 2 取余 判断方向
    let change = parseInt(timeStampPerS / 5) % 2
    
    // 计算当前物体所在位置  速度为1单位每秒
    if (!change) {
      cube.position.y = time * speed
    } else {
      cube.position.y = (5 - time) * speed
    }
    
    AnimationID = requestAnimationFrame( animate )
    // 控制图形旋转
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    
    controls.update()
    // 渲染场景
    renderer.render( scene, camera )
  }


  // 监听页面变化
  const handleResize = () => {
    windowSize = getWindowSize()

    // 更新摄像头视锥体宽高比
    camera.aspect = windowSize.aspect
    // 更新摄像头的投影矩阵
    // 在任何参数改变后 必须调用
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(windowSize.width, windowSize.height)
    renderer2D.setSize(windowSize.width, windowSize.height)
    // 设置渲染器的像素比
    renderer.setPixelRatio(windowSize.pixelRatio)
  }


  // 初始化方法
  const initThree = () => {
    const container = document.getElementById("WebGL-output")

    // 定义dom自定义对象参数，
    // dom: 需要转换成CSS2D的元素  
    // renderer2D: 需要包装的2D渲染器
    const domObject = {
      dom: document.getElementById('button2D'),
      renderer2D
    }
    // 传入相应参数，执行对应函数，将普通的dom元素转换成CSS2D元素 即domAddToCanvas
    // 返回值dom2DObject: { dom2D, renderer2D }
    // dom2D: 转换之后的dom元素
    // renderer2D: 包装之后的2D渲染器
    const dom2DObject = domAddToCanvas(domObject)

    // 将dom2D即转换后的dom 添加进场景
    // 将dom2D添加到摄像机上 在视角变换时使元素相对于屏幕静止
    // 将dom2D添加到摄像机之后，样式与一般dom元素设置方式相同
    camera.add(dom2DObject.dom2D)
    container.appendChild(dom2DObject.renderer2D.domElement)


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
    <div id="WebGL-output">
      <div id="button2D">
        <span>PAGE THREE</span>
        <button onClick={handleClickBackHome}>back Home</button>
      </div>
    </div>
  )
}
