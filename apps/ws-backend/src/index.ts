import { WebSocket, WebSocketServer } from "ws";
import {prisma} from '@repo/db/prisma'
import jwt from 'jsonwebtoken'
import {SECRET_KEY} from '@repo/common'
const wss = new WebSocketServer({ port: 3002 });

interface User {
  socket: WebSocket;
  username: string;
}
let allSockets = new Map<number, User[]>();


wss.on("connection",async(ws:WebSocket,req:any)=>{

  
 
  
 
  const token = req.headers.cookie.split("token=")[1];
  if(!token){
    console.log("ws token is missing")
    return ws.close();
  }
 
  const decode=jwt.verify(token,SECRET_KEY) as {userId:number}
  console.log(decode)
  if(!decode || !decode.userId){
    console.log("error while decoding at ws")
    ws.close();
    return;
  }
//   const userDetails=await prisma.user.findFirst({
//     where:{
//       id:decode.userId
//     },
//     select:{
//       username:true
//     }
//   })
//   if(!userDetails){
//     console.log("ws->found no user details")
//     return ws.close()
//   }
//  console.log(userDetails.username)
   ws.on("message",async(data)=>{
      const parsedData=JSON.parse(data as unknown as string) as {type:string,data:{
        roomId:number,
        message?:string,
        username:string
      }};
      console.log(parsedData)
    
      const {roomId,username}=parsedData.data
      if(parsedData.type==='join-room'){
         
          if(!allSockets.get(roomId)){
             
              allSockets.set(roomId,[{username:username,socket:ws}])
            

          }
        else{
          // edge case what if user try to join the room again
          // check is this user already been in this room if yes ignore if no then proceed as it is
          const allUser=allSockets.get(roomId);
          const isExist=allUser?.find(user=>user.socket===ws)
          if(!isExist){
             allSockets.get(roomId)?.push({ socket: ws, username: username });
          }


        
          
        }
          const allusers = allSockets.get(roomId);
          allusers?.forEach((user) => {
            user.socket.send(
              JSON.stringify({
                type: "join-room",
                data: {
                  roomId,
                  noOfUserJoined: allusers.length,
                },
              }),
            );
          });

      }
      else if (parsedData.type === "chat") {
          const message=parsedData.data.message || ""
          const allusers=allSockets.get(roomId);
          allusers?.forEach(user=>{
            if(user.socket!==ws){
                user.socket.send(JSON.stringify({
                  type:'chat',
                  data:{
                    message:message,
                    roomId:roomId,
                    username
                  }
                }))
            }
          })
         await  prisma.chat.create({
            data:{
              userId:decode.userId,
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
                  allusers=allusers?.filter(user=>user.socket!==ws);


                 if(allusers)  allSockets.set(roomId, allusers);

                }
                // notified the client first then close the connection-->pending...
                ws.close()
                return;
      }
   
      return;
     
   })
})