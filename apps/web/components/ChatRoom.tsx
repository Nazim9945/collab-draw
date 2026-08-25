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
  const latestChats = await getLatestChat(roomId);
  return <ChatRoomClient chats={latestChats} roomId={roomId}/>;
}
