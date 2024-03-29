import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';
import Dialog from '../../features/dialog/Dialog'

export default function MeshStandardMaterial() {

	// 页面状态  loading与complete
	const [isLoading, setIsLoading] = useState(true)

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
		renderer2D.setSize( window.innerWidth, window.innerHeight );
		// 设置渲染器的像素比
		renderer.setPixelRatio(windowSize.pixelRatio)
	}

	const navigate = useNavigate()

	const handleClickBackHome = () => {
		navigate('/home', {replace: true})
	}
	// 创建坐标系
	const axesHelper = new THREE.AxesHelper( 5 )
	// 创建场景
	const scene = new THREE.Scene()
	// 创建光源
	const light = new THREE.AmbientLight( 0x404040 )
	// 创建摄像头  定义视锥
	const camera = new THREE.PerspectiveCamera( 75, windowSize.aspect, 0.1, 1000)
	// 创建渲染器
	const renderer = new THREE.WebGLRenderer()
	// 创建2D渲染器
  const renderer2D = new CSS2DRenderer()
	// 定义渲染器大小
	renderer.setSize( windowSize.width, windowSize.height )

	const loadingManager = new THREE.LoadingManager()

	// 定义3D图形
	// 添加纹理
	const loader = new THREE.CubeTextureLoader(loadingManager)
	loader.setPath('./textures/bridge/')
	const textureCube = loader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'])


	// 定义材质
	const materital = new THREE.MeshStandardMaterial({
		envMap: textureCube,
		roughness: 0.0,
		metalness: 1.0
	})

	// 定义形状
	const geometry = new THREE.IcosahedronGeometry(3, 15)
	// 创建3D图形
	const sphere = new THREE.Mesh( geometry, materital )


	// 创建场景背景
	scene.background = textureCube
	// 添加进场景
	scene.add( sphere, axesHelper, light )
	
	// 定义摄像头位置
	camera.position.set( 10, 0, 0 )

	// 创建轨道控制器
	const controls = new OrbitControls( camera, renderer.domElement )
	// 设置控制器阻尼
	controls.enableDamping = true
	// 需要在所有定义之后
	controls.update()


	const render = () => {
		requestAnimationFrame( render )

		controls.update()
		renderer.render( scene, camera )
	}


	// 加载管理器
	loadingManager.onStart = () => {
	}

	// 纹理加载完成时 渲染
	loadingManager.onLoad = () => { 
		render() 
		setIsLoading(false)
	}
	
	
	// 初始化方法
	const initThree = () => {
		const container = document.getElementById("WebGL-output")

		// 定义dom自定义对象参数，
    // dom: 需要转换成CSS2D的元素  
    // renderer2D: 需要包装的2D渲染器
    const domObject = {
      dom: [
        document.getElementById('button2D')
      ],
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
			{
				// 纹理是否加载完成
				isLoading 
				// 正在加载
				&& <Dialog
						content='Loading...'
					/>
			}
			<div id="WebGL-output">
				<div id="button2D">
					<span>PAGE MeshNormalMaterial</span>
					<button onClick={handleClickBackHome}>back Home</button>
				</div>
			</div>
		</>
	)
}
