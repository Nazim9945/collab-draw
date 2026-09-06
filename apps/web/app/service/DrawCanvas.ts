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
      if(parsed.type==='Rect'){
          const { x, y, width, height } = parsed.data;

          ctx.strokeStyle = "white";
          ctx.strokeRect(x, y, width, height);
      }
      else if(parsed.type==='Circle'){
        const {centerX,centerY,radius}=parsed.data
         ctx.beginPath();
         ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
         ctx.stroke();
      }
      else if(parsed.type==='Line'){
        const { startX, startY,endX,endY } = parsed.data;
        ctx.beginPath(); 
        ctx.moveTo(startX, startY); 
        ctx.lineTo(endX, endY); 
        ctx.stroke(); 
      }
      else if(parsed.type==='Pencil'){
        const {pencilPoints}=parsed.data
     
        ctx.beginPath(); // begin

        // @ts-ignore
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);

        for (let i = 1; i < pencilPoints.length; i++) {
          // @ts-ignore
          ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }

        ctx.stroke(); // draw it!
      }
      
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
