import { WebSocket, WebSocketServer } from "ws";
import {prisma} from '@repo/db/prisma'
import url from 'url'
import jwt from 'jsonwebtoken'
import {SECRET_KEY} from '@repo/common'
const wss = new WebSocketServer({ port: 8000 });

interface User {
  socket: WebSocket;
  username: string;
}
let allSockets = new Map<string, User[]>();


wss.on("connection",(ws:WebSocket,req:any)=>{

  const token = (url.parse(req.url, true).query).token as string;
  const decode=jwt.verify(token,SECRET_KEY ) as {userId:string}
  if(!decode || !decode.userId){
    ws.close();
    return;
  }
   ws.on("message",(data)=>{
      const parsedData=JSON.parse(data as unknown as string);
      const {userName,roomName}=parsedData.data
      if(parsedData.type==='join-room'){
         
          if(!allSockets.get(roomName)){
             
              allSockets.set(roomName,[{username:userName,socket:ws}])
            

          }
        else{
         allSockets.get(roomName)?.push({socket:ws,username:userName})
          
        }
          const allusers = allSockets.get(roomName);
          allusers?.forEach((user) => {
            user.socket.send(
              JSON.stringify({
                type: "Join-room",
                data: {
                  roomName,
                  noOfUserJoined: allusers.length,
                },
              }),
            );
          });

      }
      else if (parsedData.type === "chat") {
          const message=parsedData.data.message
          const allusers=allSockets.get(roomName);
          allusers?.forEach(user=>{
            if(user.socket!==ws){
                user.socket.send(JSON.stringify({
                  type:'chat',
                  data:{
                    message:message
                  }
                }))
            }
          })
          prisma.chat.create({
            data:{
              userId:decode.userId,
              roomName,
              message:message
            }
          })
      }
      else if (parsedData.type === "leave-room") {
                let allusers = allSockets.get(roomName);
                if(allusers?.length==1){
                    allSockets.delete(roomName)
                }
                else{
                  allusers=allusers?.filter(user=>user.socket===ws);


                 if(allusers)  allSockets.set(roomName, allusers);

                }
                ws.close()
                return;
      }
      return;
     
   })
})