import { cookies } from "next/headers";
import { apiInstance } from "../config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getLatestChat(roomId: number) {
  const cookieHeader = (await cookies()).toString();
  console.log(roomId);
  let res = await apiInstance.get(`/room/${roomId}`, {
    headers: {
      cookie: cookieHeader,
    },
  });

  return res?.data.data;
}

export async function ChatRoom({ roomId}: { roomId: number }) {
  const cookieHeader = (await cookies()).toString();
  const latestChats = await getLatestChat(roomId);
   const {
     data: { username },
   } = await apiInstance.get<{ username: string }>("/me", {
     headers: {
       cookie: cookieHeader,
     },
   });
  return <ChatRoomClient chats={latestChats} roomId={roomId} username={username}/>;
}
