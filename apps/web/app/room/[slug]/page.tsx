import axios from "axios";
import { apiInstance } from "../../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
  const res = await apiInstance.get(`/room/${slug}`);
  return res.data.id;
}
export async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);

  return <ChatRoom roomId={roomId} />;
}
