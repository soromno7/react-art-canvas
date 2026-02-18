import React, { useRef, useState, useEffect } from "react";
import "./Paint.css";

export type DrawingTool =
  | "pencil"
  | "line"
  | "rectangle"
  | "circle"
  | "triangle"
  | "eraser";

export interface Point {
  x: number;
  y: number;
}

const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawingTool>("pencil");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  // История ТОЛЬКО для undo (простой массив, индекс не нужен для навигации)
  const [history, setHistory] = useState<ImageData[]>([]);

  // Инициализация canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Сохраняем начальное состояние в историю
    saveToHistory(ctx);
  }, []);

  // Сохранение состояния в историю (УПРОЩЕННАЯ ВЕРСИЯ)
  const saveToHistory = (ctx?: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    const context = ctx || canvas?.getContext("2d");
    if (!canvas || !context) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Просто добавляем в конец, без обрезки и без индекса!
    const newHistory = [...history, imageData];
    
    // Ограничиваем историю 50 шагами
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    // historyIndex больше не нужен!
  };

  // Undo (упрощенный - всегда берет предыдущее состояние)
  const undo = () => {
    if (history.length <= 1) return; // Нечего отменять (нужен хотя бы 1 предыдущий шаг)

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Берем ПРЕДПОСЛЕДНИЙ элемент истории
    const previousState = history[history.length - 2];
    ctx.putImageData(previousState, 0, 0);
    
    // Удаляем последний элемент из истории
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
  };

  // Redo ПОЛНОСТЬЮ УДАЛЕН!

  // Очистка canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctx);
  };

  // Функция для рисования карандашом
  const drawWithPencil = (ctx: CanvasRenderingContext2D, point: Point) => {
    if (!startPoint) return;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = brushSize;
    ctx.stroke();

    setStartPoint(point);
  };

  // Функция для рисования линии
  const drawLine = (ctx: CanvasRenderingContext2D, from: Point, to: Point, isPreview: boolean = false) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    if (!isPreview) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
    ctx.stroke();
  };

  // Функция для рисования прямоугольника
  const drawRectangle = (
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    isPreview: boolean = false
  ) => {
    const width = to.x - from.x;
    const height = to.y - from.y;

    if (!isPreview) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
    ctx.strokeRect(from.x, from.y, width, height);
  };

  // Функция для рисования круга
  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    center: Point,
    radiusPoint: Point,
    isPreview: boolean = false
  ) => {
    const radius = Math.sqrt(
      Math.pow(radiusPoint.x - center.x, 2) +
        Math.pow(radiusPoint.y - center.y, 2)
    );

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    if (!isPreview) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
    ctx.stroke();
  };

  // Функция для рисования треугольника
  const drawTriangle = (
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    isPreview: boolean = false
  ) => {
    const baseMidpoint = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    
    const p3 = {
      x: baseMidpoint.x - dy * 0.5,
      y: baseMidpoint.y + dx * 0.5,
    };

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    
    if (!isPreview) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
    ctx.stroke();
  };

  // Восстановление canvas (удаление предпросмотра)
  const restoreCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Восстанавливаем последнее сохраненное состояние
    if (history.length > 0) {
      ctx.putImageData(history[history.length - 1], 0, 0);
    }
  };

  // Обработчик начала рисования
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    
    // Сохраняем состояние перед началом рисования фигуры
    if (tool !== "pencil" && tool !== "eraser") {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        saveToHistory(ctx);
      }
    }
    
    setIsDrawing(true);
    setStartPoint({ x: offsetX, y: offsetY });
    setCurrentPoint({ x: offsetX, y: offsetY });
  };

  // Обработчик процесса рисования
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const currentPos = { x: offsetX, y: offsetY };

    // Для карандаша и ластика рисуем сразу
    if (tool === "pencil" || tool === "eraser") {
      drawWithPencil(ctx, currentPos);
    } else {
      // Для фигур показываем предпросмотр
      restoreCanvas(); // Удаляем предыдущий предпросмотр

      // Рисуем текущую фигуру пунктиром
      ctx.save();
      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      switch (tool) {
        case "line":
          drawLine(ctx, startPoint, currentPos, true);
          break;
        case "rectangle":
          drawRectangle(ctx, startPoint, currentPos, true);
          break;
        case "circle":
          drawCircle(ctx, startPoint, currentPos, true);
          break;
        case "triangle":
          drawTriangle(ctx, startPoint, currentPos, true);
          break;
      }

      ctx.restore();
      setCurrentPoint(currentPos);
    }
  };

  // Обработчик окончания рисования
  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const endPoint = { x: offsetX, y: offsetY };

    // Для фигур рисуем окончательный вариант
    if (tool !== "pencil" && tool !== "eraser") {
      // Удаляем предпросмотр
      restoreCanvas();
      
      // Рисуем финальную версию
      ctx.save();
      ctx.setLineDash([]);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      switch (tool) {
        case "line":
          drawLine(ctx, startPoint, endPoint);
          break;
        case "rectangle":
          drawRectangle(ctx, startPoint, endPoint);
          break;
        case "circle":
          drawCircle(ctx, startPoint, endPoint);
          break;
        case "triangle":
          drawTriangle(ctx, startPoint, endPoint);
          break;
      }

      ctx.restore();
      saveToHistory(ctx); // Сохраняем финальное состояние
    } else {
      // Для карандаша и ластика сохраняем состояние
      saveToHistory(ctx);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  // Обработчик клавиш ТОЛЬКО для undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      // Обработка Ctrl+Y УДАЛЕНА!
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]); // Зависимость только от history

  return (
    <div className="paint-container">
      <div className="toolbar">
        <button
          className={tool === "pencil" ? "active" : ""}
          onClick={() => setTool("pencil")}
          title="Карандаш (P)"
        >
          ✏️ Карандаш
        </button>

        <button
          className={tool === "line" ? "active" : ""}
          onClick={() => setTool("line")}
          title="Линия (L)"
        >
          📏 Линия
        </button>

        <button
          className={tool === "rectangle" ? "active" : ""}
          onClick={() => setTool("rectangle")}
          title="Прямоугольник (R)"
        >
          🔲 Прямоугольник
        </button>

        <button
          className={tool === "circle" ? "active" : ""}
          onClick={() => setTool("circle")}
          title="Круг (C)"
        >
          ⭕ Круг
        </button>

        <button
          className={tool === "triangle" ? "active" : ""}
          onClick={() => setTool("triangle")}
          title="Треугольник (T)"
        >
          🔺 Треугольник
        </button>

        <button
          className={tool === "eraser" ? "active" : ""}
          onClick={() => setTool("eraser")}
          title="Ластик (E)"
        >
          🧽 Ластик
        </button>

        <div className="separator"></div>

        <button onClick={undo} title="Отменить (Ctrl+Z)" disabled={history.length <= 1}>
          ↩️ Отменить
        </button>

        {/* Кнопка Redo ПОЛНОСТЬЮ УДАЛЕНА! */}

        <div className="separator"></div>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Цвет"
        />

        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          title="Размер кисти"
        />
        <span>{brushSize}px</span>

        <button onClick={clearCanvas} title="Очистить">
          🗑️ Очистить
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="paint-canvas"
      />
      
      {/* Статус бар */}
      <div className="status-bar">
        <span>Инструмент: {tool}</span>
        {currentPoint && (
          <span>Позиция: {currentPoint.x}, {currentPoint.y}</span>
        )}
        {startPoint && currentPoint && tool !== "pencil" && tool !== "eraser" && (
          <span>
            Размер: {Math.abs(currentPoint.x - startPoint.x)} x{" "}
            {Math.abs(currentPoint.y - startPoint.y)}
          </span>
        )}
      </div>
    </div>
  );
};

export default PaintApp;