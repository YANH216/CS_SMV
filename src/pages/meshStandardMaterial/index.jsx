import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function MeshStandardMaterial() {
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
	// 创建光源
	const light = new THREE.AmbientLight( 0x404040 )
	// 创建摄像头  定义视锥
	const camera = new THREE.PerspectiveCamera( 75, windowSize.aspect, 0.1, 1000)
	// 创建渲染器
	const renderer = new THREE.WebGLRenderer()
	// 定义渲染器大小
	renderer.setSize( windowSize.width, windowSize.height )


	// 定义3D图形
	// 添加纹理
	const loader = new THREE.CubeTextureLoader()
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
	// 需要在所有定义之后
	controls.update()
	const animate = () => {
		requestAnimationFrame( animate )

		controls.update()
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
			<span>PAGE MeshNormalMaterial</span>
			<button onClick={handleClickBackHome}>back Home</button>
			<div id="WebGL-output"></div>
		</>
	)
}
