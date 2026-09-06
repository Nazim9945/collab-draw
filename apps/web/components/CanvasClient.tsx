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
import { ToolCollection } from "./ToolCollection";

export type Shape =
  | {
      type: "Rect";
      data: {
        x: number;
        y: number;
        height: number;
        width: number;
      };
    }
  | {
      type: "Circle";
      data: {
        centerX: number;
        centerY: number;
        radius: number;
      };
    }
  | {
      type: "Line";
      data: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
      };
    }
  | {
      type: "Pencil";
      data: {
        pencilPoints:{x:number,y:number}[]
      };
    };

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
  const [tool,setTool]=useState("Rect")

  const [shape, setShape] = useState<Chat[]>(shapes);
  console.log("selected tool: ",tool)
//   const shapeRef = useRef<Chat[]>(shapes);

 
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  


 
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
    let pencilPoints:{x:number,y:number}[]=[]
    clearCanvas(shape, ctx, canvas);

    const handleMouseDown = (e: MouseEvent) => {
      move = true;
      startX = e.clientX;
      startY = e.clientY;
      if(tool==='Pencil'){
        pencilPoints = [{ x: startX, y: startY }];
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      move = false;
      const width = e.clientX - startX;
      const height = e.clientY - startY;
let newShapeObj: Shape;
     if(tool==='Rect'){
       ctx.strokeStyle = "white";
       ctx.strokeRect(startX, startY, width, height);

        newShapeObj = {
         type: "Rect",
         data: { x: startX, y: startY, width, height },
       };
     }
     else if (tool==='Circle'){
       ctx.strokeStyle = "white";
      
       const X = Math.abs(width / 2 + startX);
       const Y = Math.abs(height / 2 + startY);
       const radius = Math.abs(Math.max(width / 2, height / 2));
        ctx.beginPath();
       ctx.arc(X, Y, radius, 0, 2 * Math.PI);
       ctx.stroke();
        newShapeObj = {
          type: "Circle",
          data: { centerX: X, centerY: Y, radius }
        };
     }
     else if(tool==='Line'){
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(e.clientX, e.clientY);
          ctx.stroke();
            newShapeObj = {
              type: "Line",
              data: { startX, startY, endX: e.clientX, endY: e.clientY },
            };
           
     }
     else if(tool==='Pencil'){
    
       ctx.beginPath(); // begin

       // @ts-ignore
       ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);

       for (let i = 1; i < pencilPoints.length; i++) {
         // @ts-ignore
         ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
       }

       ctx.stroke(); // draw it!
       newShapeObj = {
         type: "Pencil",
         data: { pencilPoints },
       };
     }
   
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
          message: newShapeObj!,
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
      
     if(tool==='Rect'){
       ctx.strokeStyle = "white";
       ctx.strokeRect(startX, startY, width, height);
     }
     else if (tool==='Circle'){
      const X =Math.abs( width / 2 + startX);
      const Y = Math.abs(height / 2 + startY);
      const radius = Math.abs(Math.max(width / 2, height / 2));
       ctx.beginPath();
       ctx.arc(X, Y, radius, 0, 2 * Math.PI);
       ctx.stroke();
     }
     else if(tool==='Line'){
         ctx.beginPath();
         ctx.moveTo(startX, startY);
         ctx.lineTo(e.clientX,e.clientY)
         ctx.stroke();
     }
     else if(tool==='Pencil'){
      
      pencilPoints.push({ x: e.clientX, y: e.clientY });
     
       ctx.beginPath(); // begin


  // @ts-ignore
       ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
     
      for (let i = 1; i < pencilPoints.length; i++) {
        // @ts-ignore
        ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
      }
      
        
       ctx.stroke(); // draw it!
     }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [roomId, username, ws,shape,tool]);

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
    // ws.onmessage=handleMessage
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
    <>
      <canvas
        ref={canvasRef}
        height={size.height}
        width={size.width}
        className="bg-black"
      />
     <ToolCollection tool={tool} setTool={setTool}/>
    </>
  );
}