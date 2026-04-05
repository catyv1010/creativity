"use client";

import type { Slide } from "@/types/presentation";
import ElementWrapper from "./elements/ElementWrapper";

interface Props {
  slide: Slide;
  zoom: number;
  interactive?: boolean;
  width?: number;
  height?: number;
}

export default function SlideRenderer({ slide, zoom, interactive = true, width = 1920, height = 1080 }: Props) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        backgroundColor: slide.backgroundColor,
        backgroundImage: slide.backgroundGradient || undefined,
      }}
    >
      {slide.elementOrder.map((eid) => {
        const el = slide.elements[eid];
        if (!el || !el.visible) return null;

        const content = (() => {
          switch (el.type) {
            case "text":
              return (
                <div
                  className="w-full h-full flex items-start whitespace-pre-wrap break-words overflow-hidden select-none"
                  style={{
                    fontSize: el.fontSize || 32,
                    fontWeight: el.fontWeight || 400,
                    fontFamily: el.fontFamily || "var(--font-body)",
                    textAlign: el.textAlign || "left",
                    color: el.color || "#000",
                    lineHeight: 1.3,
                  }}
                >
                  {el.content}
                </div>
              );
            case "shape":
              return (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: el.style.backgroundColor || "#a855f7",
                    borderRadius: el.shapeType === "ellipse" ? "50%" : el.style.borderRadius || 0,
                    border: el.style.borderWidth ? `${el.style.borderWidth}px solid ${el.style.borderColor || "#000"}` : undefined,
                    clipPath: el.shapeType === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                  }}
                />
              );
            case "image":
              return (
                <img
                  src={el.content || ""}
                  alt={el.name}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: el.style.borderRadius || 0 }}
                  draggable={false}
                />
              );
            default:
              return null;
          }
        })();

        if (!interactive) {
          // Thumbnail mode — no interaction
          return (
            <div
              key={eid}
              className="absolute"
              style={{
                left: el.transform.position.x,
                top: el.transform.position.y,
                width: el.transform.size.width,
                height: el.transform.size.height,
                transform: `rotate(${el.transform.rotation}deg)`,
                opacity: el.style.opacity,
                zIndex: el.zIndex,
              }}
            >
              {content}
            </div>
          );
        }

        return (
          <ElementWrapper key={eid} element={el} zoom={zoom}>
            {content}
          </ElementWrapper>
        );
      })}
    </div>
  );
}
