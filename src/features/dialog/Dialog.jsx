import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Styles from './Dialog.module.css'

export default function Loading(props) {
  const node = document.createElement('div')
  document.body.appendChild(node)
  useEffect(() => {
    return () => {
      document.body.removeChild(node)
    }
  }, []) 
  return createPortal(
    <div className={Styles.dialog}>
      <div className="content">{props.content}</div>
    </div>,
    node
  )
}
