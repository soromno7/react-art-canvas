import "./paint.scss";
import { GoPencil } from "react-icons/go";
import { GoHorizontalRule } from "react-icons/go";
import { PiTriangle } from "react-icons/pi";
import { GoCircle } from "react-icons/go";
import { PiRectangle } from "react-icons/pi";
import { LuEraser } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
import { TfiSave } from "react-icons/tfi";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import type { IPoint, ToolType } from "./types";

function PaintPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ToolType>("pencil");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<IPoint>({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasContext = canvas.getContext("2d", { willReadFrequently: true });
    if (!canvasContext) return;
    canvasContext.lineCap = "round";
    canvasContext.lineJoin = "round";
    canvasContext.lineWidth = 5;

    saveHistory();
  }, []);

  const getCanvasFunc = () => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    return { canvas, canvasContext };
  };

  const saveHistory = () => {
    const { canvas, canvasContext } = getCanvasFunc();

    if (!canvas || !canvasContext) return;
    const imageData = canvasContext?.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const newHistory = [...history, imageData];

    if (newHistory.length > 20) {
      newHistory.shift();
    }

    setHistory(newHistory);
  };

  const undoHandler = () => {
    if (history.length <= 1) return;

    const { canvas, canvasContext } = getCanvasFunc();
    canvasContext?.putImageData(history[history.length - 2], 0, 0);
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
  };

  const startDrawingHandler = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setStartPoint({ x: offsetX, y: offsetY });
  };

  const stopDrawingHandler = () => {
    if (!isDrawing || !startPoint) return;
    setIsDrawing(false);
    setStartPoint({ x: 0, y: 0 });
    saveHistory();
  };

  const clearCanvasHandler = () => {
    const { canvas, canvasContext } = getCanvasFunc();

    if (!canvasContext || !canvas) return;
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const restoreCanvasHandler = () => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvasContext || !canvas) return;

    if (history.length > 0) {
      canvasContext.putImageData(history[history.length - 1], 0, 0);
    }
  };

  const pencilHandler = (currentPosition: IPoint) => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvas || !canvasContext) return;
    canvasContext.beginPath();
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(currentPosition.x, currentPosition.y);
    canvasContext.lineWidth = brushSize;
    if (tool === "eraser") {
      canvasContext.strokeStyle = "#ffffff";
      console.log("eraser");
    } else {
      canvasContext.strokeStyle = color;
    }
    canvasContext.stroke();
    setStartPoint(currentPosition);
  };

  const lineHandler = (startPoint: IPoint, endPoint: IPoint) => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvas || !canvasContext) return;

    canvasContext.beginPath();
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(endPoint.x, endPoint.y);
    canvasContext.lineWidth = brushSize;
    canvasContext.strokeStyle = color;
    canvasContext.stroke();
  };

  const triangleHandler = (startPoint: IPoint, endPoint: IPoint) => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvas || !canvasContext) return;

    const midPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
    };

    const diffX = endPoint.x - startPoint.x;
    const diffY = endPoint.y - startPoint.y;

    const thirdPoint = {
      x: midPoint.x - diffY * 0.5,
      y: midPoint.y + diffX * 0.5,
    };

    canvasContext.beginPath();
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(endPoint.x, endPoint.y);
    canvasContext.lineTo(thirdPoint.x, thirdPoint.y);
    canvasContext.closePath();
    canvasContext.stroke();
  };

  const circleHandler = (startPoint: IPoint, endPoint: IPoint) => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvas || !canvasContext) return;

    const radius = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2),
    );

    canvasContext.beginPath();
    canvasContext.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
    canvasContext.stroke();
  };

  const rectangleHandler = (startPoint: IPoint, endPoint: IPoint) => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvas || !canvasContext) return;

    const width = endPoint.x - startPoint.x;
    const height = endPoint.y - startPoint.y;

    canvasContext.strokeRect(startPoint.x, endPoint.y, width, height);
  };

  const canvasHandler = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    const { canvas, canvasContext } = getCanvasFunc();

    const { offsetX, offsetY } = e.nativeEvent;
    const currentPosition = { x: offsetX, y: offsetY };

    if (!canvas || !canvasContext) return;

    if (tool === "pencil" || tool === "eraser") {
      pencilHandler(currentPosition);
    } else {
      restoreCanvasHandler();

      canvasContext.save();
      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = brushSize;

      switch (tool) {
        case "line": {
          lineHandler(startPoint, currentPosition);
          break;
        }
        case "triangle": {
          triangleHandler(startPoint, currentPosition);
          break;
        }
        case "circle": {
          circleHandler(startPoint, currentPosition);
          break;
        }
        case "rectangle": {
          rectangleHandler(startPoint, currentPosition);
          break;
        }
      }
    }
  };

  return (
    <div className="paint__wrapper">
      <div className="paint__actions" role="toolbar" aria-label="drawing tools">
        <button className="action__button" onClick={() => setTool("pencil")}>
          <GoPencil size="25px" aria-label="pencil" />
        </button>
        <button className="action__button" onClick={() => setTool("line")}>
          <GoHorizontalRule size="25px" aria-label="line" />
        </button>
        <button className="action__button" onClick={() => setTool("triangle")}>
          <PiTriangle size="25px" aria-label="triangle" />
        </button>
        <button className="action__button" onClick={() => setTool("circle")}>
          <GoCircle size="25px" aria-label="circle" />
        </button>
        <button className="action__button" onClick={() => setTool("rectangle")}>
          <PiRectangle size="25px" aria-label="rectangle" />
        </button>
        <button className="action__button" onClick={() => setTool("eraser")}>
          <LuEraser size="25px" aria-label="eraser" />
        </button>
      </div>
      <div className="paint__container">
        <aside className="paint__aside">
          <button className="action__button">
            <TbArrowBack size="25px" aria-label="undo" onClick={undoHandler} />
          </button>
          <button className="action__button" onClick={clearCanvasHandler}>
            <AiOutlineDelete size="25px" aria-label="clear" />
          </button>
          <button className="action__button">
            <TfiSave size="25px" aria-label="save" />
          </button>
        </aside>
        <main className="paint__canvas">
          <canvas
            width="900px"
            height="600px"
            ref={canvasRef}
            onMouseDown={startDrawingHandler}
            onMouseMove={canvasHandler}
            onMouseUp={stopDrawingHandler}
            onMouseLeave={stopDrawingHandler}
          >
            Use more modern browser to proceed
          </canvas>
        </main>
        <aside className="paint__aside">
          <button className="action__button">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color__input"
            />
          </button>
          <div className="brush-size">
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="brush-size__input"
            />
            <span>{brushSize} px</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PaintPage;
