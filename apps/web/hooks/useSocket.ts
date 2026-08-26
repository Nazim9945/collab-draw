import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Cookies from "js-cookie";

export function useSocket(roomId: number) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token") as string;
  useEffect(() => {
    console.log("how many times");
    setLoading(true);
    const wss = new WebSocket(`${WS_URL}`, [token]);
    let active = true;
    wss.onopen = () => {
      if (!active) return;
      setLoading(false);
      setWs(wss);
      wss.send(
        JSON.stringify({
          type: "join-room",
          data: {
            roomId: roomId,
          },
        }),
      );
    };
    return () => {
      active = false;
      wss.close();
      setWs((current) => (current === wss ? null : current));
    };
  }, [roomId, token]);
  return { ws, loading };
}
