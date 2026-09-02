import { Dispatch, RefObject, SetStateAction } from "react";
import { Shape } from "../../components/CanvasClient";
import { Chat } from "../../components/ChatRoom";

export function clearCanvas(
    shape: Chat[],
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    shape?.map((sha) => {
    
      const parsed = JSON.parse(sha.message) as Shape;
      const { x, y, width, height } = parsed.data;

      ctx.strokeStyle = "white";
      ctx.strokeRect(x, y, width, height);
    });
  }

// export function DrawCanvas(canvasRef: RefObject<HTMLCanvasElement | null>,shape:Chat[],roomId:number,username:string,ws:WebSocket | null,setShape: Dispatch<SetStateAction<Chat[]>>) {
//   const canvas = canvasRef.current;
//   if(!canvas) return;
//   const ctx = canvas.getContext("2d");
//   if (ctx) {
//     let startX = 0;
//     let startY = 0;

//     let move = false;

//     clearCanvas(shape, ctx, canvas);
//     canvas.addEventListener("mousedown", (e: MouseEvent) => {
//       move = true;
//       startX = e.clientX;
//       startY = e.clientY;
//     });
//     canvas.addEventListener("mouseup", (e: MouseEvent) => {
//       move = false;

//       const width = e.clientX - startX;
//       const height = e.clientY - startY;
//       console.log(width, height);

//       ctx.strokeStyle = "white";
//       ctx.strokeRect(startX, startY, width, height);
//       const obj = {
//         type: "chat",
//         data: {
//           message: {
//             type: "Rect",
//             data: {
//               x: startX,
//               y: startY,
//               width,
//               height,
//             },
//           },
//           roomId,
//           username,
//         },
//       };
//     //@ts-ignore
//       setShape((prev) => [
//         ...prev,
//         {
//           message: JSON.stringify({
//             type: "Rect",
//             data: { x: startX, y: startY, width, height },
//           }),
//           roomId,
//           username,
//         },
//       ]);
//       ws?.send(JSON.stringify(obj));
//     });

//     canvas.addEventListener("mousemove", (e: MouseEvent) => {
//       if (move) {
//         const width = e.clientX - startX;
//         const height = e.clientY - startY;
//         clearCanvas(shape, ctx, canvas);
//         ctx.strokeStyle = "white";
//         ctx.strokeRect(startX, startY, width, height);
//       }
//     });
//   }
// }
