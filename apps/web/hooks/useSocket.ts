import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Cookies from "js-cookie";


export function useSocket(roomId:number){
    const [ws,setWs]=useState<WebSocket | null>(null);
const [loading,setLoading]=useState(false)
 const token = Cookies.get("token") as string;
    useEffect(()=>{
        setLoading(true)
        const wss=new WebSocket(`${WS_URL}`,[token])
        wss.onopen=()=>{
            setLoading(false);
            setWs(wss)
            wss.send(JSON.stringify({
                type:"join-room",
                data:{
                    roomId:roomId
                }
            }))
        }
       

    },[])
    return {ws,loading}



    
}