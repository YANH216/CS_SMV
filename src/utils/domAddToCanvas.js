import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


// 将一般dom元素转换成2D dom元素
export const domAddToCanvas = ({dom, renderer2D}) => {

  renderer2D.setSize(window.innerWidth, window.innerHeight)
  renderer2D.domElement.style.position = 'absolute'
  renderer2D.domElement.style.top = '0px'
  // 让CSS2DRenderer的dom元素不会成为点击事件的目标(当后代元素设置该属性值,鼠标点击事件会直接指向该后代元素)
  renderer2D.domElement.style.pointerEvents = 'none'

  dom.style.pointerEvents = 'auto'
  dom.style.backgroundColor = '#FFF'
  const dom2D = new CSS2DObject(dom)

  return {dom2D, renderer2D}
}
