import React from 'react'
import { useState, useRef } from 'react'

const Chat = React.memo(() => {
	const socket = new WebSocket('ws://localhost:8080')

	socket.addEventListener('open', () => {
		console.log('welcome')
	})

	const inputChatRef = useRef()
	
	const send = () => {
		socket.send(inputChatRef.current.value)
		inputChatRef.current.value = ""
	}
  return (
    <div>
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
