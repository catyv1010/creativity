"use client";

import { useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement } from "@/types/presentation";

interface Props {
  element: SlideElement;
  zoom: number;
  children: React.ReactNode;
}

export default function ElementWrapper({ element, zoom, children }: Props) {
  const { selectedElementIds, setSelection, moveElement, resizeElement, pushHistory, tool } = useEditorStore();
  const isSelected = selectedElementIds.includes(element.id);
  const dragRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number; elX: number; elY: number; handle: string } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (tool !== "select" || element.locked) return;
    e.stopPropagation();
    setSelection([element.id]);
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      elX: element.transform.position.x, elY: element.transform.position.y,
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = (ev.clientX - dragRef.current.startX) / zoom;
      const dy = (ev.clientY - dragRef.current.startY) / zoom;
      moveElement(element.id, {
        x: Math.round(dragRef.current.elX + dx),
        y: Math.round(dragRef.current.elY + dy),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      pushHistory();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [element, zoom, tool, setSelection, moveElement, pushHistory]);

  const onResizeDown = useCallback((e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      startX: e.clientX, startY: e.clientY,
      startW: element.transform.size.width, startH: element.transform.size.height,
      elX: element.transform.position.x, elY: element.transform.position.y,
      handle,
    };

    const onMove = (ev: PointerEvent) => {
      if (!resizeRef.current) return;
      const r = resizeRef.current;
      const dx = (ev.clientX - r.startX) / zoom;
      const dy = (ev.clientY - r.startY) / zoom;

      let newW = r.startW, newH = r.startH, newX = r.elX, newY = r.elY;
      if (r.handle.includes("e")) newW = Math.max(20, r.startW + dx);
      if (r.handle.includes("w")) { newW = Math.max(20, r.startW - dx); newX = r.elX + dx; }
      if (r.handle.includes("s")) newH = Math.max(20, r.startH + dy);
      if (r.handle.includes("n")) { newH = Math.max(20, r.startH - dy); newY = r.elY + dy; }

      resizeElement(element.id, { width: Math.round(newW), height: Math.round(newH) }, { x: Math.round(newX), y: Math.round(newY) });
    };
    const onUp = () => {
      resizeRef.current = null;
      pushHistory();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [element, zoom, resizeElement, pushHistory]);

  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  const handlePositions: Record<string, string> = {
    nw: "-top-1.5 -left-1.5 cursor-nw-resize",
    n: "-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize",
    ne: "-top-1.5 -right-1.5 cursor-ne-resize",
    e: "top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize",
    se: "-bottom-1.5 -right-1.5 cursor-se-resize",
    s: "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize",
    sw: "-bottom-1.5 -left-1.5 cursor-sw-resize",
    w: "top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize",
  };

  return (
    <div
      className="absolute"
      style={{
        left: element.transform.position.x,
        top: element.transform.position.y,
        width: element.transform.size.width,
        height: element.transform.size.height,
        transform: `rotate(${element.transform.rotation}deg)`,
        opacity: element.style.opacity,
        zIndex: element.zIndex,
        cursor: tool === "select" ? "move" : "default",
      }}
      onPointerDown={onPointerDown}
    >
      {children}

      {/* Selection outline + handles */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded-sm" />
          {handles.map((h) => (
            <div
              key={h}
              className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm ${handlePositions[h]}`}
              style={{ cursor: "auto" }}
              onPointerDown={(e) => onResizeDown(e, h)}
            />
          ))}
        </>
      )}
    </div>
  );
}
