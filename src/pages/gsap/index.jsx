import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { gsap } from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';
import { initGUI } from '../../utils/gaspGui'
import styles from './index.module.css'

export default function Gsap() {
  const navigate = useNavigate()
  
  const getWindowSize = () => (
    {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
      pixelRatio: window.devicePixelRatio
    }
  )
  let windowSize = getWindowSize()

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

  // 添加加载管理器
  const loadingManager = new THREE.LoadingManager()
  loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    // console.log('Loading file: ' + url + '已加载' + itemsLoaded + '一共需要加载' + itemsTotal);
  }
  loadingManager.onLoad = function () {
    console.log('已全部加载完成');
  }
  loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    // console.log('Loading file: ' + url + '已加载' + itemsLoaded + '一共需要加载' + itemsTotal);
  }
  
  // 定义3D图形
  const createCube = (loadingManager) => {
    // 定义3D图形形状
    const geometry = new THREE.BoxGeometry( 2, 2, 2 )
    // 创建纹理加载器并加载纹理
    const texture = new THREE.TextureLoader(loadingManager).load('http://localhost.charlesproxy.com:8080/texture')
    // 设置纹理偏移
    // texture.offset.set(0.5, 0.5)
    // 设置旋转中心点 默认为 (0, 0)  即左下角
    texture.center.set(0.5, 0.5)
    // 设置纹理旋转
    texture.rotation = Math.PI / 4
    // 设置纹理重复
    texture.repeat.set(2, 2)
    // 设置纹理重复的同时  也要设置重复方式 不然纹理会被延伸
    // 垂直方向重复
    texture.wrapT = THREE.RepeatWrapping
    // 水平方向   镜像重复
    texture.wrapS = THREE.MirroredRepeatWrapping 
    // 设置滤镜
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.LinearFilter
    // 定义3D图形材质
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      map: texture
    })
    // 创建3D图形
    return new THREE.Mesh( geometry, material )
  }

  const createBufferGeometry = () => {
    // 创建图形
    const geometry = new THREE.BufferGeometry()
    // 定义顶点 面由两个三角形面组成 有两个重叠的顶点
    // 按照要画的线来确定顶点位置,不能随意更换位置
    const vertices = new Float32Array([
      -1.0, 1.0, 2.0,
      1.0, 1.0, 2.0,
      1.0, -1.0, 2.0,

      1.0, -1.0, 2.0,
      -1.0, -1.0, 2.0,
      -1.0, 1.0, 2.0
    ])
    // 每三个一组, x, y, z
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    return new THREE.Mesh(geometry, material)
  }
  const cube = createCube(loadingManager)
  cube.name = 'cube'
  const bufferGeometry = createBufferGeometry()

  
  // 将3D图形, 坐标系添加进场景
  scene.add( cube, bufferGeometry, axesHelper )
  // 定义摄像头位置
  camera.position.set( 10, 0, 0 )
  // 创建轨道控制器
  const controls = new OrbitControls( camera, renderer.domElement )
  // 设置控制器阻尼
  controls.enableDamping = true 
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
    // 更新控制器
    controls.update()
    // 渲染场景
    renderer.render( scene, camera )
  }

/*   // 初始化GUI变量控制界面
  // 传入参数对象
  const initGUI = () => {
    const gui = new dat.GUI({name: 'MY GUI'})  // GUI名称：name 默认为MY GUI
    const params = {
      color: '#ffff00',
      fn: handleClickControlAnimation  // 动画停止与开始
    }

    gui
      .add(cube.position, 'z')  // add(需要修改的对象<object>, '对象上的哪个属性'<string>)
      .min(0)  // 控制条的最小值: min  类型number
      .max(5)   // 控制条的最大值: max 类型number
      .step(0.1)    // 变化间隔: step 类型number
      .name('移动z轴')    // 名称: string
      .onFinishChange(value => {   // 完成更改时的回调
        console.log("current value", value);
      })
    
    gui
      .add(params, 'fn')
      .name('ANIMATION START/STOP')

    // 添加一个下拉框
    const folder = gui.addFolder('颜色&是否可见')
    // 改变物体颜色
    folder
      .addColor(params, 'color')
      .onChange(value => {
        cube.material.color.set(value)
      })

    folder.add(cube, 'visible')

    // 定义GUI销毁函数 闭包
    const destroyGUI = () => {
      gui.destroy()
    }
    return destroyGUI
  }
 */


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
    render()
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
    renderer2D.setSize( window.innerWidth, window.innerHeight );
    // 设置渲染器的像素比
    renderer.setPixelRatio(windowSize.pixelRatio)
  }

  // 点击按钮页面跳转
  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  } 

  // 点击按钮控制动画
  const handleClickControlAnimation = () => {
    // 判断是否在运动中
    if (move.isActive()) {
      move.pause()
      rotation.pause()
      console.log('Animation Stop');
    } else {
      move.resume()
      rotation.resume()
      console.log('Animation Start');
    }
  }

  // 点击控制是否全屏
  const handleClickControlFullscreen = () => {
    // 请求全屏显示
    renderer.domElement.requestFullscreen()
    console.log(render.domElement);
    // 退出全屏
    // document.exitFullScreen()
  }

  

  useEffect(() => {
    // 初始化3D图形
    initThree()
    // 初始化GUI,并获取其中的销毁方法
    const destroyGUI = initGUI(cube, handleClickControlAnimation)
    // 开启页面监听
    window.addEventListener("resize", handleResize)
    return () => {
      // 停止动画
      cancelAnimationFrame(renderID)
      // 销毁GUI  销毁GUI之后最外层的div并没有清除  只是清除了div内部的元素
      destroyGUI()
      // 停止监听
      window.removeEventListener("resize", handleResize)
    }
  }, [])


  return (
    <>
      <div id="WebGL-output">
        <div id="button2D">
          <span>PAGE GSAP</span>
          <button className={styles.btn} onClick={handleClickBackHome}>back Home</button>
          <button className={styles.btn} onClick={handleClickControlAnimation}>Anination START/PAUSE</button>
          <button className={styles.btn} onClick={handleClickControlFullscreen}>FULLSCREEN</button>
        </div>
      </div>
    </>
  )
}
