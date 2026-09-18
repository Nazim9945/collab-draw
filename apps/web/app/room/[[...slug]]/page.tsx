
import { apiInstance } from "../../../config";
import { ChatRoom } from "../../../components/ChatRoom";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";


async function getRoomId(slug: string) {
try {
  const cookieHeader = (await cookies()).toString();
  const res = await apiInstance.get(`/getroomId?slug=${slug}`, {
    headers: { cookie: cookieHeader },
  });
  return res?.data?.data;
} catch (error: any) {
  // If the backend API explicitly says the slug is bad (404/400)
  if (error.response?.status === 404 || error.response?.status === 400) {
    return null;
  }
  throw error; // Let network drops or 500s hit your error.tsx boundary
}
  
}

export default async function  page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);
  if(!roomId){
    notFound()
  }

  return <ChatRoom roomId={roomId}/>;
}
