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
let allSockets = new Map<number, User[]>();


wss.on("connection",(ws:WebSocket,req:any)=>{

  const token = (url.parse(req.url, true).query).token as string;
 
  // const decode=jwt.verify(token,SECRET_KEY) as {userId:string}
  // console.log(decode)
  // if(!decode || !decode.userId){
  //   ws.close();
  //   return;
  // }
  console.log("1")
   ws.on("message",(data)=>{
      const parsedData=JSON.parse(data as unknown as string);
      console.log(parsedData)
      const {username:userName,roomId}=parsedData.data
      if(parsedData.type==='join-room'){
         
          if(!allSockets.get(roomId)){
             
              allSockets.set(roomId,[{username:userName,socket:ws}])
            

          }
        else{
         allSockets.get(roomId)?.push({socket:ws,username:userName})
          
        }
          const allusers = allSockets.get(roomId);
          allusers?.forEach((user) => {
            user.socket.send(
              JSON.stringify({
                type: "Join-room",
                data: {
                  roomId,
                  noOfUserJoined: allusers.length,
                },
              }),
            );
          });

      }
      else if (parsedData.type === "chat") {
          const message=parsedData.data.message
          const allusers=allSockets.get(roomId);
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
              userId:1,
              roomId,
              message:message
            }
          })
      }
      else if (parsedData.type === "leave-room") {
                let allusers = allSockets.get(roomId);
                if(allusers?.length==1){
                    allSockets.delete(roomId)
                }
                else{
                  allusers=allusers?.filter(user=>user.socket===ws);


                 if(allusers)  allSockets.set(roomId, allusers);

                }
                ws.close()
                return;
      }
    ws.send("pong")
      return;
     
   })
})