"use client";

import { useEditorStore } from "@/store/editorStore";
import { MousePointer2, Type, Square, Circle, Triangle, Image, Hand, Undo2, Redo2, Play, Palette } from "lucide-react";

const colors = ["#ffffff", "#000000", "#a855f7", "#ec4899", "#06b6d4", "#f59e0b", "#F2583E", "#84cc16", "#3b82f6", "#f43f5e"];

export default function ToolBar() {
  const {
    tool, setTool, addTextElement, addShapeElement, undo, redo,
    presentation, activeSlideId, updateSlideBackground, selectedElementIds,
    updateElement, setPresentMode,
  } = useEditorStore();
  const slide = presentation.slides[activeSlideId];

  const tools = [
    { id: "select" as const, icon: MousePointer2, label: "Seleccionar (V)" },
    { id: "hand" as const, icon: Hand, label: "Mover (H)" },
  ];

  return (
    <div className="h-12 bg-[#0f0f1a] border-b border-white/5 flex items-center px-3 gap-1 shrink-0">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 mr-4 pr-4 border-r border-white/5">
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-coral via-magenta to-purple rotate-3" />
          <div className="absolute inset-[1.5px] rounded-[4px] bg-[#0f0f1a] flex items-center justify-center">
            <span className="text-[10px] font-extrabold text-white/60">C</span>
          </div>
        </div>
        <span className="text-white/40 text-xs font-bold hidden lg:block">Creativity</span>
      </a>

      {/* Selection tools */}
      {tools.map((t) => (
        <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${tool === t.id ? "bg-purple/20 text-purple" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
          <t.icon size={16} />
        </button>
      ))}

      <div className="w-px h-6 bg-white/5 mx-1" />

      {/* Add elements */}
      <button onClick={addTextElement} title="Texto (T)" className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
        <Type size={16} />
      </button>
      <button onClick={() => addShapeElement("rectangle")} title="Rectangulo" className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
        <Square size={16} />
      </button>
      <button onClick={() => addShapeElement("ellipse")} title="Circulo" className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
        <Circle size={16} />
      </button>
      <button onClick={() => addShapeElement("triangle")} title="Triangulo" className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
        <Triangle size={16} />
      </button>

      <div className="w-px h-6 bg-white/5 mx-1" />

      {/* Color swatches — for selected element or slide background */}
      <div className="flex items-center gap-1 mr-2">
        {colors.map((c) => (
          <button key={c} onClick={() => {
            if (selectedElementIds.length > 0) {
              const el = slide?.elements[selectedElementIds[0]];
              if (el?.type === "text") updateElement(selectedElementIds[0], { color: c });
              else if (el?.type === "shape") updateElement(selectedElementIds[0], { style: { ...el.style, backgroundColor: c } });
            } else {
              updateSlideBackground(activeSlideId, c);
            }
          }}
            className="w-5 h-5 rounded-full border border-white/10 hover:scale-125 transition-transform cursor-pointer"
            style={{ backgroundColor: c }}
            title={selectedElementIds.length > 0 ? "Color del elemento" : "Fondo del slide"} />
        ))}
      </div>

      <div className="flex-1" />

      {/* Undo/Redo */}
      <button onClick={undo} title="Deshacer (Ctrl+Z)" className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
        <Undo2 size={16} />
      </button>
      <button onClick={redo} title="Rehacer (Ctrl+Shift+Z)" className="w-8 h-8 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
        <Redo2 size={16} />
      </button>

      <div className="w-px h-6 bg-white/5 mx-1" />

      {/* Present */}
      <button onClick={() => setPresentMode(true)} className="flex items-center gap-2 px-4 h-8 rounded-full bg-purple hover:bg-purple/80 text-white text-xs font-bold transition-colors cursor-pointer">
        <Play size={12} fill="white" />
        Presentar
      </button>
    </div>
  );
}
