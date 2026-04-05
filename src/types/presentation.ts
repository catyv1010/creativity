export type ElementType = "text" | "shape" | "image";

export interface Position { x: number; y: number; }
export interface Size { width: number; height: number; }

export interface Transform {
  position: Position;
  size: Size;
  rotation: number;
}

export interface ElementStyle {
  opacity: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface Animation {
  type: "fadeIn" | "slideIn" | "scaleIn" | "rotateIn" | "none";
  direction?: "left" | "right" | "top" | "bottom";
  duration: number;
  delay: number;
}

export interface SlideElement {
  id: string;
  type: ElementType;
  name: string;
  transform: Transform;
  style: ElementStyle;
  content?: string; // HTML for text, URL for image
  shapeType?: "rectangle" | "ellipse" | "triangle" | "line";
  locked: boolean;
  visible: boolean;
  animation?: Animation;
  zIndex: number;
  // Text-specific
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: "left" | "center" | "right";
  color?: string;
}

export interface SlideTransition {
  type: "none" | "fade" | "slide" | "zoom" | "flip";
  duration: number;
}

export interface Slide {
  id: string;
  backgroundColor: string;
  backgroundGradient?: string;
  elements: Record<string, SlideElement>;
  elementOrder: string[];
  transition: SlideTransition;
}

export interface Presentation {
  id: string;
  title: string;
  slideSize: Size;
  slides: Record<string, Slide>;
  slideOrder: string[];
  createdAt: string;
}
