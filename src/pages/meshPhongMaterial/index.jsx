import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';
import { initGUI } from '../../utils/GUI/meshPhongMaterialGUI';

export default function MeshPhongMaterial() {
  const navigate = useNavigate()
  const handleClickBackHome = () => {
    navigate('/', { replace: true })
  }

  const scene = new THREE.Scene()
  // 抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const renderer2D = new CSS2DRenderer()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000)
  // 只作用于WebGLRenderer渲染出来的元素
  const controls = new OrbitControls(camera, renderer.domElement)

  let destroy

  const init = () => {
    const container = document.getElementById('WebGL-output')

    camera.position.set(0, 0, -2000)

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

    const loadPath = './textures/town/'

    const urls = [
      loadPath + 'px.jpg', loadPath + 'nx.jpg',
      loadPath + 'py.jpg', loadPath + 'ny.jpg',
      loadPath + 'pz.jpg', loadPath + 'nz.jpg'
    ]

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    // 设置纹理折射
    textureCube.mapping = THREE.CubeRefractionMapping

    // 设置场景背景
    scene.background = textureCube

    // 设置光
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.5)
    scene.add(ambientLight)

    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: textureCube,
      // 折射比
      refractionRatio: 0.98,
      // 反射率
      reflectivity: 0.9
    })

    destroy = initGUI(cubeMaterial, ambientLight)

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    

    const loader = new PLYLoader()
    loader.load('./textures/ply/Lucy100k.ply', (geometry) => {
      createScene(geometry, cubeMaterial)
    })

    animate()

    window.addEventListener('resize', onWindowResize)
  }

  const createScene = (geometry, material) => {
    // 自动计算面片法向量
    geometry.computeVertexNormals()

    const mesh = new THREE.Mesh(geometry, material)

    // 初始化GUI
    // const destroy = initGUI(mesh)
    // mesh.scale.setScalar(1.5)
    scene.add(mesh)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer2D.setSize( window.innerWidth, window.innerHeight );
  }

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    render()
  }

  const render = () => {
    camera.lookAt(scene.position)
    renderer.render( scene, camera );
  }

  useEffect(() => {
    init()
    return () => {
      destroy()
    }
  }, [])
  return (
    <div id="WebGL-output">
      <div id="button2D">
        <span>PAGE MeshPhongMaterial</span>
        <button onClick={handleClickBackHome}>back Home</button>
      </div>
    </div>
  )
}
