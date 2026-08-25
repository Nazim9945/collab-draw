"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"





export  function ChatRoomClient({chats,roomId}:{
    chats:any,
    roomId:number
}){
    
const {ws,loading}=useSocket(roomId)
const[message,setMessage]=useState<{roomId:string,message:string}[]>([])
console.log("websocket mes : ",message);
console.log("chats fetched from http : ",chats)
useEffect(()=>{
   if(ws && !loading){

        ws.onmessage=(message)=>{
            const parsed=JSON.parse(message as unknown as string)
            if(parsed.type==='chat'){
                const data=parsed.data;
                setMessage(prev=>[...prev,data])

            }
            
        }
   }
   return ()=>ws?.close()
},[ws,loading])


    return <div>
        chats section
    </div>
}