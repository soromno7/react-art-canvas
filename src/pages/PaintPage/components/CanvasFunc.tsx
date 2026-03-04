import type { IPoint } from "../types";

export const pencilHandler = (
  startPoint: IPoint,
  currentPosition: IPoint,
  canvasContext: CanvasRenderingContext2D,
  brushSize: number,
  color: string,
  tool: string,
  setStartPoint: (point: IPoint) => void
) => {
  canvasContext.beginPath();
  canvasContext.moveTo(startPoint.x, startPoint.y);
  canvasContext.lineTo(currentPosition.x, currentPosition.y);
  canvasContext.lineWidth = brushSize;
  canvasContext.strokeStyle = tool === "eraser" ? "#ffffff" : color;
  canvasContext.stroke();
  setStartPoint(currentPosition);
};

export const lineHandler = (
  startPoint: IPoint,
  endPoint: IPoint,
  canvasContext: CanvasRenderingContext2D,
  brushSize: number,
  color: string
) => {
  canvasContext.beginPath();
  canvasContext.moveTo(startPoint.x, startPoint.y);
  canvasContext.lineTo(endPoint.x, endPoint.y);
  canvasContext.lineWidth = brushSize;
  canvasContext.strokeStyle = color;
  canvasContext.stroke();
};

export const triangleHandler = (
  startPoint: IPoint,
  endPoint: IPoint,
  canvasContext: CanvasRenderingContext2D,
  brushSize: number,
  color: string
) => {
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
  canvasContext.lineWidth = brushSize;
  canvasContext.strokeStyle = color;
  canvasContext.stroke();
};

export const circleHandler = (
  startPoint: IPoint,
  endPoint: IPoint,
  canvasContext: CanvasRenderingContext2D,
  brushSize: number,
  color: string
) => {
  const radius = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) +
    Math.pow(endPoint.y - startPoint.y, 2),
  );

  canvasContext.beginPath();
  canvasContext.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
  canvasContext.lineWidth = brushSize;
  canvasContext.strokeStyle = color;
  canvasContext.stroke();
};

export const rectangleHandler = (
  startPoint: IPoint,
  endPoint: IPoint,
  canvasContext: CanvasRenderingContext2D,
  brushSize: number,
  color: string
) => {
  const width = endPoint.x - startPoint.x;
  const height = endPoint.y - startPoint.y;

  canvasContext.lineWidth = brushSize;
  canvasContext.strokeStyle = color;
  canvasContext.strokeRect(startPoint.x, startPoint.y, width, height);
};