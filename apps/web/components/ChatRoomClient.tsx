import { useEffect } from "react"
import { useSocket } from "../hooks/useSocket"





async function ChatRoomClient({chats}:{
    chats:any
}){
const {ws,loading}=useSocket()
useEffect(()=>{
   if(ws && !loading){
        
   }
},[ws,loading])


    return <div>chats</div>
}