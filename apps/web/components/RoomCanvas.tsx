"use client"

import { useEffect, useRef, useState } from "react";
import { Chat } from "./ChatRoom";
import { useSocket } from "../hooks/useSocket";




export function RoomCanvas({
    chats,
    roomId
}:{
     chats: Chat[];
      roomId: number;
}){
    //  const { ws, loading } = useSocket(roomId);
    //   const [message, setMessage] =
    //     useState<Chat[]>(chats);
   
     const canvasRef=useRef<HTMLCanvasElement | null>(null)

    //   if(loading){
    //         return <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-red-900/70">Trying connecting to websocket...</div>
    //   }
     useEffect(()=>{
        if(canvasRef.current){
            const canvas=canvasRef.current;
            const ctx=canvas.getContext("2d")
             if(ctx){
                 ctx.fillStyle = "red";
                 ctx.fillRect(10, 10, 150, 75);
             }
        }
     },[canvasRef])
    return <canvas ref={canvasRef} className="min-h-screen min-w-screen overflow-hidden"></canvas>


}