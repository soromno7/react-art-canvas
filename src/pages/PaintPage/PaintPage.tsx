import "./paint.scss";
import { TbArrowBack } from "react-icons/tb";
import { TfiSave } from "react-icons/tfi";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import type { IPoint, ToolType } from "./types";
import ToolButton, { DRAWING_TOOLS } from "./components/ToolButton";
import {
  circleHandler,
  lineHandler,
  pencilHandler,
  rectangleHandler,
  triangleHandler,
} from "./components/CanvasFunc";
import { useAuth } from "../../supabase/useAuth";
import { saveDrawingToSupabase } from "../../supabase/supabaseService";
import { useNavigate } from "react-router-dom";

function PaintPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ToolType>("pencil");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<IPoint>({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paintTitle, setPaintTitle] = useState("");

  const [history, setHistory] = useState<ImageData[]>([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasContext = canvas.getContext("2d", { willReadFrequently: true });
    if (!canvasContext) return;
    canvasContext.lineCap = "round";
    canvasContext.lineJoin = "round";
    canvasContext.lineWidth = 5;

    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  }, []);

  const saveHandler = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !user) return;

    const userName = user?.email || "Anonymous";

    const result = await saveDrawingToSupabase(
      user.id,
      userName,
      paintTitle,
      canvas,
    );

    if (!result.success) {
      console.log(result.error);
    }

    console.log(result);
    setIsModalOpen(false);
    navigate('/')
  };

  const modalHandler = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

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

  const canvasHandler = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    const { canvas, canvasContext } = getCanvasFunc();

    const { offsetX, offsetY } = e.nativeEvent;
    const currentPosition = { x: offsetX, y: offsetY };

    if (!canvas || !canvasContext) return;

    if (tool === "pencil" || tool === "eraser") {
      pencilHandler(
        startPoint,
        currentPosition,
        canvasContext,
        brushSize,
        color,
        tool,
        setStartPoint,
      );
    } else {
      restoreCanvasHandler();

      canvasContext.save();
      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = brushSize;

      switch (tool) {
        case "line": {
          lineHandler(
            startPoint,
            currentPosition,
            canvasContext,
            brushSize,
            color,
          );
          break;
        }
        case "triangle": {
          triangleHandler(
            startPoint,
            currentPosition,
            canvasContext,
            brushSize,
            color,
          );
          break;
        }
        case "circle": {
          circleHandler(
            startPoint,
            currentPosition,
            canvasContext,
            brushSize,
            color,
          );
          break;
        }
        case "rectangle": {
          rectangleHandler(
            startPoint,
            currentPosition,
            canvasContext,
            brushSize,
            color,
          );
          break;
        }
      }
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal__overlay" onClick={(e) => modalHandler(e)}>
          <div className="modal__content">
            <h2>Enter the paint title to proceed</h2>
            <input
              className="modal__input"
              type="text"
              placeholder="Title"
              onChange={(e) => setPaintTitle(e.target.value)}
            />
            <button
              className="modal__button"
              disabled={!paintTitle}
              onClick={saveHandler}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      <div className="paint__wrapper">
        <div
          className="paint__actions"
          role="toolbar"
          aria-label="drawing tools"
        >
          {DRAWING_TOOLS.map(({ id, icon: Icon }) => (
            <ToolButton
              key={id}
              onClick={() => setTool(id)}
              icon={<Icon size="25px" />}
            />
          ))}
        </div>
        <div className="paint__container">
          <aside className="paint__aside">
            <ToolButton
              onClick={undoHandler}
              icon={<TbArrowBack size="25px" />}
            />
            <ToolButton
              onClick={clearCanvasHandler}
              icon={<AiOutlineDelete size="25px" />}
            />
            <ToolButton
              onClick={() => setIsModalOpen(true)}
              icon={<TfiSave size="25px" />}
            />
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
    </>
  );
}

export default PaintPage;
