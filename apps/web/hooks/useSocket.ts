import { useEffect, useState } from "react";
import { WS_URL } from "../config";



export function useSocket(){
    const [ws,setWs]=useState<WebSocket | null>(null);
const [loading,setLoading]=useState(false)

    useEffect(()=>{
        setLoading(true)
        const wss=new WebSocket(`${WS_URL}`)
        wss.onopen=()=>{
            setLoading(false);
            setWs(wss)
        }
       

    },[])
    return {ws,loading}



    
}