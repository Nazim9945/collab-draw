"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { ToolCollection } from "./ToolCollection";
import { Canvas } from "../app/service/Canvas";

export default function CanvasClient({
  roomId,
  username,
}: {
  roomId: number;
  username: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ws, loading } = useSocket(roomId);
  const [tool, setTool] = useState("Rect");
  const canvasBoardRef = useRef<Canvas | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });

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
    canvasBoardRef.current?.clearCanvas();
    canvasBoardRef.current?.renderExistingShape();
  }, [size]);

  useEffect(() => {
    if (canvasRef.current && ws && !loading) {
      canvasBoardRef.current = new Canvas(
        canvasRef.current,
        roomId,
        username,
        tool,
        ws,
      );
    }

    return () => {
      canvasBoardRef.current?.destroy();
      canvasBoardRef.current = null;
    };
  }, [roomId, username, ws, loading]);

  useEffect(() => {
    canvasBoardRef.current?.setTool(tool);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = tool === "Grab" ? "grab" : "crosshair";
    }
  }, [tool]);



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
      <ToolCollection  tool={tool} setTool={setTool} />
    </>
  );
}
