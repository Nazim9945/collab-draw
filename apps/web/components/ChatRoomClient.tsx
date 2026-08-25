"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { apiInstance } from "../config"






export  function ChatRoomClient({chats,roomId}:{
    chats:{roomId:number,message:string,username:string}[],
    roomId:number
}){
    
const {ws,loading}=useSocket(roomId)
const[message,setMessage]=useState<{roomId:number,message:string,username:string}[]>(chats)
const [noOfUserInRoom,setNoOfUserInRoom]=useState(0)
const[text,setText]=useState("")
const bottomRef=useRef<HTMLDivElement|null>(null)

useEffect(()=>{
   if(ws && !loading){

        ws.onmessage=(message)=>{
           
            const parsed=JSON.parse(message as unknown as string)
            if(parsed.type==='join-room'){
                const data = parsed.data as { noOfUserJoined : number ,roomId:number};
               setNoOfUserInRoom(data.noOfUserJoined);

            }
            else if (parsed.type==='chat'){
                  const data = parsed.data as {
                   message:string,
                    roomId: number;
                    username:string
                  };
                  setMessage(prev=>[...prev,data])
            }
           else if(parsed.type==='leave-room'){
            // do other stuff
           }
            alert(message as unknown as string)
        }
   }
   return ()=>ws?.close()
},[ws,loading])
useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
},[message])
const handleMessage=async(e:FormEvent)=>{
    e.preventDefault()
    const obj=JSON.stringify({
        type:"chat",
        data:{
            roomId:roomId,
            message:text
        }
    })
    const {data:{username}}=await apiInstance.get<{username:string}>('/me');

    setMessage(p=>[...p,{roomId,message:text,username}])
    ws?.send(obj)
    
}
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full bg-red-200 text-black/90 text-2xl flex items-center justify-between gap-3 p-2">
          <div>Chat Section</div>
          <div>No of user: {noOfUserInRoom}</div>
        </div>
        <div className="w-150 h-100 border overflow-y-auto flex flex-col gap-2">
          <div className="flex-1">
            {message.map((mes) => {
              return <div>{mes.message}</div>;
            })}
            <div ref={bottomRef}></div>
          </div>
          <form onSubmit={handleMessage}>
            <input
              type="text"
              placeholder="say Hi..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button>send</button>
          </form>
        </div>
      </div>
    );
}