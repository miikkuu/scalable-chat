'use client'

import React, { useCallback, useEffect, useState } from "react"
import { io ,Socket} from "socket.io-client"

interface SocketProviderProps {
    children ? : React.ReactNode
}
interface ISocketContext {
    sendMessage : (message : string) => any
    messages : string []
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
    const context = React.useContext(SocketContext)
    if (!context) {
        throw new Error('state error , useSocket must be used within a SocketProvider')
    }
    return context
}

export const SocketProvider : React.FC<SocketProviderProps> = ({children}) => {

    const [socket , setSocket] = useState<Socket>();
    const [messages,setMessages] = useState<string []>([])
    
    const sendMessage : ISocketContext['sendMessage'] = useCallback((msg: string)=>{
        
        if(socket)
            {
                socket.emit('event:message',{message:msg})
            }

        console.log('sending message:',msg)

    } ,[socket])

    const onMessageRec = useCallback((msg: string)=>{

        const newmessage= JSON.parse(msg) as {message : string , socketID : string}
        

        console.log('message received from redis upon subscribtion: ',newmessage)
        setMessages((prevMessages) => [...prevMessages, newmessage.message])
        
           
    }
    ,[])

    useEffect(() => {
        console.log('SocketProvider is mounting');
    
        const socket = io('http://localhost:8000');
        setSocket(socket);
        
    
        socket.on('connect', () => {
            console.log(socket.id,'connected to server');
        });
        socket.on('message', onMessageRec);

    
        return () => {
            socket.disconnect();
            socket.off('message', onMessageRec);
            setSocket(undefined);
            console.log(socket.id, 'disconnected from server');
        }; // cleanup function to disconnect the socket when the component unmounts
    }, []);


    return (
        <SocketContext.Provider value={{sendMessage,messages}}> 
            {children}
        </SocketContext.Provider>
    )

}