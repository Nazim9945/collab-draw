
import { Circle, HandGrab, Minus, Pencil, RectangleHorizontal } from "lucide-react";

export function ToolCollection({tool,setTool}:{tool:string,setTool:(tool:string)=>void}) {
  return (
    <div className="absolute h-10 w-60 left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-between gap-2 border rounded-md px-4 py-2 bg-white">
      <div
        onClick={() => {
          setTool("Grab");
        }}
        className={`${tool === "Grab" && "bg-cyan-900/80"} rounded-md p-1`}
      >
        <HandGrab />
      </div>
      <div
        onClick={() => setTool("Rect")}
        className={`${tool === "Rect" && "bg-cyan-900/80"} rounded-md p-1`}
      >
        <RectangleHorizontal />
      </div>
      <div
        onClick={() => setTool("Circle")}
        className={`${tool === "Circle" && "bg-cyan-900/80"} rounded-md p-1`}
      >
        <Circle />
      </div>
      <div
        onClick={() => setTool("Line")}
        className={`${tool === "Line" && "bg-cyan-900/80"} rounded-md p-1`}
      >
        <Minus />
      </div>
      <div
        onClick={() => setTool("Pencil")}
        className={`${tool === "Pencil" && "bg-cyan-900/80"} rounded-md p-1`}
      >
        <Pencil />
      </div>
    </div>
  );
}





