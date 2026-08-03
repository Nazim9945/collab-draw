import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });


wss.on("connection",(socket:WebSocket,req:any)=>{
    console.log("user logged in")
})