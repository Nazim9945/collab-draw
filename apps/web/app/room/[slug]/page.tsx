
import { apiInstance } from "../../../config";
import { ChatRoom } from "../../../components/ChatRoom";
import { cookies } from "next/headers";


async function getRoomId(slug: string) {
 const cookieHeader = (await cookies()).toString();
  console.log(`/getroomId?slug=${slug}`);
  const res = await apiInstance.get(`/getroomId?slug=${slug}`,{
    headers:{
      cookie:cookieHeader
    }
  });
 return res?.data.data
  
}

export default async function  page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);
  

  return <ChatRoom roomId={roomId}/>;
}
