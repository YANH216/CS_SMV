import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';

export default function Room() {
  const navigate = useNavigate()
  const handleClickBackHome = () => {
    navigate('/', { replace: true })
  }

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()
  // 创建2D渲染器
  const renderer2D = new CSS2DRenderer()
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const controls = new OrbitControls( camera, renderer.domElement )

  const init = () => {
    const container = document.getElementById('WebGL-output')

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
    renderer2D.setSize( window.innerWidth, window.innerHeight );
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
        <div id="button2D">
          <span>PAGE THREE</span>
          <button onClick={handleClickBackHome}>back Home</button>
        </div>
      </div>
    </>
  )
}
