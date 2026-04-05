"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { usePresentationStore } from "@/store/presentationStore";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { registerGSAPPlugins } from "@/lib/gsap-register";
import { CameraSystem } from "@/core/animation/CameraSystem";
import { InteractionSystem } from "@/core/animation/InteractionSystem";
import { ANIMATION_PRESETS, type AnimationPresetKey } from "@/core/animation/easing-presets";
import type { Presentation, Scene, SceneElement, AnimationDescriptor, ElementContent as ContentType } from "@/core/types";
import * as LucideIcons from "lucide-react";
import QuizOverlay from "./QuizOverlay";

registerGSAPPlugins();

const SCENE_W = 1920;
const SCENE_H = 1080;

/**
 * CinemaPresenter — fullscreen cinematic presentation.
 *
 * All scenes rendered in world-space. Camera flies between them
 * using CameraSystem with cinematic transitions.
 * Arrow keys / click to navigate. Enter for auto-play.
 */
export default function CinemaPresenter() {
  const { presentation } = usePresentationStore();
  const { setPresentMode } = useCinemaEditorStore();
  const worldRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<CameraSystem | null>(null);
  const interactionRef = useRef<InteractionSystem>(new InteractionSystem());
  const animTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const { scenes } = presentation;

  // Calculate scale to fit viewport
  const getScale = () => {
    if (typeof window === "undefined") return 0.5;
    return Math.min(window.innerWidth / SCENE_W, window.innerHeight / SCENE_H);
  };

  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const onResize = () => setScale(getScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Center camera on scene center (scenes are positioned by top-left corner)
  const centerTarget = useCallback((wt: typeof scenes[0]["worldTransform"]) => ({
    ...wt,
    x: wt.x + SCENE_W / 2,
    y: wt.y + SCENE_H / 2,
  }), []);

  // Initialize camera and snap to first scene
  useEffect(() => {
    if (!worldRef.current || scenes.length === 0) return;

    // Pass viewportRef as overlay container so transition overlays render
    // OUTSIDE the scale/3D transform hierarchy (fixes iris clip-path freeze).
    cameraRef.current = new CameraSystem(worldRef.current, 1200, viewportRef.current ?? undefined);
    cameraRef.current.snapTo(centerTarget(scenes[0].worldTransform));

    // CameraSystem sets perspective & overflow:hidden on worldRef.parentElement
    // (the scale wrapper). Override: perspective belongs on viewport, overflow must be visible.
    if (worldRef.current.parentElement) {
      worldRef.current.parentElement.style.overflow = "visible";
      worldRef.current.parentElement.style.perspective = "none";
    }
    // Ensure perspective is on the actual viewport container
    if (viewportRef.current) {
      viewportRef.current.style.perspective = "1200px";
    }

    // Animate entrance elements of first scene
    animateSceneElements(scenes[0]);

    return () => {
      cameraRef.current?.destroy();
      cameraRef.current = null;
      interactionRef.current.cleanup();
      animTimelineRef.current?.kill();
    };
  }, []);

  // Animate elements within a scene (entrance animations + interactions)
  const animateSceneElements = useCallback((scene: Scene) => {
    // Kill previous element animations
    animTimelineRef.current?.kill();
    const tl = gsap.timeline();
    animTimelineRef.current = tl;

    for (const element of scene.elements) {
      if (!element.visible || element.animations.length === 0) continue;

      for (const anim of element.animations) {
        if (anim.type !== "entrance") continue;

        const target = `[data-element-id="${element.id}"]`;
        const preset = anim.preset && anim.preset !== "none"
          ? ANIMATION_PRESETS[anim.preset as AnimationPresetKey]
          : null;

        const properties = { ...(preset?.properties || {}), ...anim.properties };
        const fromVars: gsap.TweenVars = {};
        const toVars: gsap.TweenVars = {
          duration: anim.timing.duration || preset?.duration || 0.8,
          ease: anim.easing || preset?.easing || "power2.out",
          delay: anim.trigger.delay || 0,
        };

        for (const [key, val] of Object.entries(properties)) {
          if (typeof val === "object" && val !== null && "from" in val) {
            const fromTo = val as { from: unknown; to: unknown };
            fromVars[key] = fromTo.from;
            toVars[key] = fromTo.to;
          } else {
            toVars[key] = val;
          }
        }

        if (Object.keys(fromVars).length > 0) {
          // Force set initial state, then animate — avoids React style conflicts
          gsap.set(target, fromVars);
          tl.fromTo(target, fromVars, { ...toVars, immediateRender: false }, anim.timing.startTime || 0);
        } else {
          tl.to(target, toVars, anim.timing.startTime || 0);
        }
      }
    }

    // Apply interactions (hover-glow, hover-lift, click-tooltip, etc.)
    // Slight delay so DOM elements are rendered and animations have started
    requestAnimationFrame(() => {
      interactionRef.current.applyInteractions(scene.elements);
    });
  }, []);

  // Navigate to a scene with cinematic transition
  const goToScene = useCallback(
    (index: number) => {
      if (isAnimating || !cameraRef.current) return;
      const clamped = Math.max(0, Math.min(scenes.length - 1, index));
      if (clamped === currentIndex) return;

      setIsAnimating(true);
      const targetScene = scenes[clamped];

      // Fly camera to target scene (center of scene, not top-left)
      const animation = cameraRef.current.createMoveTo(
        centerTarget(targetScene.worldTransform),
        targetScene.transition
      );

      // When camera arrives, animate scene elements.
      // Delay animateSceneElements so React re-render from setCurrentIndex
      // completes first — otherwise React overwrites GSAP's inline styles.
      const onTransitionDone = () => {
        setCurrentIndex(clamped);
        setIsAnimating(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            animateSceneElements(targetScene);
          });
        });
      };

      if (animation instanceof gsap.core.Timeline) {
        animation.eventCallback("onComplete", onTransitionDone);
      } else {
        (animation as gsap.core.Tween).eventCallback("onComplete", onTransitionDone);
      }
    },
    [currentIndex, scenes, isAnimating, animateSceneElements]
  );

  // Auto-play all scenes
  const playAll = useCallback(() => {
    if (currentIndex >= scenes.length - 1) return;

    let idx = currentIndex;
    const playNext = () => {
      idx++;
      if (idx >= scenes.length) return;

      const targetScene = scenes[idx];
      const animation = cameraRef.current?.createMoveTo(
        centerTarget(targetScene.worldTransform),
        targetScene.transition
      );

      if (!animation) return;

      const onDone = () => {
        setCurrentIndex(idx);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            animateSceneElements(targetScene);
            // Wait for scene duration then go next
            if (idx < scenes.length - 1) {
              gsap.delayedCall(targetScene.duration - targetScene.transition.duration, playNext);
            }
          });
        });
      };

      if (animation instanceof gsap.core.Timeline) {
        animation.eventCallback("onComplete", onDone);
      } else {
        (animation as gsap.core.Tween).eventCallback("onComplete", onDone);
      }
    };

    playNext();
  }, [currentIndex, scenes, animateSceneElements]);

  // Hide quiz when navigating to a different scene
  const goToSceneWithQuizReset = useCallback(
    (index: number) => {
      setShowQuiz(false);
      goToScene(index);
    },
    [goToScene]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // When quiz is open, let QuizOverlay handle Escape/Space/Enter — don't nav slides
      if (showQuiz) return;

      switch (e.key) {
        case "Escape":
          setPresentMode(false);
          break;
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goToSceneWithQuizReset(currentIndex + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToSceneWithQuizReset(currentIndex - 1);
          break;
        case "Enter":
          playAll();
          break;
        case "q":
        case "Q":
          // Q to launch quiz on current scene (if it has one)
          if (scenes[currentIndex]?.quiz) setShowQuiz(true);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    document.documentElement.requestFullscreen?.().catch(() => {});

    return () => {
      window.removeEventListener("keydown", handler);
      document.exitFullscreen?.().catch(() => {});
    };
  }, [currentIndex, goToSceneWithQuizReset, playAll, setPresentMode, showQuiz, scenes]);

  const currentScene = scenes[currentIndex];
  const hasQuiz = !!currentScene?.quiz;

  return (
    <div
      className="fixed inset-0 bg-black z-[9999] overflow-hidden"
      onClick={() => { if (!showQuiz) goToSceneWithQuizReset(currentIndex + 1); }}
    >
      {/* Viewport — perspective container */}
      <div
        ref={viewportRef}
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: "1200px", overflow: "hidden", position: "relative" }}
      >
        {/* Scale wrapper — viewport fit. Separate from worldRef so GSAP won't overwrite it */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          {/* World container — CameraSystem transforms this div */}
          <div
            ref={worldRef}
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
            }}
          >
          {/* All scenes at their world positions */}
          {scenes.map((scene) => (
            <div
              key={scene.id}
              data-scene-id={scene.id}
              className="absolute"
              style={{
                left: scene.worldTransform.x,
                top: scene.worldTransform.y,
                width: SCENE_W,
                height: SCENE_H,
                transform: `rotate(${scene.worldTransform.rotation}deg) scale(${scene.worldTransform.scale})`,
                transformOrigin: "center center",
                backgroundColor: scene.backgroundColor,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {/* Background image layer */}
              {scene.backgroundImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${scene.backgroundImage})`,
                    filter: scene.backgroundBlur ? `blur(${scene.backgroundBlur}px)` : undefined,
                    transform: scene.backgroundBlur ? "scale(1.1)" : undefined,
                  }}
                />
              )}
              {/* Background gradient/overlay layer */}
              {(scene.backgroundGradient || scene.backgroundOverlay) && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: scene.backgroundGradient || undefined,
                    backgroundColor: scene.backgroundOverlay || undefined,
                  }}
                />
              )}
              {/* Render elements */}
              {scene.elements
                .filter((el) => el.visible)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => (
                  <div
                    key={element.id}
                    data-element-id={element.id}
                    data-depth-layer={element.depthLayer}
                    className="absolute"
                    style={{
                      left: element.transform.x,
                      top: element.transform.y,
                      width: element.transform.width,
                      height: element.transform.height,
                      transform: `rotate(${element.transform.rotation}deg) scaleX(${element.transform.scaleX}) scaleY(${element.transform.scaleY})`,
                      transformOrigin: `${element.transform.originX * 100}% ${element.transform.originY * 100}%`,
                      opacity: element.transform.opacity,
                      zIndex: element.zIndex,
                      backgroundColor: element.style.backgroundColor,
                      borderRadius: element.style.borderRadius,
                      boxShadow: element.style.boxShadow,
                      filter: element.style.filter,
                      clipPath: element.style.clipPath,
                      mixBlendMode: element.style.mixBlendMode as React.CSSProperties["mixBlendMode"],
                      // Non-interactive elements shouldn't block hover on interactive ones below
                      pointerEvents: (!element.interactions || element.interactions.length === 0) ? "none" : "auto",
                    }}
                  >
                    <PresenterContent content={element.content} />
                  </div>
                ))}
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Scene navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={(e) => { e.stopPropagation(); goToSceneWithQuizReset(i); }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentIndex
                  ? "w-8 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  : i < currentIndex
                    ? "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                    : "w-2.5 h-2.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Quiz launch button — only shown when current scene has a quiz */}
        <AnimatePresence>
          {hasQuiz && !showQuiz && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowQuiz(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600/80 hover:bg-purple-500/90 backdrop-blur-md border border-purple-400/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
              title="Lanzar quiz (Q)"
            >
              <span className="text-white text-sm">🎯</span>
              <span className="text-white text-xs font-semibold tracking-wide">Lanzar Quiz</span>
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Scene counter */}
      <div className="absolute bottom-4 right-4 text-white/15 text-xs font-mono z-10">
        {currentIndex + 1} / {scenes.length}
      </div>

      {/* Tip */}
      <div className="absolute top-4 left-4 text-white/10 text-[10px] font-mono z-10">
        ← → navegar · Enter auto-play · {hasQuiz ? "Q quiz · " : ""}Esc salir
      </div>

      {/* Exit */}
      <button
        onClick={(e) => { e.stopPropagation(); setPresentMode(false); }}
        className="absolute top-4 right-4 text-white/15 hover:text-white/40 text-xs cursor-pointer transition-colors z-10"
      >
        ESC
      </button>

      {/* Quiz overlay — rendered OUTSIDE the scale/3D hierarchy */}
      <AnimatePresence>
        {showQuiz && currentScene?.quiz && (
          <QuizOverlay
            quiz={currentScene.quiz}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PresenterContent({ content }: { content: ContentType }) {
  switch (content.type) {
    case "text":
      return (
        <div
          className="w-full h-full whitespace-pre-wrap break-words overflow-hidden"
          style={{
            fontSize: content.fontSize,
            fontWeight: content.fontWeight,
            fontFamily: content.fontFamily || "Inter, sans-serif",
            textAlign: content.textAlign,
            color: content.color,
            lineHeight: content.lineHeight || 1.3,
            letterSpacing: content.letterSpacing != null ? `${content.letterSpacing}px` : undefined,
          }}
        >
          {content.html}
        </div>
      );
    case "image":
      return (
        <img src={content.src} alt={content.alt} className="w-full h-full" style={{ objectFit: content.objectFit }} draggable={false} />
      );
    case "shape": {
      const s: React.CSSProperties = { width: "100%", height: "100%", backgroundColor: content.fill };
      if (content.shape === "circle") s.borderRadius = "50%";
      if (content.shape === "triangle") s.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      return <div style={s} />;
    }
    case "icon":
      return <PresenterIcon name={content.iconName} color={content.color} strokeWidth={content.strokeWidth} filled={content.filled} />;
    case "divider":
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: content.color,
            borderStyle: content.style === "gradient" ? "solid" : content.style,
            ...(content.direction === "vertical" ? { width: content.thickness, height: "100%" } : { height: content.thickness, width: "100%" }),
          }}
        />
      );
    case "video":
      return <video src={content.src} autoPlay={content.autoplay} loop={content.loop} muted={content.muted} className="w-full h-full object-cover" />;
    default:
      return null;
  }
}

/** Dynamic Lucide icon renderer for the presenter */
function PresenterIcon({ name, color = "#fff", strokeWidth = 2, filled }: { name: string; color?: string; strokeWidth?: number; filled?: boolean }) {
  try {
    const Icon = (LucideIcons as Record<string, any>)[name];
    if (!Icon || typeof Icon !== "function") {
      // Fallback: circle with first letter
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ color }}>
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
            <circle cx="12" cy="12" r="10" />
            <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">{name.charAt(0)}</text>
          </svg>
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Icon size={undefined} width="65%" height="65%" color={color} strokeWidth={strokeWidth} fill={filled ? color : "none"} />
      </div>
    );
  } catch {
    return <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">{name}</div>;
  }
}
