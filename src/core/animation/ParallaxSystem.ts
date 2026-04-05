import { gsap } from "gsap";
import type { Scene, SceneElement, ParallaxConfig } from "../types/presentation";

/**
 * ParallaxSystem — depth illusion during camera movement.
 *
 * During any camera move, elements at different depthLayer values
 * move at different rates. Elements further back (negative depth)
 * move slower; elements in front (positive depth) move faster.
 * Optional depth-of-field blur adds to the illusion.
 */
export class ParallaxSystem {
  /**
   * Attaches parallax tweens to a camera-move timeline.
   * Called during AnimationEngine.build() for each scene with parallax enabled.
   *
   * @param timeline - The scene's sub-timeline (parallax tweens are added at position 0)
   * @param scene - The scene whose elements get parallax offsets
   * @param cameraDelta - How far the camera moves (used to compute layer offsets)
   */
  attachToTimeline(
    timeline: gsap.core.Timeline,
    scene: Scene,
    cameraDelta: { dx: number; dy: number }
  ) {
    const config = scene.parallax;
    if (!config?.enabled) return;

    for (const layer of config.layers) {
      const elements = scene.elements.filter(
        (el) => el.depthLayer === layer.depthLayer
      );

      if (elements.length === 0) continue;

      for (const el of elements) {
        const selector = `[data-element-id="${el.id}"]`;
        const offsetX = cameraDelta.dx * (layer.speedMultiplier - 1) * config.depthScale;
        const offsetY = cameraDelta.dy * (layer.speedMultiplier - 1) * config.depthScale;

        const tweenVars: gsap.TweenVars = {
          x: `+=${offsetX}`,
          y: `+=${offsetY}`,
          duration: timeline.duration(),
          ease: "none", // parallax should be linear relative to camera
        };

        // Depth-of-field blur
        if (layer.blur > 0) {
          tweenVars.filter = `blur(${layer.blur}px)`;
        }

        timeline.to(selector, tweenVars, 0);
      }
    }
  }

  /**
   * Creates a static parallax setup for a scene (no animation).
   * Applies initial depth-of-field blur and z-transform to elements.
   */
  applyStaticDepth(scene: Scene) {
    const config = scene.parallax;
    if (!config?.enabled) return;

    for (const layer of config.layers) {
      const elements = scene.elements.filter(
        (el) => el.depthLayer === layer.depthLayer
      );

      for (const el of elements) {
        const selector = `[data-element-id="${el.id}"]`;
        const zOffset = layer.depthLayer * config.depthScale * 10;

        gsap.set(selector, {
          z: zOffset,
          filter: layer.blur > 0 ? `blur(${layer.blur}px)` : "none",
        });
      }
    }
  }

  /**
   * Real-time parallax based on pointer position (for editor preview).
   * Gives a subtle depth preview as the user moves their mouse.
   */
  createPointerParallax(
    scene: Scene,
    containerEl: HTMLElement
  ): () => void {
    const config = scene.parallax;
    if (!config?.enabled) return () => {};

    const handler = (e: PointerEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = (e.clientX - rect.left - centerX) / centerX; // -1 to 1
      const offsetY = (e.clientY - rect.top - centerY) / centerY;

      for (const layer of config.layers) {
        const elements = scene.elements.filter(
          (el) => el.depthLayer === layer.depthLayer
        );

        const parallaxAmount = layer.speedMultiplier * config.depthScale * 15;

        for (const el of elements) {
          const selector = `[data-element-id="${el.id}"]`;
          gsap.to(selector, {
            x: `+=${offsetX * parallaxAmount}`,
            y: `+=${offsetY * parallaxAmount}`,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    };

    containerEl.addEventListener("pointermove", handler);
    return () => containerEl.removeEventListener("pointermove", handler);
  }
}
