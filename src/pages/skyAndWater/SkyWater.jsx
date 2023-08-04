import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three/src/Three'
// 性能监视器
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { initGUI } from '../../utils/GUI/skyAndWaterGUI';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { domAddToCanvas } from '../../utils/domAddToCanvas';


export default function SkyWater() {

  const navigate = useNavigate()

  const handleClickBackHome = () => {
    navigate('/', {replace: true})
  }

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()
  const renderer2D = new CSS2DRenderer()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000)
  // 只作用于WebGLRenderer渲染出来的元素
  const controls = new OrbitControls(camera, renderer.domElement)

  // water
  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 )

  const water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('./textures/water/waternormals.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  ) 
  water.rotation.x = -Math.PI / 2
  
  scene.add(water)

  // box
  const boxGeometry = new THREE.BoxGeometry(30, 30, 30)
  const boxMaterial = new THREE.MeshStandardMaterial({ roughness: 0 })

  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  scene.add(box)

  // sky
    const sky = new Sky()
    sky.scale.setScalar(10000)
    scene.add(sky)
  
    // sun
    const sun = new THREE.Vector3()
  
    // sun 参数
    const parameters = {
      elevation: 2,  // 海拔
      azimuth: 180   //方位角
    }
  

  const updateSun = () => {

    const skyUniforms = sky.material.uniforms

    // 浊度
    skyUniforms['turbidity'].value = 10
    skyUniforms['rayleigh'].value = 2
    skyUniforms['mieCoefficient'].value = 0.005
    skyUniforms['mieDirectionalG'].value = 0.8

    // 允许根据材料粗糙度快速访问不同级别的模糊。 它被打包成一种特殊的CubeUV格式，允许我们执行自定义插值，以便我们可以支持RGBE等非线性格式。
    const pmremGenerator = new THREE.PMREMGenerator( renderer )

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation )
    const theta = THREE.MathUtils.degToRad( parameters.azimuth )

    sun.setFromSphericalCoords( 1, phi, theta )

    skyUniforms['sunPosition'].value.copy( sun )
    water.material.uniforms['sunDirection'].value.copy( sun ).normalize()

    let renderTarget
    if (renderTarget !== undefined) renderTarget.dispose()

    renderTarget = pmremGenerator.fromScene( sky )

    scene.environment = renderTarget.texture
    
  }

  // SpriteMaterial  总是面向屏幕的材质
  // const btnMaterial = new THREE.SpriteMaterial({  
  //   color: 0xffffff,
  //   sizeAttenuation: false
  // })
  // const btn = new THREE.Sprite(btnMaterial)
  // btn.name = 'btnLinkToHome'
  // btn.scale.setScalar(0.1)
  // scene.add(btn)


  // raycaster获取不到CSS2DRenderer渲染出来的html标签元素

  // 3D元素添加点击事件
  // const raycaster = new THREE.Raycaster()
  // const mouse = new THREE.Vector2()

  // const onMouseClick = (e) => {
  //   console.log('click');
  //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  //   mouse.y = - (e.clientY / window.innerHeight) * 2 + 1

  //   raycaster.setFromCamera( mouse, camera )

  //   const intersects = raycaster.intersectObjects( scene.children )
  //   console.log('intersects', intersects);
  //   if (intersects[0].object.type === 'Sprite' && intersects[0].object.name === 'btnLinkToHome') {
  //     handleClickBackHome()
  //   }
  // }


  const init = () => {
    const container = document.getElementById('WebGL-output')
    
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // 色调曝光级别
    renderer.toneMappingExposure = 0.5
    
    // renderer2D.setSize(window.innerWidth, window.innerHeight)
    // renderer2D.domElement.style.position = 'absolute'
    // renderer2D.domElement.style.top = '0px'
    // // 让CSS2DRenderer的dom元素不会成为点击事件的目标(当后代元素设置该属性值,鼠标点击事件会直接指向该后代元素)
    // renderer2D.domElement.style.pointerEvents = 'none'


    // const btn = document.getElementById('button2D')
    // // 让btn成为点击事件的目标
    // btn.style.pointerEvents = 'auto'
    // const btn2D = new CSS2DObject(btn)

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
    
    // 
    container.appendChild(dom2DObject.renderer2D.domElement)

    container.appendChild(renderer.domElement)

    camera.position.set(30, 30, 100)

    updateSun()


    // 
    controls.update()

    animate()

    window.addEventListener('resize', onWindowResize)
    // 监听点击事件
    // window.addEventListener('click', onMouseClick)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer2D.setSize( window.innerWidth, window.innerHeight );
  }

  const animate = () => {
    requestAnimationFrame(animate)
    render()
  }

  const render = () => {
    const time = performance.now() * 0.001

    box.position.y = Math.sin( time ) * 20 + 5
    box.rotation.x = time * 0.5
    box.rotation.z = time * 0.51

    // btn.position.y = Math.sin( time ) * 20 + 55
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0

    renderer.render(scene, camera)
    // renderer2D.render(scene, camera)
  }

  // clear  清除导入模型及网格模型缓存
  const clear = () => {
    console.log(water);
    camera.remove()
    renderer.dispose()
    water.material.dispose()
    waterGeometry.dispose()
    boxGeometry.dispose()
    boxMaterial.dispose()
    scene.children.forEach((item) => {
      return item.remove()
    })
  }


  useEffect(() => {
    init()
    const destroyGUI = initGUI(parameters, updateSun, water.material.uniforms)
    return () => {
      window.removeEventListener('resize', onWindowResize)
      // window.removeEventListener('click', onMouseClick)
      destroyGUI()
      // 清除缓存
      clear()
    }
  }, [])

  return (
    <>
      <div id="WebGL-output">
        <div id="button2D">
          <span>PAGE SkyWater</span>
          <button onClick={handleClickBackHome}>back Home</button>
        </div>
      </div>
    </>
  )
}
