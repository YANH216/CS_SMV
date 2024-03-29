import React from 'react'
import { useState, useRef } from 'react'
import socket from '../../../ws'
import styles from './Chat.module.css'

const Chat = React.memo(() => {

	socket.addEventListener('open', () => {
		console.log('welcome')
	})

	const inputChatRef = useRef()
	
	const send = () => {
		socket.send(inputChatRef.current.value)
		inputChatRef.current.value = ""
	}
  return (
    <div className={styles.chatContent}>
      <input 
        type="text" 
        className="input" 
				placeholder='输入要发送的内容'
				ref={inputChatRef}
      />
      <button className="btn" onClick={send}>send</button>
    </div>
  )
})

export default Chat
