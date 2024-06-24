'use client'

import React, { useCallback, useEffect, useState } from "react"
import classes from './page.module.css'
import { useSocket } from "../context/SocketProvider"

export default function Page ()

{

const {sendMessage , messages} = useSocket()
const [message, setMessage] = useState('')

  return (
    <div>
      <div>
        <h1>Scalable ChatApp</h1>
      </div>

      <div>
        <input onChange={e => setMessage(e.target.value)} className={classes['chat-input']} type="text" placeholder="Enter your message" />
        <button onClick={e => sendMessage(message)} className={classes['button']}>Send</button>
      </div>

      <div>
      
        <ul className={classes['chat-box']}>
          {messages.map((msg,index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
</div>
  )
}