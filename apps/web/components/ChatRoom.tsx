import { cookies } from "next/headers";
import { apiInstance } from "../config";
import CanvasClient from "./CanvasClient";



export async function ChatRoom({ roomId }: { roomId: number }) {
  const cookieHeader = (await cookies()).toString();
  const {
    data: { username },
  } = await apiInstance.get<{ username: string }>("/me", {
    headers: {
      cookie: cookieHeader,
    },
  });
  return <CanvasClient roomId={roomId} username={username} />;
}
