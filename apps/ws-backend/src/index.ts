import { WebSocket, WebSocketServer } from "ws";
import {prisma} from '@repo/db/prisma'
const wss = new WebSocketServer({ port: 8000 });


wss.on("connection",(ws:WebSocket,req:any)=>{
   ws.on("message",(mes)=>{
       prisma.user.create({
         data: {
           username: Math.random.toString(),
           password: Math.random.toString(),
           email:Math.random.toString()
         },
       });
    ws.send("pong")
   })
})