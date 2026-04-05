"use client";

import { useEditorStore } from "@/store/editorStore";

export default function PropertiesPanel() {
  const { presentation, activeSlideId, selectedElementIds, updateElement, deleteSelectedElements } = useEditorStore();
  const slide = presentation.slides[activeSlideId];
  const el = selectedElementIds.length === 1 ? slide?.elements[selectedElementIds[0]] : null;

  if (!el) {
    return (
      <div className="w-60 bg-[#0f0f1a] border-l border-white/5 p-4">
        <p className="text-white/20 text-xs text-center mt-8">Selecciona un elemento para editar sus propiedades</p>
      </div>
    );
  }

  return (
    <div className="w-60 bg-[#0f0f1a] border-l border-white/5 overflow-y-auto">
      <div className="p-4 border-b border-white/5">
        <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Propiedades</span>
      </div>

      {/* Position */}
      <div className="p-4 border-b border-white/5 space-y-2">
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Posicion</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-white/20 text-[10px]">
            X
            <input type="number" value={Math.round(el.transform.position.x)} onChange={(e) => updateElement(el.id, { transform: { ...el.transform, position: { ...el.transform.position, x: Number(e.target.value) } } })}
              className="w-full mt-0.5 px-2 py-1 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50" />
          </label>
          <label className="text-white/20 text-[10px]">
            Y
            <input type="number" value={Math.round(el.transform.position.y)} onChange={(e) => updateElement(el.id, { transform: { ...el.transform, position: { ...el.transform.position, y: Number(e.target.value) } } })}
              className="w-full mt-0.5 px-2 py-1 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-white/20 text-[10px]">
            Ancho
            <input type="number" value={Math.round(el.transform.size.width)} onChange={(e) => updateElement(el.id, { transform: { ...el.transform, size: { ...el.transform.size, width: Number(e.target.value) } } })}
              className="w-full mt-0.5 px-2 py-1 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50" />
          </label>
          <label className="text-white/20 text-[10px]">
            Alto
            <input type="number" value={Math.round(el.transform.size.height)} onChange={(e) => updateElement(el.id, { transform: { ...el.transform, size: { ...el.transform.size, height: Number(e.target.value) } } })}
              className="w-full mt-0.5 px-2 py-1 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50" />
          </label>
        </div>
        <label className="text-white/20 text-[10px]">
          Rotacion ({Math.round(el.transform.rotation)}°)
          <input type="range" min="0" max="360" value={el.transform.rotation} onChange={(e) => updateElement(el.id, { transform: { ...el.transform, rotation: Number(e.target.value) } })}
            className="w-full mt-1 accent-purple" />
        </label>
      </div>

      {/* Style */}
      <div className="p-4 border-b border-white/5 space-y-2">
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Estilo</span>
        <label className="text-white/20 text-[10px]">
          Opacidad ({Math.round(el.style.opacity * 100)}%)
          <input type="range" min="0" max="100" value={el.style.opacity * 100} onChange={(e) => updateElement(el.id, { style: { ...el.style, opacity: Number(e.target.value) / 100 } })}
            className="w-full mt-1 accent-purple" />
        </label>
        {el.type === "shape" && (
          <label className="text-white/20 text-[10px]">
            Border Radius
            <input type="range" min="0" max="200" value={el.style.borderRadius || 0} onChange={(e) => updateElement(el.id, { style: { ...el.style, borderRadius: Number(e.target.value) } })}
              className="w-full mt-1 accent-purple" />
          </label>
        )}
      </div>

      {/* Text-specific */}
      {el.type === "text" && (
        <div className="p-4 border-b border-white/5 space-y-2">
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Texto</span>
          <textarea value={el.content || ""} onChange={(e) => updateElement(el.id, { content: e.target.value })} rows={3}
            className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50 resize-none" />
          <label className="text-white/20 text-[10px]">
            Tamaño ({el.fontSize}px)
            <input type="range" min="12" max="200" value={el.fontSize || 32} onChange={(e) => updateElement(el.id, { fontSize: Number(e.target.value) })}
              className="w-full mt-1 accent-purple" />
          </label>
          <div className="flex gap-1">
            {[{ w: 400, l: "Normal" }, { w: 700, l: "Bold" }, { w: 900, l: "Black" }].map((fw) => (
              <button key={fw.w} onClick={() => updateElement(el.id, { fontWeight: fw.w })}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${el.fontWeight === fw.w ? "bg-purple/20 text-purple" : "bg-white/5 text-white/30 hover:bg-white/10"}`}>
                {fw.l}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(["left", "center", "right"] as const).map((a) => (
              <button key={a} onClick={() => updateElement(el.id, { textAlign: a })}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${el.textAlign === a ? "bg-purple/20 text-purple" : "bg-white/5 text-white/30 hover:bg-white/10"}`}>
                {a === "left" ? "Izq" : a === "center" ? "Centro" : "Der"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete */}
      <div className="p-4">
        <button onClick={deleteSelectedElements}
          className="w-full py-2 rounded bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer">
          Eliminar elemento
        </button>
      </div>
    </div>
  );
}
