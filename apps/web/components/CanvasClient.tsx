// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "../hooks/useSocket";
// import { Chat } from "./ChatRoom";
// import { clearCanvas } from "../app/service/DrawCanvas";

// export interface Shape {
//   type: "Rect" | "Circle";
//   data: {
//     x: number;
//     y: number;
//     height: number;
//     width: number;
//   };
// }

// export default function CanvasClient({
//   shapes,
//   roomId,
//   username,
// }: {
//   shapes: Chat[];
//   roomId: number;
//   username: string;
// }) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
// //   const { ws, loading } = useSocket(roomId);
//   const [shape, setShape] = useState<Chat[]>(shapes);

//   useEffect(() => {
//     if (canvasRef.current) {

//     //  DrawCanvas(canvasRef,shape,roomId,username,ws,setShape);

//      const canvas = canvasRef.current;

//      const ctx = canvas.getContext("2d");
//      if (ctx) {
//        let startX = 0;
//        let startY = 0;

//        let move = false;

//        clearCanvas(shape, ctx, canvas);

//        canvas.addEventListener("mousedown", (e: MouseEvent) => {
//          move = true;
//          startX = e.clientX;
//          startY = e.clientY;

//        });
//        canvas.addEventListener("mouseup", (e: MouseEvent) => {
//          move = false;

//          const width = e.clientX - startX;
//          const height = e.clientY - startY;

//          ctx.strokeStyle = "white";
//          ctx.strokeRect(startX, startY, width, height);
//          const obj = {
//            type: "chat",
//            data: {
//              message: {
//                type: "Rect",
//                data: {
//                  x: startX,
//                  y: startY,
//                  width,
//                  height,
//                },
//              },
//              roomId,
//              username,
//            },
//          };

//          setShape((prev) => [
//            ...prev,
//            {
//              message: JSON.stringify({
//                type: "Rect",
//                data: { x: startX, y: startY, width, height },
//              }),
//              roomId,
//              username,
//            },
//          ]);
//         // if(ws && !loading)  ws?.send(JSON.stringify(obj));
//        });

//        canvas.addEventListener("mousemove", (e: MouseEvent) => {

//          if (move) {
//            const width = e.clientX - startX;
//            const height = e.clientY - startY;
//            clearCanvas(shape, ctx, canvas);
//            ctx.strokeStyle = "white";
//            ctx.strokeRect(startX, startY, width, height);
//          }
//        });
//      }

//     //  if (ws && !loading) {
//     //    ws.onmessage = (event) => {
//     //      const message = JSON.parse(event.data) as { type: string; data: any };
//     //      if (message.type === "join-room") {
//     //        const data = message.data as {
//     //          roomId: string;
//     //          noOfUserJoined: number;
//     //        };
//     //        console.log(data.noOfUserJoined);
//     //      } else if (message.type === "chat") {
//     //        const { message: shape } = message.data as {
//     //          roomId: number;
//     //          username: string;
//     //          message: Shape;
//     //        };
//     //        setShape((prev) => [
//     //          ...prev,
//     //          {
//     //            message: JSON.stringify(shape),
//     //            roomId,
//     //            username,
//     //          },
//     //        ]);
//     //      }
//     //    };
//     //  }
//     }

//   }, [canvasRef,shape]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-red-900/70">
// //         Trying connecting to websocket...
// //       </div>
// //     );
// //   }
//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         height={500}
//         width={800}
//         className="bg-black"
//       ></canvas>
//     </>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Chat } from "./ChatRoom";
import { clearCanvas } from "../app/service/DrawCanvas";

export interface Shape {
  type: "Rect" | "Circle";
  data: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export default function CanvasClient({
  shapes,
  roomId,
  username,
}: {
  shapes: Chat[];
  roomId: number;
  username: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ws, loading } = useSocket(roomId);

  const [shape, setShape] = useState<Chat[]>(shapes);
//   const shapeRef = useRef<Chat[]>(shapes);

 
  const [size, setSize] = useState({ width: 800, height: 500 });

  


 
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    clearCanvas(shape, ctx, canvas);
  }, [size]);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startX = 0;
    let startY = 0;
    let move = false;

    clearCanvas(shape, ctx, canvas);

    const handleMouseDown = (e: MouseEvent) => {
      move = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      move = false;
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);

      const newShapeObj: Shape = {
        type: "Rect",
        data: { x: startX, y: startY, width, height },
      };

      setShape((prev) => [
        ...prev,
        {
          message: JSON.stringify(newShapeObj),
          roomId,
          username,
        },
      ]);

      const obj = {
        type: "chat",
        data: {
          message: newShapeObj,
          roomId,
          username,
        },
      };

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(obj));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!move) return;
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(shape, ctx, canvas); // always latest shapes
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [roomId, username, ws,shape]);

  // --- Websocket receive: separate effect, re-attaches only when ws changes ---
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as { type: string; data: any };

        if (message.type === "join-room") {
          const data = message.data as {
            roomId: string;
            noOfUserJoined: number;
          };
          console.log(data.noOfUserJoined);
        } else if (message.type === "chat") {
          const {
            message: incomingShape,
            roomId: msgRoomId,
            username: senderUsername,
          } = message.data as {
            roomId: number;
            username: string;
            message: Shape;
          };

       

          setShape((prev) => [
            ...prev,
            {
              message: JSON.stringify(incomingShape),
              roomId: msgRoomId,
              username: senderUsername,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws, username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-red-900/70">
        Trying connecting to websocket...
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      height={size.height}
      width={size.width}
      className="bg-black"
    />
  );
}