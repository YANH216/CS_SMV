import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// 直接引用Three包中的Three.d.ts  不然没有代码补全(原因不明)
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


/* 对于整个场景中物体的阴影
    1.渲染器要开启阴影渲染
      renderer.shadowMap.enabled = true
    2.光源需要时可以产生阴影的  环境光(ambientLight)不行,除了光源选择还要开启阴影投射
      以平行光(directionalLight)为例
      directionalLight.castShadow = true
    3.照射到的物体需要是能产生阴影的, 除此之外也要开启阴影渲染
      以IcosahedronGeometry为例创建的球体sphere
      sphere.castShadow = true
    4.作为接收阴影的物体,需要开启阴影接收
      以PlaneGeometry创建的平面plane为例
      plane.receiveShadow = true
 */

export default function LightAndShadow() {
  const getWindowSize = () => (
    {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
      pixelRatio: window.devicePixelRatio
    }
  )

  let windowSize = getWindowSize()

  // 监听页面变化
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
    // 设置渲染器的像素比
    renderer.setPixelRatio(windowSize.pixelRatio)
  }

  const navigate = useNavigate()

  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }

  // 创建坐标系
  const axesHelper = new THREE.AxesHelper( 5 )
  // 创建场景
  const scene = new THREE.Scene()
  // 创建时钟
  const clock = new THREE.Clock()
  // 创建摄像头  定义视锥
  const camera = new THREE.PerspectiveCamera( 75, windowSize.aspect, 0.1, 1000)
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  // 定义渲染器大小
  renderer.setSize( windowSize.width, windowSize.height )
  // 开启渲染器阴影计算
  renderer.shadowMap.enabled = true
  // 添加光源
  // 环境光
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 )
  // 直射光  (平行光)
  const directionalLight = new THREE.DirectionalLight( 0xff0000, 0.5 )
  // 是否投射阴影
  directionalLight.castShadow = true
  // 直射光(平行光)照射方向
  // directionalLight.position.set(10, 10, 10)

  // 在直射光添加到一个物体上
  // 创建一个球
  const geometryLightSphere = new THREE.IcosahedronGeometry( 0.5, 15 )
  const materialLightSphere = new THREE.MeshStandardMaterial()
  const lightSphere = new THREE.Mesh( geometryLightSphere, materialLightSphere )
  lightSphere.position.set(10, 10, 10)
  // 将直射光添加到该物体上
  lightSphere.add(directionalLight)

  // 定义球形状
  const geometrySphere = new THREE.IcosahedronGeometry( 3, 15 )
  // 定义球材质
  const materialSphere = new THREE.MeshStandardMaterial({
    roughness: 1,  // 默认值为1
    metalness: 0   // 默认值为0
  })
  // 创建球图形
  const sphere = new THREE.Mesh( geometrySphere, materialSphere )
  // 是否渲染阴影
  sphere.castShadow = true

  // 定义平面
  const geometryPlane = new THREE.PlaneGeometry( 50, 50 )
  // 定义平面材质
  const materialPlane = new THREE.MeshStandardMaterial({

  })
  // 创建平面
  const plane = new THREE.Mesh( geometryPlane, materialPlane )
  // 旋转平面
  plane.rotateX( - Math.PI / 2 )
  // 设置平面位置
  plane.position.y = -10
  // 是否接收阴影
  plane.receiveShadow = true
  // 将3D图形, 坐标系添加进场景
  scene.add( sphere, plane, ambientLight, lightSphere, axesHelper )
  // 定义摄像头位置
  camera.position.set( 30, 0, 0 )

  // 创建轨道控制器
  const controls = new OrbitControls( camera, renderer.domElement )

  // 需要在所有定义之后
  controls.update()

  // 定义动画方法
  const animate = () => {
    // 让发光的小球 圆周运动
    const time = clock.getElapsedTime()
    lightSphere.position.x = Math.sin(time) * 10
    lightSphere.position.z= Math.cos(time) * 10

    requestAnimationFrame( animate )

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
      // 停止监听
      window.removeEventListener("resize", handleResize)
    }
  }, [])


  return (
    <>
      <div id="WebGL-output">
        <span>PAGE LightAndShadow</span>
        <button onClick={handleClickBackHome}>back Home</button>
      </div>
    </>
  )
}
