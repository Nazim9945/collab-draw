import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });


wss.on("connection",(ws:WebSocket,req:any)=>{
   ws.on("message",(mes)=>{
    ws.send("pong")
   })
})