import { gsap } from "gsap";
import type { WorldTransform, TransitionDescriptor } from "../types/presentation";

/**
 * CameraSystem — the cinematic core.
 *
 * The camera does NOT move the viewport. Instead, it transforms the
 * world container inversely. If the camera should be at (1000, 500)
 * zoomed 2x, the world container gets translated (-1000, -500) scaled 2x.
 *
 * All scene elements stay in world-space; the camera "flies" through them.
 */
export class CameraSystem {
  private worldEl: HTMLElement;
  private perspective: number;
  private overlayRoot: HTMLElement;

  /**
   * @param worldEl      — the world container that gets inverse-transformed
   * @param perspective   — CSS perspective value in px
   * @param overlayRoot   — element where transition overlays are appended.
   *                        Defaults to worldEl.parentElement. For correct rendering,
   *                        pass a container OUTSIDE any scale/3D transform hierarchy
   *                        (e.g. the viewport div).
   */
  constructor(worldEl: HTMLElement, perspective = 1200, overlayRoot?: HTMLElement) {
    this.worldEl = worldEl;
    this.perspective = perspective;
    this.overlayRoot = overlayRoot || worldEl.parentElement!;

    // Set up the world container for 3D transforms
    worldEl.style.transformStyle = "preserve-3d";
    if (worldEl.parentElement) {
      worldEl.parentElement.style.perspective = `${perspective}px`;
      worldEl.parentElement.style.overflow = "hidden";
    }
  }

  /**
   * Creates a GSAP tween/timeline that moves the camera to a target scene.
   * The transition type determines the visual effect used.
   */
  createMoveTo(target: WorldTransform, transition: TransitionDescriptor): gsap.core.Animation {
    // Inverse transform: camera position → world container transform
    const cameraVars: gsap.TweenVars = {
      x: -target.x,
      y: -target.y,
      z: -target.z,
      rotation: -target.rotation,
      scale: 1 / (target.scale || 1),
      duration: transition.duration,
      ease: transition.easing,
    };

    switch (transition.type) {
      case "dolly-zoom":
        return this.createDollyZoom(cameraVars, transition);
      case "whip-pan":
        return this.createWhipPan(cameraVars, transition);
      case "zoom-blur":
        return this.createZoomBlur(cameraVars, transition);
      case "iris":
        return this.createIris(cameraVars, transition);
      case "film-grain-cut":
        return this.createFilmGrainCut(cameraVars, transition);
      case "fade":
        return this.createFade(cameraVars, transition);
      case "parallax-shift":
        return this.createParallaxShift(cameraVars, transition);
      case "glitch-cut":
        return this.createGlitchCut(cameraVars, transition);
      case "morph-wipe":
        return this.createMorphWipe(cameraVars, transition);
      case "slide-over":
        return this.createSlideOver(cameraVars, transition);
      case "ripple":
        return this.createRipple(cameraVars, transition);
      case "rotate-3d":
        return this.createRotate3D(cameraVars, transition);
      case "camera-move":
      default:
        return gsap.to(this.worldEl, cameraVars);
    }
  }

  /**
   * Immediately snap camera to a position (no animation).
   */
  snapTo(target: WorldTransform) {
    gsap.set(this.worldEl, {
      x: -target.x,
      y: -target.y,
      z: -target.z,
      rotation: -target.rotation,
      scale: 1 / (target.scale || 1),
    });
  }

  // --- Cinematic Transition Implementations ---

  /** Hitchcock/Vertigo: simultaneous zoom + perspective change */
  private createDollyZoom(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const perspEnd = (transition.params.perspectiveEnd as number) || this.perspective * 0.5;
    const counterScale = (transition.params.counterScale as number) || 1.3;

    tl.to(this.worldEl, { ...vars })
      .to(this.worldEl.parentElement!, {
        perspective: perspEnd,
        duration: transition.duration,
        ease: transition.easing,
      }, 0)
      .fromTo(this.worldEl, { scaleY: 1 }, {
        scaleY: counterScale,
        duration: transition.duration * 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      }, 0);

    // Restore perspective
    tl.set(this.worldEl.parentElement!, { perspective: this.perspective });
    return tl;
  }

  /** Fast horizontal snap with motion blur effect */
  private createWhipPan(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const blurOverlay = this.getOrCreateOverlay("whip-blur");

    tl.to(this.worldEl, { ...vars, ease: "power4.inOut" })
      .fromTo(blurOverlay, { opacity: 0 }, {
        opacity: 0.7,
        duration: transition.duration * 0.3,
        ease: "power2.in",
      }, 0)
      .to(blurOverlay, {
        opacity: 0,
        duration: transition.duration * 0.3,
        ease: "power2.out",
      }, transition.duration * 0.7);

    return tl;
  }

  /** Zoom in/out with radial blur */
  private createZoomBlur(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();

    tl.to(this.worldEl, vars)
      .fromTo(this.worldEl, { filter: "blur(0px)" }, {
        filter: "blur(8px)",
        duration: transition.duration * 0.4,
        ease: "power2.in",
      }, 0)
      .to(this.worldEl, {
        filter: "blur(0px)",
        duration: transition.duration * 0.4,
        ease: "power2.out",
      }, transition.duration * 0.6);

    return tl;
  }

  /** Circular iris wipe using clip-path */
  private createIris(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const overlay = this.getOrCreateOverlay("iris");

    // Close iris
    tl.fromTo(overlay, {
      clipPath: "circle(100% at 50% 50%)",
      backgroundColor: "#000",
      opacity: 1,
    }, {
      clipPath: "circle(0% at 50% 50%)",
      duration: transition.duration * 0.45,
      ease: "power2.in",
    });

    // Snap camera while iris is closed
    tl.add(() => {
      gsap.set(this.worldEl, {
        x: vars.x,
        y: vars.y,
        z: vars.z,
        rotation: vars.rotation,
        scale: vars.scale,
      });
    });

    // Open iris
    tl.fromTo(overlay, {
      clipPath: "circle(0% at 50% 50%)",
    }, {
      clipPath: "circle(100% at 50% 50%)",
      duration: transition.duration * 0.45,
      ease: "power2.out",
    });

    tl.set(overlay, { opacity: 0 });
    return tl;
  }

  /** Hard cut with brief film grain flash */
  private createFilmGrainCut(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const grain = this.getOrCreateOverlay("film-grain");

    // Flash grain
    tl.set(grain, { opacity: 1 });
    // Snap camera instantly
    tl.set(this.worldEl, {
      x: vars.x,
      y: vars.y,
      z: vars.z,
      rotation: vars.rotation,
      scale: vars.scale,
    });
    // Fade grain out
    tl.to(grain, { opacity: 0, duration: transition.duration, ease: "power1.out" });

    return tl;
  }

  /** Cross-fade between scenes */
  private createFade(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const overlay = this.getOrCreateOverlay("fade");

    tl.to(overlay, {
      opacity: 1,
      backgroundColor: "#000",
      duration: transition.duration * 0.5,
      ease: "power1.inOut",
    });
    tl.set(this.worldEl, {
      x: vars.x,
      y: vars.y,
      z: vars.z,
      rotation: vars.rotation,
      scale: vars.scale,
    });
    tl.to(overlay, {
      opacity: 0,
      duration: transition.duration * 0.5,
      ease: "power1.inOut",
    });

    return tl;
  }

  /** Lateral movement with depth-aware parallax offset */
  private createParallaxShift(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    // Base camera move — parallax layers are handled by ParallaxSystem
    return gsap.to(this.worldEl, {
      ...vars,
      ease: "power2.inOut",
    });
  }

  /** Digital glitch with RGB channel split and noise flash */
  private createGlitchCut(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const overlay = this.getOrCreateOverlay("glitch");

    // Style the overlay for glitch
    overlay.style.backgroundColor = "transparent";
    overlay.style.backgroundImage = `
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")
    `;
    overlay.style.mixBlendMode = "overlay";

    const d = transition.duration;

    // Phase 1: Glitch flickers + RGB shift
    tl.set(overlay, { opacity: 1 });
    tl.to(this.worldEl, {
      filter: "saturate(2) hue-rotate(90deg)",
      x: `+=${10}`,
      duration: d * 0.15,
      ease: "steps(3)",
    });
    tl.to(this.worldEl, {
      filter: "saturate(3) hue-rotate(-60deg) brightness(1.5)",
      x: `-=${20}`,
      duration: d * 0.1,
      ease: "steps(4)",
    });

    // Phase 2: Snap camera
    tl.set(this.worldEl, {
      x: vars.x,
      y: vars.y,
      z: vars.z,
      rotation: vars.rotation,
      scale: vars.scale,
      filter: "saturate(2) hue-rotate(30deg)",
    });

    // Phase 3: Settle
    tl.to(this.worldEl, {
      filter: "saturate(1) hue-rotate(0deg) brightness(1)",
      duration: d * 0.3,
      ease: "power2.out",
    });
    tl.to(overlay, { opacity: 0, duration: d * 0.2 }, `-=${d * 0.15}`);

    return tl;
  }

  /** Organic blob wipe — uses an SVG shape clip-path */
  private createMorphWipe(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const overlay = this.getOrCreateOverlay("morph-wipe");
    overlay.style.backgroundColor = (transition.params.color as string) || "#000";

    const d = transition.duration;

    // Expand a blob from center
    tl.fromTo(overlay, {
      opacity: 1,
      clipPath: "ellipse(0% 0% at 50% 50%)",
    }, {
      clipPath: "ellipse(120% 120% at 50% 50%)",
      duration: d * 0.5,
      ease: "power3.in",
    });

    // Snap camera
    tl.set(this.worldEl, {
      x: vars.x, y: vars.y, z: vars.z,
      rotation: vars.rotation, scale: vars.scale,
    });

    // Shrink blob away
    tl.fromTo(overlay, {
      clipPath: "ellipse(120% 120% at 50% 50%)",
    }, {
      clipPath: "ellipse(0% 0% at 50% 50%)",
      duration: d * 0.5,
      ease: "power3.out",
    });
    tl.set(overlay, { opacity: 0 });

    return tl;
  }

  /** New scene slides over the previous (like a stack of cards) */
  private createSlideOver(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const overlay = this.getOrCreateOverlay("slide-over");
    const direction = (transition.params.direction as string) || "left";

    overlay.style.backgroundColor = (transition.params.color as string) || "#111";

    const d = transition.duration;
    const axis = direction === "left" || direction === "right" ? "x" : "y";
    const sign = direction === "left" || direction === "up" ? -1 : 1;

    // Slide overlay in from edge
    tl.fromTo(overlay, {
      opacity: 1,
      [axis]: `${sign * 100}%`,
    }, {
      [axis]: "0%",
      duration: d * 0.5,
      ease: "power3.inOut",
    });

    // Snap camera
    tl.set(this.worldEl, {
      x: vars.x, y: vars.y, z: vars.z,
      rotation: vars.rotation, scale: vars.scale,
    });

    // Slide overlay out the other side
    tl.to(overlay, {
      [axis]: `${-sign * 100}%`,
      duration: d * 0.5,
      ease: "power3.inOut",
    });
    tl.set(overlay, { opacity: 0, x: 0, y: 0 });

    return tl;
  }

  /** Water ripple dissolve using CSS filter animation */
  private createRipple(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const d = transition.duration;

    // Apply a "ripple" feel using scale oscillation + blur
    tl.to(this.worldEl, {
      filter: "blur(6px) brightness(1.3)",
      scale: `*=${1.02}`,
      duration: d * 0.3,
      ease: "sine.inOut",
    });

    tl.to(this.worldEl, {
      filter: "blur(12px) brightness(0.8)",
      duration: d * 0.2,
      ease: "sine.in",
    });

    // Snap camera at peak blur
    tl.set(this.worldEl, {
      x: vars.x, y: vars.y, z: vars.z,
      rotation: vars.rotation, scale: vars.scale,
      filter: "blur(12px) brightness(0.8)",
    });

    // Resolve ripple
    tl.to(this.worldEl, {
      filter: "blur(0px) brightness(1)",
      duration: d * 0.5,
      ease: "power2.out",
    });

    return tl;
  }

  /** 3D cube-like rotation — rotates the world container in 3D */
  private createRotate3D(vars: gsap.TweenVars, transition: TransitionDescriptor) {
    const tl = gsap.timeline();
    const axis = (transition.params.axis as string) || "Y";
    const angle = axis === "Y" ? 90 : -90;
    const d = transition.duration;

    // Rotate out
    tl.to(this.worldEl, {
      [`rotation${axis}`]: angle,
      opacity: 0,
      duration: d * 0.5,
      ease: "power3.in",
    });

    // Snap camera and set entry rotation
    tl.set(this.worldEl, {
      x: vars.x, y: vars.y, z: vars.z,
      rotation: vars.rotation, scale: vars.scale,
      [`rotation${axis}`]: -angle,
      opacity: 0,
    });

    // Rotate in
    tl.to(this.worldEl, {
      [`rotation${axis}`]: 0,
      opacity: 1,
      duration: d * 0.5,
      ease: "power3.out",
    });

    return tl;
  }

  // --- Overlay management ---

  private getOrCreateOverlay(id: string): HTMLElement {
    const parent = this.overlayRoot;
    let overlay = parent.querySelector(`[data-overlay="${id}"]`) as HTMLElement;

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.dataset.overlay = id;
      overlay.style.cssText = `
        position: absolute; inset: 0; pointer-events: none; z-index: 9999; opacity: 0;
      `;

      if (id === "film-grain") {
        overlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`;
        overlay.style.mixBlendMode = "overlay";
      }

      if (id === "whip-blur") {
        overlay.style.background = "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, transparent 100%)";
        overlay.style.backdropFilter = "blur(12px)";
      }

      parent.appendChild(overlay);
    }

    return overlay;
  }

  /** Clean up overlays */
  destroy() {
    this.overlayRoot?.querySelectorAll("[data-overlay]").forEach((el) => el.remove());
  }
}
