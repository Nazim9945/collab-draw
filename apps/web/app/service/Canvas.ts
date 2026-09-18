import { getRoomAllShapes } from "./AllHttpCall";

type Shape =
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
        pencilPoints: { x: number; y: number }[];
      };
    };

export interface shapeMess {
  message: string;
  roomId: number;
  username: string;
}

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShape: shapeMess[];
  private roomId: number;
  private move: boolean;
  private startX: number;
  private startY: number;
  private offsetX: number;
  private offsetY: number;
  private tool: string;
  private isPanning: boolean;
  private lastPanX: number;
  private lastPanY: number;
  private pencilPoints: { x: number; y: number }[];
  private ws: WebSocket;
  private username: string;

  constructor(
    canvas: HTMLCanvasElement,
    roomId: number,
    username: string,
    tool: string,
    ws: WebSocket,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShape = [];
    this.roomId = roomId;
    this.move = false;
    this.startX = 0;
    this.startY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.tool = "Rect";
    this.isPanning = false;
    this.lastPanX = 0;
    this.lastPanY = 0;
    this.pencilPoints = [];
    this.username = username;
    this.tool = tool;
    this.ws = ws;
    this.init();
    this.initSocketHandler();
    this.initMouseHandler();
  }
  async init() {
   

    this.existingShape = await getRoomAllShapes(this.roomId);

    this.renderExistingShape();
  }
  panning() {
    this.renderCanvas();
  }

  renderCanvas() {
    this.clearCanvas();
   
    // this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
    this.renderExistingShape();
    
  }

  getCanvasPoint(e: MouseEvent) {
   

    return {
      x: e.clientX  - this.offsetX,
      y: e.clientY  - this.offsetY,
    };
  }
  setTool(tool: string) {
    this.tool = tool;
  }

  socketMessageHandler = (event: MessageEvent) => {
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

        this.existingShape = [
          ...this.existingShape,
          {
            message: JSON.stringify(incomingShape),
            roomId: msgRoomId,
            username: senderUsername,
          },
        ];
        this.renderCanvas();
      }
    } catch (err) {
      console.error("Failed to parse websocket message:", err);
    }
  };
  initSocketHandler() {
    if (this.ws) {
      this.ws.addEventListener("message", this.socketMessageHandler);
    }
  }
  removeSocketHandler() {
    if (this.ws && this.socketMessageHandler) {
      this.ws.removeEventListener("message", this.socketMessageHandler);
    }
  }
  clearCanvas() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.fillStyle = "black";
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
  renderExistingShape() {
    this.existingShape?.map((sha) => {
      const parsed = JSON.parse(sha.message) as Shape;
      if (parsed.type === "Rect") {
        const { x, y, width, height } = parsed.data;

        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(x, y, width, height);
      } else if (parsed.type === "Circle") {
        const { centerX, centerY, radius } = parsed.data;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
      } else if (parsed.type === "Line") {
        const { startX, startY, endX, endY } = parsed.data;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
      } else if (parsed.type === "Pencil") {
        const { pencilPoints } = parsed.data;

        this.ctx.beginPath(); // begin

        // @ts-ignore
        this.ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);

        for (let i = 1; i < pencilPoints.length; i++) {
          // @ts-ignore
          this.ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }

        this.ctx.stroke(); // draw it!
      }
    });
  }
  handleMouseDown = (e: MouseEvent) => {
  
    this.move = true;
    if (this.tool === "Grab") {
        e.preventDefault();
      this.isPanning = true;
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      return;
    }

    const point = this.getCanvasPoint(e);
    this.startX = point.x;
    this.startY = point.y;
    if (this.tool === "Pencil") {
      this.pencilPoints = [{ x: this.startX, y: this.startY }];
    }
  };
  handleMouseUp = (e: MouseEvent) => {
    this.move = false;

    if (this.isPanning && this.tool === "Grab") {
      this.isPanning = false;
      this.lastPanX=0;
      this.lastPanY=0;
      

      return;
    }
    const point = this.getCanvasPoint(e);
    const width = point.x - this.startX;
    const height = point.y - this.startY;
    let newShapeObj: Shape;
    if (this.tool === "Rect") {
      newShapeObj = {
        type: "Rect",
        data: { x: this.startX, y: this.startY, width, height },
      };
    } else if (this.tool === "Circle") {
      const X = width / 2 + this.startX;
      const Y = height / 2 + this.startY;
      const radius = Math.abs(Math.max(width / 2, height / 2));
      newShapeObj = {
        type: "Circle",
        data: { centerX: X, centerY: Y, radius },
      };
    } else if (this.tool === "Line") {
      newShapeObj = {
        type: "Line",
        data: {
          startX: this.startX,
          startY: this.startY,
          endX: point.x,
          endY: point.y,
        },
      };
    } else if (this.tool === "Pencil") {
      newShapeObj = {
        type: "Pencil",
        data: { pencilPoints: this.pencilPoints },
      };
    }

    this.existingShape = [
      ...this.existingShape,
      {
        message: JSON.stringify(newShapeObj!),
        roomId: this.roomId,
        username: this.username,
      },
    ];
    this.renderCanvas();
    const obj = {
      type: "chat",
      data: {
        message: newShapeObj!,
        roomId: this.roomId,
        username: this.username,
      },
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    }
  };
  handleMouseMove = (e: MouseEvent) => {
   
    if (this.isPanning && this.tool === "Grab") {
      const dx = e.clientX - this.lastPanX;
      const dy = e.clientY - this.lastPanY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      this.panning();

      return;
    }
    if(!this.move) return
    const point = this.getCanvasPoint(e);
    const width = point.x - this.startX;
    const height = point.y - this.startY;

    this.renderCanvas();
    // this.clearCanvas();
    // this.renderExistingShape()

    if (this.tool === "Rect") {
      this.ctx.strokeStyle = "white";

      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.tool === "Circle") {
      const X = width / 2 + this.startX;
      const Y = height / 2 + this.startY;
      const radius = Math.abs(Math.max(width / 2, height / 2));
      this.ctx.beginPath();
      this.ctx.arc(X, Y, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    } else if (this.tool === "Line") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    } else if (this.tool === "Pencil") {
      this.pencilPoints.push(point);

      this.ctx.beginPath(); // begin

      // @ts-ignore
      this.ctx.moveTo(this.pencilPoints[0].x, this.pencilPoints[0].y);

      for (let i = 1; i < this.pencilPoints.length; i++) {
        // @ts-ignore
        this.ctx.lineTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
      }

      this.ctx.stroke(); // draw it!
    }
  };
  initMouseHandler() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }
  destroy() {
    this.removeSocketHandler();
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }
}
