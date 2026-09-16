
import { apiInstance } from "../../config";

export interface Chat {
  message: string;
  roomId: number;
  username: string;
}
interface chatRes {
  success: boolean;
  data: Chat[];
}
export async function getRoomAllShapes(roomId: number) {
  const res = await apiInstance.get<chatRes>(`/room/${roomId}`);

  return res.data.data;
}