import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three/src/Three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';
import './index.css'

export default function Car() {
  const navigate = useNavigate()
  const handleClickBackHome = () => {
    navigate('/', { replace: true })
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const scene = new THREE.Scene()
  const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff)
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 100)
  const renderer2D = new CSS2DRenderer()
  const controls = new OrbitControls(camera, renderer.domElement)

  // 材质 material
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03
  })

  const detailsMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5
  })

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0
  })

  // car
  const shadow = new THREE.TextureLoader().load('./textures/car/ferrari_ao.png')

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./textures/car/draco/gltf/')
  
  const loader = new GLTFLoader()
  loader.setDRACOLoader( dracoLoader )

  loader.load('./textures/car/ferrari.glb', (gltf) => {
    const carModel = gltf.scene.children[0]

    // 
    carModel.getObjectByName('body').material = bodyMaterial

    // 
    carModel.getObjectByName('rim_fl').material = detailsMaterial
    carModel.getObjectByName('rim_fr').material = detailsMaterial
    carModel.getObjectByName('rim_rr').material = detailsMaterial
    carModel.getObjectByName('rim_rl').material = detailsMaterial
    carModel.getObjectByName('trim').material = detailsMaterial

    // 
    carModel.getObjectByName('glass').material = glassMaterial

    wheels.push(
      carModel.getObjectByName('wheel_fl'),
      carModel.getObjectByName('wheel_fr'),
      carModel.getObjectByName('wheel_rl'),
      carModel.getObjectByName('wheel_rr'),
    )

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
      new THREE.MeshBasicMaterial({
        map: shadow, 
        blending: THREE.MultiplyBlending, 
        toneMapped: false,
        transparent: true
      })
    )
    mesh.rotation.x = - Math.PI / 2
    mesh.renderOrder = 2
    carModel.add(mesh)

    scene.add(carModel)
  })

  // 车轮
  const wheels = []

  const init = () => {
    // 容器
    const container = document.getElementById('WebGL-output')

    // 渲染器
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop( render )
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85
    container.appendChild( renderer.domElement )

    window.addEventListener('resize', onWindowResize)

    // 场景
    scene.background = new THREE.Color(0x333333)
    scene.environment = new RGBELoader().load('./textures/car/venice_sunset_1k.hdr')
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.fog = new THREE.Fog(0x333333, 10, 15)

    // 栅格辅助
    grid.material.opacity = 0.2
    grid.material.depthWrite = false
    grid.material.transparent = true

    scene.add(grid)
    

    // 摄像机
    camera.position.set(4.25, 1.4, -4.5)



    // 定义dom自定义对象参数，
    // dom: 需要转换成CSS2D的元素  
    // renderer2D: 需要包装的2D渲染器
    const object = {
      // dom: document.getElementById('button2D'),
      dom: [
        document.getElementById('button2D'),
        document.getElementById('colorPicker'),
      ],
      renderer2D
    }
    // 传入相应参数，执行对应函数，将普通的dom元素转换成CSS2D元素 即domAddToCanvas
    // 返回值dom2DObject: { dom2D, renderer2D }
    // dom2D: 转换之后的dom元素
    // renderer2D: 包装之后的2D渲染器
    const object2D = domAddToCanvas(object)

    // 将dom2D即转换后的dom 添加进场景
    // 将dom2D添加到摄像机上 在视角变换时使元素相对于屏幕静止
    // 将dom2D添加到摄像机之后，样式与一般dom元素设置方式相同
    camera.add(object2D.dom2D)
    container.appendChild(object2D.renderer2D.domElement)

    // // 材质颜色 监听改变
    // const bodyColorInput = document.getElementById('body-color')
    // // console.log(bodyColorInput);
    // bodyColorInput.addEventListener('input', (e) => {
    //   // console.log(e);
    //   bodyMaterial.color.set( e.target.value )
    // })
    // const detailsColorInput = document.getElementById('details-color')
    // detailsColorInput.addEventListener('input', (e) => {
    //   detailsMaterial.color.set( e.target.value )
    // })
    // const glassColorInput = document.getElementById('glass-color')
    // glassColorInput.addEventListener('input', (e) => {
    //   glassMaterial.color.set( e.target.value )
    // })

    // const mesh = new THREE.Mesh(
    //   new THREE.PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
    //   new THREE.MeshBasicMaterial({
    //     map: shadow, 
    //     blending: THREE.MultiplyBlending, 
    //     toneMapped: false,
    //     transparent: true
    //   })
    // )
    // mesh.rotation.x = - Math.PI / 2
    // mesh.renderOrder = 2
    // console.log(carModel);
    // carModel.add(mesh)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer2D.setSize( window.innerWidth, window.innerHeight )
  }

  const render = () => {
    controls.update()

    const time = - performance.now() / 1000

    for (let i = 0; i < wheels.length; i++) {
      // console.log(wheels[i]);
      wheels[i].rotation.x = time * Math.PI * 2
    }

    grid.position.z = - (time) % 1

    renderer.render(scene, camera)
  }

  const handleInputChange = (e) => {
    // console.log(e.target.name);
    switch(e.target.name) {
      case 'body-color':
        bodyMaterial.color.set(e.target.value)
        break
      case 'details-color':
        detailsMaterial.color.set(e.target.value)
        break
      case 'glass-color':
        glassMaterial.color.set(e.target.value)
        break
      default:
    }
  }



  useEffect(() => {
    init()
    return () => {
      
    }
  }, [])

  return (
    <>
      <div id="WebGL-output">
        <div id="button2D">
          <span>PAGE SkyWater</span>
          <button onClick={handleClickBackHome}>back Home</button>
        </div>
        <div id='colorPicker' >
          <span>
            body
            <input id='body-color' type="color" value='#ff0000' name='body-color' onChange={(e) => handleInputChange(e)}></input>
          </span>
          <span>
            detail
            <input id='details-color' type="color" value='#ffffff' name='details-color' onChange={(e) => handleInputChange(e)}></input>
          </span>
          <span>
            glass
            <input id='glass-color' type="color" value='#ffffff' name='glass-color' onChange={(e) => handleInputChange(e)}></input>
          </span>
        </div>
      </div>
    </>
  )
}
