import { apiInstance } from "../config";

async function getLatestChat(roomId: number) {
  const res = await apiInstance.get(`/room/${roomId}`);
  console.log(res.data);
  return res.data;
}

export async function ChatRoom({ roomId }: { roomId: number }) {
  const latestChats = await getLatestChat(roomId);
  return <ChatRoomClient chats={latestChats} />;
}
