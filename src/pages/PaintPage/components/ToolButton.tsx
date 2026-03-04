import { type ReactNode } from 'react'
import { GoPencil, GoHorizontalRule, GoCircle } from "react-icons/go"
import { PiTriangle, PiRectangle } from "react-icons/pi"
import { LuEraser } from "react-icons/lu"

interface ToolButtonProps {
  onClick: () => void
  icon: ReactNode
}

export const DRAWING_TOOLS = [
  { id: "pencil", icon: GoPencil, label: "pencil" },
  { id: "line", icon: GoHorizontalRule, label: "line" },
  { id: "triangle", icon: PiTriangle, label: "triangle" },
  { id: "circle", icon: GoCircle, label: "circle" },
  { id: "rectangle", icon: PiRectangle, label: "rectangle" },
  { id: "eraser", icon: LuEraser, label: "eraser" },
] as const



function ToolButton({ onClick, icon }: ToolButtonProps) {
  return (
    <button className="action__button" onClick={onClick}>
      {icon}
    </button>
  )
}

export default ToolButton