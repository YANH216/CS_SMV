import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Styles from './Dialog.module.css'

export default function Loading(props) {
  const node = document.createElement('div')
  useEffect(() => {
    // 在严格模式下会产生副作用的钩子函数会执行两次，如此处
    // 但在外部的只会执行一次。
    // 如下面语句写在外部，当第一次执行时，由于严格模式原因，会执行组件卸载生命周期中的方法。
    // 移除node节点之后，第二次执行时，上次已经移除节点，但没有重新添加节点，故严格模式下会报错
    // 非严格模式下，写在外部正常运行
    document.body.appendChild(node)
    return () => 
      {
        document.body.removeChild(node)
        console.log('unmount');
      }
  }, []) 
  return createPortal(
    <div className={Styles.dialog}>
      <div className="content">{props.content}</div>
    </div>,
    node
  )
}
