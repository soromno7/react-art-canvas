import "./paint.scss";
import { GoPencil } from "react-icons/go";
import { IoColorFillOutline } from "react-icons/io5";
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
  const [currentPoint, setCurrentPoint] = useState<IPoint>({ x: 0, y: 0 });

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

  useEffect(() => {
    console.log(history);
  }, [history]);

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
    console.log(history);

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
    setCurrentPoint({ x: offsetX, y: offsetY });
  };

  const stopDrawingHandler = () => {
    if (!isDrawing || !startPoint) return;
    setIsDrawing(false);
    setStartPoint({ x: 0, y: 0 });
    setCurrentPoint({ x: 0, y: 0 });
    saveHistory();
  };

  const clearCanvasHandler = () => {
    const { canvas, canvasContext } = getCanvasFunc();

    if (!canvasContext || !canvas) return;
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const pencilHandler = (currentPosition: IPoint) => {
    const { canvas, canvasContext } = getCanvasFunc();
    if (!canvas || !canvasContext) return;
    canvasContext.beginPath();
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(currentPosition.x, currentPosition.y);
    canvasContext.stroke();
    setStartPoint(currentPosition);
  };

  const canvasHandler = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    const { canvas, canvasContext } = getCanvasFunc();

    const { offsetX, offsetY } = e.nativeEvent;
    const currentPosition = { x: offsetX, y: offsetY };

    if (!canvas || !canvasContext) return;

    if (tool === "pencil" || tool === "eraser") {
      pencilHandler(currentPosition);
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
        <button className="action__button" onClick={() => setTool("fill")}>
          <IoColorFillOutline size="25px" aria-label="fill" />
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
      </div>
    </div>
  );
}

export default PaintPage;
