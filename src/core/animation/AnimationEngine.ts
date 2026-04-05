import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import type {
  Presentation,
  Scene,
  AnimationDescriptor,
  GSAPPropertyMap,
} from "../types/presentation";
import { CameraSystem } from "./CameraSystem";
import { ParallaxSystem } from "./ParallaxSystem";
import { ANIMATION_PRESETS, type AnimationPresetKey } from "./easing-presets";

// Ensure plugins are available (they must be registered in gsap-register.ts)
void SplitText;
void TextPlugin;
void DrawSVGPlugin;

/**
 * AnimationEngine — the central GSAP orchestrator.
 *
 * It's a pure function: Presentation data → GSAP Master Timeline.
 * One master timeline controls the entire presentation.
 * Each scene gets a sub-timeline with camera move + element animations.
 *
 * The engine is used by both:
 * - The editor (for timeline scrubbing and preview)
 * - The presenter (for full playback)
 *
 * Supports premium GSAP plugins:
 * - SplitText: letter-by-letter, word-by-word, line-by-line text animations
 * - TextPlugin: typewriter effect
 * - ScrambleTextPlugin: scramble-decode text effect
 * - DrawSVGPlugin: progressive SVG stroke drawing
 * - Physics2DPlugin: explosion/scatter physics
 */
export class AnimationEngine {
  private masterTimeline: gsap.core.Timeline;
  private camera: CameraSystem;
  private parallax: ParallaxSystem;
  private sceneTimeOffsets: Map<string, number> = new Map();
  /** Track SplitText instances so we can revert them on destroy */
  private splitInstances: InstanceType<typeof SplitText>[] = [];

  constructor(worldEl: HTMLElement, presentation: Presentation) {
    this.masterTimeline = gsap.timeline({ paused: true });
    this.camera = new CameraSystem(worldEl, 1200);
    this.parallax = new ParallaxSystem();
    this.build(presentation);
  }

  /** Build the entire master timeline from presentation data. */
  private build(presentation: Presentation) {
    const { scenes } = presentation;
    if (scenes.length === 0) return;

    // Snap camera to first scene immediately
    this.camera.snapTo(scenes[0].worldTransform);

    let timeOffset = 0;

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const sceneTimeline = gsap.timeline();

      this.sceneTimeOffsets.set(scene.id, timeOffset);

      // 1. Camera movement TO this scene (skip for first scene)
      if (i > 0) {
        const cameraTween = this.camera.createMoveTo(
          scene.worldTransform,
          scene.transition
        );
        sceneTimeline.add(cameraTween, 0);
      }

      // 2. Parallax during camera move
      if (scene.parallax?.enabled && i > 0) {
        const prevScene = scenes[i - 1];
        const cameraDelta = {
          dx: scene.worldTransform.x - prevScene.worldTransform.x,
          dy: scene.worldTransform.y - prevScene.worldTransform.y,
        };
        this.parallax.attachToTimeline(sceneTimeline, scene, cameraDelta);
      }

      // 3. Element animations
      for (const element of scene.elements) {
        for (const anim of element.animations) {
          const tween = this.buildTween(element.id, anim);
          const insertTime = this.resolveInsertTime(anim, scene);
          sceneTimeline.add(tween, insertTime);
        }
      }

      // Ensure scene has minimum duration
      if (sceneTimeline.duration() < scene.duration) {
        sceneTimeline.set({}, {}, scene.duration);
      }

      this.masterTimeline.add(sceneTimeline, timeOffset);
      timeOffset += scene.duration;
    }
  }

  /**
   * Converts an AnimationDescriptor to a real GSAP tween.
   * If a preset is specified, merges preset properties with any custom overrides.
   * Special presets (text, SVG, physics) get dedicated handling.
   */
  private buildTween(elementId: string, desc: AnimationDescriptor): gsap.core.Animation {
    const target = `[data-element-id="${elementId}"]`;

    // Check for special preset types that need dedicated plugin handling
    if (desc.preset) {
      switch (desc.preset) {
        case "typewriter":
          return this.buildTypewriter(target, desc);
        case "scrambleIn":
          return this.buildScramble(target, desc);
        case "letterByLetter":
          return this.buildSplitText(target, desc, "chars");
        case "wordByWord":
          return this.buildSplitText(target, desc, "words");
        case "lineByLine":
          return this.buildSplitText(target, desc, "lines");
        case "drawSVG":
        case "drawSVGReverse":
          return this.buildDrawSVG(target, desc);
      }
    }

    // Standard preset + custom property merge
    let properties = { ...desc.properties };
    let easing = desc.easing;
    let duration = desc.timing.duration;

    if (desc.preset && desc.preset !== "none") {
      const preset = ANIMATION_PRESETS[desc.preset as AnimationPresetKey];
      if (preset) {
        properties = { ...preset.properties, ...properties };
        easing = easing || preset.easing;
        duration = duration || preset.duration;
      }
    }

    // Separate from/to values
    const fromVars: gsap.TweenVars = {};
    const toVars: gsap.TweenVars = {
      duration,
      ease: easing,
      repeat: desc.timing.repeat,
      yoyo: desc.timing.yoyo,
    };

    for (const [key, val] of Object.entries(properties)) {
      if (typeof val === "object" && val !== null && "from" in val) {
        fromVars[key] = val.from;
        toVars[key] = val.to;
      } else {
        toVars[key] = val;
      }
    }

    if (Object.keys(fromVars).length > 0) {
      return gsap.fromTo(target, fromVars, toVars);
    }
    return gsap.to(target, toVars);
  }

  // --- PLUGIN-SPECIFIC BUILDERS ---

  /**
   * Typewriter effect using GSAP TextPlugin.
   * Types text character by character with a cursor blink.
   */
  private buildTypewriter(target: string, desc: AnimationDescriptor): gsap.core.Timeline {
    const duration = desc.timing.duration || 2.0;
    const tl = gsap.timeline();

    // We need to capture the element's current text, then animate it via TextPlugin
    tl.add(() => {
      const el = document.querySelector(target) as HTMLElement;
      if (!el) return;
      const fullText = el.textContent || "";
      el.textContent = "";
      el.style.opacity = "1";

      gsap.to(el, {
        duration,
        text: { value: fullText, delimiter: "" },
        ease: "none",
      });
    });

    // Give the timeline the correct duration so it doesn't collapse
    tl.set({}, {}, duration + 0.1);
    return tl;
  }

  /**
   * Scramble text effect using ScrambleTextPlugin.
   * Characters scramble through random glyphs before settling.
   */
  private buildScramble(target: string, desc: AnimationDescriptor): gsap.core.Timeline {
    const duration = desc.timing.duration || 1.5;
    const tl = gsap.timeline();

    tl.add(() => {
      const el = document.querySelector(target) as HTMLElement;
      if (!el) return;
      const fullText = el.textContent || "";

      gsap.to(el, {
        duration,
        scrambleText: {
          text: fullText,
          chars: "01!@#$%&*<>{}[]",
          speed: 0.5,
          revealDelay: 0.3,
        },
        ease: "none",
      });
    });

    tl.set({}, {}, duration + 0.1);
    return tl;
  }

  /**
   * SplitText animation — splits text into chars/words/lines and staggers them in.
   */
  private buildSplitText(
    target: string,
    desc: AnimationDescriptor,
    splitType: "chars" | "words" | "lines",
  ): gsap.core.Timeline {
    const preset = ANIMATION_PRESETS[desc.preset as AnimationPresetKey];
    const duration = desc.timing.duration || preset?.duration || 1.2;
    const easing = desc.easing || preset?.easing || "power3.out";
    const tl = gsap.timeline();

    tl.add(() => {
      const el = document.querySelector(target) as HTMLElement;
      if (!el) return;

      const split = new SplitText(el, { type: splitType });
      this.splitInstances.push(split);

      const targets = split[splitType];
      if (!targets || targets.length === 0) return;

      // Build per-piece from/to vars from preset properties
      const fromVars: gsap.TweenVars = {};
      const toVars: gsap.TweenVars = {
        duration: duration / targets.length * 2,
        ease: easing,
        stagger: duration / targets.length * 0.6,
      };

      if (preset) {
        for (const [key, val] of Object.entries(preset.properties)) {
          if (typeof val === "object" && val !== null && "from" in val) {
            fromVars[key] = val.from;
            toVars[key] = val.to;
          } else {
            toVars[key] = val;
          }
        }
      }

      if (Object.keys(fromVars).length > 0) {
        gsap.fromTo(targets, fromVars, toVars);
      } else {
        gsap.to(targets, toVars);
      }
    });

    tl.set({}, {}, duration + 0.1);
    return tl;
  }

  /**
   * DrawSVG — progressively draws/undraws SVG stroke paths.
   */
  private buildDrawSVG(target: string, desc: AnimationDescriptor): gsap.core.Timeline {
    const duration = desc.timing.duration || 2.0;
    const easing = desc.easing || "power2.inOut";
    const isReverse = desc.preset === "drawSVGReverse";
    const tl = gsap.timeline();

    tl.add(() => {
      const el = document.querySelector(target) as HTMLElement;
      if (!el) return;

      // Find all stroke paths inside the element (or the element itself if it's an SVG path)
      const paths = el.tagName === "path" ? [el] : el.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect");

      gsap.fromTo(paths, {
        drawSVG: isReverse ? "100%" : "0%",
      }, {
        drawSVG: isReverse ? "0%" : "100%",
        duration,
        ease: easing,
        stagger: 0.15,
      });
    });

    tl.set({}, {}, duration + 0.2);
    return tl;
  }

  /** Resolves when an animation should start within its scene timeline. */
  private resolveInsertTime(anim: AnimationDescriptor, _scene: Scene): number | string {
    const base = anim.timing.startTime;
    const delay = anim.trigger.delay;

    switch (anim.trigger.type) {
      case "scene-enter":
        return base + delay;
      case "with-previous":
        return "<" + (delay > 0 ? `+=${delay}` : "");
      case "after-previous":
        return ">" + (delay > 0 ? `+=${delay}` : "");
      default:
        return base + delay;
    }
  }

  // --- Playback Controls ---

  play() {
    this.masterTimeline.play();
  }

  pause() {
    this.masterTimeline.pause();
  }

  resume() {
    this.masterTimeline.resume();
  }

  restart() {
    this.masterTimeline.restart();
  }

  /** Seek to an absolute time in the presentation. */
  seek(time: number) {
    this.masterTimeline.seek(time);
  }

  /** Jump directly to a scene by ID. */
  goToScene(sceneId: string) {
    const offset = this.sceneTimeOffsets.get(sceneId);
    if (offset !== undefined) {
      this.masterTimeline.seek(offset);
    }
  }

  /** Get the time offset for a scene. */
  getSceneTime(sceneId: string): number {
    return this.sceneTimeOffsets.get(sceneId) ?? 0;
  }

  /** Total duration of the presentation. */
  get duration(): number {
    return this.masterTimeline.duration();
  }

  /** Current playback time. */
  get currentTime(): number {
    return this.masterTimeline.time();
  }

  /** Whether the timeline is currently playing. */
  get isPlaying(): boolean {
    return this.masterTimeline.isActive();
  }

  /** Get the underlying GSAP timeline (for editor timeline scrubbing). */
  get timeline(): gsap.core.Timeline {
    return this.masterTimeline;
  }

  /** Clean up everything. */
  destroy() {
    this.masterTimeline.kill();
    this.camera.destroy();
    this.sceneTimeOffsets.clear();
    // Revert SplitText instances (restores original DOM)
    for (const split of this.splitInstances) {
      try { split.revert(); } catch { /* already reverted */ }
    }
    this.splitInstances = [];
  }
}
