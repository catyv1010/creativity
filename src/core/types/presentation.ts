// ============================================================
// Creativity — Cinematic Presentation Data Model
// ============================================================
// Everything in the app reads/writes this single data structure.
// Presentations live in a continuous 2D/3D world space.
// A virtual camera flies between scenes — that's what makes it cinematic.
// ============================================================

// --- PRIMITIVES ---

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number;
  height: number;
}

// --- WORLD SPACE ---
// Scenes are positioned in a large continuous world.
// The camera flies between them using inverse transforms on a world container.

export interface WorldTransform {
  x: number;
  y: number;
  z: number;
  rotation: number; // degrees
  scale: number;
}

// --- PRESENTATION ---

export interface Presentation {
  id: string;
  title: string;
  settings: PresentationSettings;
  scenes: Scene[];
  camera: CameraPath;
  createdAt: string;
  updatedAt: string;
}

export interface PresentationSettings {
  width: number;  // scene viewport width (e.g., 1920)
  height: number; // scene viewport height (e.g., 1080)
  backgroundColor: string;
  worldBounds: Size; // total world space
  defaultTransition: TransitionDescriptor;
}

// --- SCENES ---
// A scene is like a "slide" but positioned in world space.
// The camera flies to its worldTransform to show it.

export interface Scene {
  id: string;
  name: string;
  worldTransform: WorldTransform;
  elements: SceneElement[];
  duration: number; // seconds
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;         // URL to background image
  backgroundOverlay?: string;       // overlay color/gradient over bg image
  backgroundBlur?: number;          // blur the background image
  transition: TransitionDescriptor;
  parallax?: ParallaxConfig;
  quiz?: QuizData;                  // interactive quiz overlay for this scene
}

// --- QUIZ ---
// Interactive quiz overlay rendered in Presenter when scene.quiz is set.

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];      // 2-4 options
  correctIndex: number;   // 0-based index of correct option
  timeLimit: number;      // seconds (e.g. 20)
  points: number;         // points awarded for correct answer
}

// --- ELEMENTS ---

export type ElementType = "text" | "image" | "shape" | "video" | "icon" | "divider" | "group";

export interface ElementTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  originX: number; // 0-1
  originY: number; // 0-1
  opacity: number;
}

export interface ElementStyle {
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  filter?: string;
  backdropFilter?: string;
  clipPath?: string;
  mixBlendMode?: string;
}

export interface SceneElement {
  id: string;
  type: ElementType;
  name: string;
  transform: ElementTransform;
  style: ElementStyle;
  content: ElementContent;
  animations: AnimationDescriptor[];
  interactions?: ElementInteraction[]; // hover, click, tooltip
  depthLayer: number; // 0 = base, negative = behind, positive = in front
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

// --- INTERACTIONS ---
// What happens when users interact with elements during presentation.

export type InteractionType = "hover-scale" | "hover-glow" | "hover-lift" | "hover-color"
  | "click-tooltip" | "click-reveal" | "click-link" | "click-popup";

export interface ElementInteraction {
  type: InteractionType;
  params: Record<string, unknown>;
  // For tooltips: { text: string, position: "top"|"bottom"|"left"|"right" }
  // For reveal: { targetElementId: string }
  // For link: { url: string, newTab: boolean }
  // For popup: { content: string, width: number, height: number }
  // For hover-color: { color: string }
  // For hover-scale: { scale: number }
}

// --- ELEMENT CONTENT (type-specific) ---

export type ElementContent =
  | TextContent
  | ImageContent
  | ShapeContent
  | VideoContent
  | IconContent
  | DividerContent
  | GroupContent;

export interface TextContent {
  type: "text";
  html: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ImageContent {
  type: "image";
  src: string;
  alt: string;
  objectFit: "cover" | "contain" | "fill";
}

export interface ShapeContent {
  type: "shape";
  shape: "rect" | "circle" | "triangle" | "polygon" | "custom";
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  svgPath?: string;
}

export interface VideoContent {
  type: "video";
  src: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export interface IconContent {
  type: "icon";
  iconName: string;       // Lucide icon name, e.g. "Heart", "Star", "Zap"
  color: string;
  strokeWidth?: number;
  filled?: boolean;       // use fill instead of stroke
}

export interface DividerContent {
  type: "divider";
  style: "solid" | "dashed" | "dotted" | "gradient" | "dots";
  color: string;
  thickness: number;
  direction: "horizontal" | "vertical";
}

export interface GroupContent {
  type: "group";
  children: SceneElement[];
}

// --- ANIMATION DESCRIPTORS ---
// Serializable descriptions of animations.
// AnimationEngine reads these and builds real GSAP timelines.

export interface AnimationDescriptor {
  id: string;
  type: "entrance" | "emphasis" | "exit" | "motion-path" | "custom";
  preset?: AnimationPreset;
  trigger: AnimationTrigger;
  timing: AnimationTiming;
  properties: GSAPPropertyMap;
  easing: string; // GSAP ease string, e.g. "power2.inOut"
}

export type AnimationPreset =
  // Entrances
  | "fadeIn" | "slideInLeft" | "slideInRight" | "slideInUp" | "slideInDown"
  | "scaleIn" | "rotateIn" | "flipInX" | "flipInY"
  | "zoomBounceIn" | "spiralIn" | "dropIn" | "riseUp" | "swoopIn"
  | "expandIn" | "unfoldX" | "unfoldY"
  // Clip-path reveals
  | "revealFromLeft" | "revealFromRight" | "revealFromTop" | "revealFromBottom"
  | "circleReveal" | "diamondReveal" | "splitReveal" | "dramaticReveal"
  // Cinematic specials
  | "cinematicZoom" | "glitchIn" | "blurIn" | "blurOut" | "zoomBlurIn"
  | "matrixDrop" | "neonFlicker" | "stampIn" | "perspectiveTilt"
  // Exits
  | "fadeOut" | "scaleOut" | "rotateOut"
  | "slideOutLeft" | "slideOutRight" | "slideOutUp" | "slideOutDown"
  | "shrinkOut" | "collapseX" | "collapseY"
  // Emphasis / looping
  | "float" | "pulse" | "shake" | "glow"
  | "heartbeat" | "wobble" | "breathe" | "jello" | "swing"
  | "rubberBand" | "tada" | "hoverFloat" | "colorShift" | "flickerGlow"
  // Text (SplitText / TextPlugin / ScrambleTextPlugin)
  | "typewriter" | "scrambleIn" | "letterByLetter" | "wordByWord" | "lineByLine"
  // SVG (DrawSVGPlugin / MorphSVGPlugin)
  | "drawSVG" | "drawSVGReverse"
  // Physics
  | "explodeOut"
  // None
  | "none";

export interface AnimationTrigger {
  type: "scene-enter" | "scene-exit" | "with-previous" | "after-previous" | "click" | "scroll";
  delay: number; // seconds from trigger point
}

export interface AnimationTiming {
  startTime: number;  // relative to scene timeline, seconds
  duration: number;   // seconds
  repeat: number;     // -1 for infinite
  yoyo: boolean;
}

// Key-value map of properties GSAP will animate.
// Intentionally loose to support any GSAP-animatable property.
export interface GSAPPropertyMap {
  [key: string]: number | string | { from: number | string; to: number | string };
}

// --- CAMERA ---
// The camera doesn't move the viewport — it transforms the world container inversely.
// If camera is at (1000, 500) zoomed 2x, world is translated (-1000, -500) scaled 2x.

export interface CameraPath {
  keyframes: CameraKeyframe[];
}

export interface CameraKeyframe {
  id: string;
  sceneId: string;
  time: number;       // absolute time in presentation
  transform: WorldTransform;
  easing: string;
  duration: number;   // how long the move TO this keyframe takes
}

// --- TRANSITIONS ---
// Cinematic transitions between scenes. This is a key differentiator.

export type TransitionType =
  | "camera-move"    // smooth fly to next scene
  | "fade"           // cross-fade
  | "zoom-blur"      // zoom in with radial blur
  | "whip-pan"       // fast horizontal snap with motion blur
  | "dolly-zoom"     // Hitchcock/Vertigo effect (zoom + perspective)
  | "iris"           // circular iris wipe
  | "film-grain-cut" // hard cut with film grain flash
  | "parallax-shift" // lateral move with depth parallax
  | "glitch-cut"     // digital glitch with RGB split + noise
  | "morph-wipe"     // organic morphing blob wipe
  | "slide-over"     // new scene slides over the previous one
  | "ripple"         // water-ripple dissolve
  | "rotate-3d"      // 3D cube-like rotation between scenes
  | "custom";

export interface TransitionDescriptor {
  type: TransitionType;
  duration: number;  // seconds
  easing: string;
  params: Record<string, unknown>;
}

// --- PARALLAX ---
// Elements at different depthLayers move at different rates
// during camera movement, creating depth illusion.

export interface ParallaxConfig {
  enabled: boolean;
  layers: ParallaxLayer[];
  depthScale: number;    // how aggressively depth affects parallax
  perspective: number;   // CSS perspective value in px
}

export interface ParallaxLayer {
  depthLayer: number;       // matches SceneElement.depthLayer
  speedMultiplier: number;  // 0.5 = slow (far), 1.5 = fast (near)
  blur: number;             // depth-of-field blur in px
}
