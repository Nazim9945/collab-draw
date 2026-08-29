"use client"

import { useEffect, useRef, useState } from "react";



interface Shape{
    type:"Rect" | "Circle",
    data:{
        x:number,
        y:number,
        height:number,
        width:number
    }
}

export default function random(){
  
   
     const canvasRef=useRef<HTMLCanvasElement | null>(null)
const [shape,setShape]=useState<Shape[]>([])
function clearCanvas(shape:Shape[],ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement){
         ctx.clearRect(0, 0, canvas.width, canvas.height);
          shape.map((sha) => {
            const { x, y, width, height } = sha.data;

            ctx.strokeStyle = "white";
            ctx.strokeRect(x, y, width, height);
          });
}
   
     useEffect(()=>{
        if(canvasRef.current){
            const canvas=canvasRef.current;
            const ctx=canvas.getContext("2d")
             if(ctx){



                    let startX=0;
                    let startY=0;
                   
                    let move=false;
                   
                   clearCanvas(shape,ctx,canvas)
                    canvas.addEventListener("mousedown",(e:MouseEvent)=>{
                       
                        move=true;
                        startX=e.clientX;
                        startY=e.clientY
                        
                    })
                    canvas.addEventListener("mouseup",(e:MouseEvent)=>{
                       
                        move=false;
                        
                        const width=e.clientX - startX;
                        const height=e.clientY - startY
                        console.log(width,height);
                        
                         
                          ctx.strokeStyle="white"
                          ctx.strokeRect(startX, startY, width, height);
                          shape.push({
                            type:"Rect",
                            data:{
                                x:startX,
                                y:startY,
                                width,
                                height
                            }
                          })
                          
                          
                    })

                    canvas.addEventListener("mousemove",(e:MouseEvent)=>{
                     
                       
                        if(move){
                          console.log("heya")
                              const width = e.clientX - startX;
                              const height = e.clientY - startY;
                              clearCanvas(shape, ctx, canvas);
                               ctx.strokeStyle = "white";
                              ctx.strokeRect(startX, startY, width, height);
                        }
                       
                       
                    })

                   
                    

                 
                 
             }
        }
     },[canvasRef])
    return (
      <>
        <canvas   ref={canvasRef} height={559} width={1280} className="bg-black"></canvas>
        
      </>
    );


}