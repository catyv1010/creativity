import type { Slide, SlideElement, Presentation } from "@/types/presentation";
import { createId } from "./id";

export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;

export function createDefaultSlide(): Slide {
  return {
    id: createId(),
    backgroundColor: "#ffffff",
    elements: {},
    elementOrder: [],
    transition: { type: "fade", duration: 500 },
  };
}

export function createTextElement(overrides: Partial<SlideElement> = {}): SlideElement {
  const id = createId();
  return {
    id,
    type: "text",
    name: "Texto",
    transform: { position: { x: 200, y: 200 }, size: { width: 400, height: 60 }, rotation: 0 },
    style: { opacity: 1 },
    content: "Escribe aqui...",
    fontSize: 32,
    fontWeight: 400,
    textAlign: "left",
    color: "#000000",
    locked: false,
    visible: true,
    zIndex: 0,
    ...overrides,
  };
}

export function createShapeElement(shapeType: "rectangle" | "ellipse" | "triangle" = "rectangle", overrides: Partial<SlideElement> = {}): SlideElement {
  const id = createId();
  return {
    id,
    type: "shape",
    name: shapeType === "rectangle" ? "Rectangulo" : shapeType === "ellipse" ? "Circulo" : "Triangulo",
    shapeType,
    transform: { position: { x: 300, y: 300 }, size: { width: 200, height: 200 }, rotation: 0 },
    style: { opacity: 1, backgroundColor: "#a855f7", borderRadius: shapeType === "ellipse" ? 9999 : 8 },
    locked: false,
    visible: true,
    zIndex: 0,
    ...overrides,
  };
}

export function createImageElement(src: string, overrides: Partial<SlideElement> = {}): SlideElement {
  const id = createId();
  return {
    id,
    type: "image",
    name: "Imagen",
    transform: { position: { x: 300, y: 200 }, size: { width: 400, height: 300 }, rotation: 0 },
    style: { opacity: 1, borderRadius: 0 },
    content: src,
    locked: false,
    visible: true,
    zIndex: 0,
    ...overrides,
  };
}

export function createDefaultPresentation(): Presentation {
  const slide = createDefaultSlide();
  return {
    id: createId(),
    title: "Mi Presentacion",
    slideSize: { width: SLIDE_WIDTH, height: SLIDE_HEIGHT },
    slides: { [slide.id]: slide },
    slideOrder: [slide.id],
    createdAt: new Date().toISOString(),
  };
}
