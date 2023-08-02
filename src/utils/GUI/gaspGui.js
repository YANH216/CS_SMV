import * as dat from 'dat.gui'

// 初始化GUI变量控制界面
  // 传入参数对象
export const initGUI = (geometry, fn) => {
  console.log(geometry);
  const gui = new dat.GUI({name: 'MY GUI'})  // GUI名称：name 默认为MY GUI
  if (geometry.name === 'cube') {
    const params = {
      color: '#ffff00',
      fn  // 动画停止与开始
    }

    gui
      .add(geometry.position, 'z')  // add(需要修改的对象<object>, '对象上的哪个属性'<string>)
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
        geometry.material.color.set(value)
      })

    folder.add(geometry, 'visible')
  }

  // 定义GUI销毁函数 闭包
  const destroyGUI = () => {
    gui.destroy()
  }
  return destroyGUI
}