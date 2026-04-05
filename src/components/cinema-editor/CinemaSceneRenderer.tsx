"use client";

import { memo } from "react";
import type {
  Scene,
  SceneElement,
  TextContent,
  ImageContent,
  ShapeContent,
  VideoContent,
  ElementContent,
  ElementTransform,
  ElementStyle,
} from "@/core/types";

interface CinemaSceneRendererProps {
  scene: Scene;
  zoom: number;
  interactive?: boolean;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

function renderTextContent(content: TextContent) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content.html }}
      style={{
        fontFamily: content.fontFamily,
        fontSize: content.fontSize,
        fontWeight: content.fontWeight,
        color: content.color,
        textAlign: content.textAlign,
        lineHeight: content.lineHeight,
        letterSpacing: content.letterSpacing,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

function renderImageContent(content: ImageContent) {
  return (
    <img
      src={content.src}
      alt={content.alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: content.objectFit,
        display: "block",
      }}
      draggable={false}
    />
  );
}

function getShapeStyles(content: ShapeContent): React.CSSProperties {
  const base: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: content.fill,
  };

  if (content.stroke) {
    base.border = `${content.strokeWidth ?? 1}px solid ${content.stroke}`;
  }

  switch (content.shape) {
    case "circle":
      base.borderRadius = "50%";
      break;
    case "triangle":
      base.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      break;
    // rect and others use borderRadius from ElementStyle
  }

  return base;
}

function renderShapeContent(content: ShapeContent) {
  return <div style={getShapeStyles(content)} />;
}

function renderVideoContent(content: VideoContent) {
  return (
    <video
      src={content.src}
      autoPlay={content.autoplay}
      loop={content.loop}
      muted={content.muted}
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

function renderContent(content: ElementContent) {
  switch (content.type) {
    case "text":
      return renderTextContent(content);
    case "image":
      return renderImageContent(content);
    case "shape":
      return renderShapeContent(content);
    case "video":
      return renderVideoContent(content);
    default:
      return null;
  }
}

function buildTransformCSS(t: ElementTransform): React.CSSProperties {
  return {
    position: "absolute",
    left: t.x,
    top: t.y,
    width: t.width,
    height: t.height,
    opacity: t.opacity,
    transformOrigin: `${t.originX * 100}% ${t.originY * 100}%`,
    transform: `rotate(${t.rotation}deg) scaleX(${t.scaleX}) scaleY(${t.scaleY})`,
  };
}

function buildStyleCSS(s: ElementStyle): React.CSSProperties {
  const css: React.CSSProperties = {};
  if (s.backgroundColor) css.backgroundColor = s.backgroundColor;
  if (s.borderRadius != null) css.borderRadius = s.borderRadius;
  if (s.borderWidth != null && s.borderColor) {
    css.border = `${s.borderWidth}px solid ${s.borderColor}`;
  }
  if (s.boxShadow) css.boxShadow = s.boxShadow;
  if (s.filter) css.filter = s.filter;
  if (s.backdropFilter) css.backdropFilter = s.backdropFilter;
  if (s.clipPath) css.clipPath = s.clipPath;
  if (s.mixBlendMode) css.mixBlendMode = s.mixBlendMode as React.CSSProperties["mixBlendMode"];
  return css;
}

const SceneElementRenderer = memo(function SceneElementRenderer({
  element,
  interactive,
}: {
  element: SceneElement;
  interactive: boolean;
}) {
  if (!element.visible) return null;

  const transformCSS = buildTransformCSS(element.transform);
  const styleCSS = buildStyleCSS(element.style);

  return (
    <div
      data-element-id={element.id}
      data-depth-layer={element.depthLayer}
      data-interactive={interactive ? "true" : undefined}
      style={{
        ...transformCSS,
        ...styleCSS,
        zIndex: element.zIndex,
        pointerEvents: interactive && !element.locked ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      {renderContent(element.content)}
    </div>
  );
});

export const CinemaSceneRenderer = memo(function CinemaSceneRenderer({
  scene,
  zoom,
  interactive = false,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: CinemaSceneRendererProps) {
  const sortedElements = [...scene.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{
        width: width * zoom,
        height: height * zoom,
        position: "relative",
        overflow: "hidden",
        background: scene.backgroundGradient || scene.backgroundColor,
        transformOrigin: "0 0",
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {sortedElements.map((element) => (
          <SceneElementRenderer
            key={element.id}
            element={element}
            interactive={interactive}
          />
        ))}
      </div>
    </div>
  );
});

export default CinemaSceneRenderer;
