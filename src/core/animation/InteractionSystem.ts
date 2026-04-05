import { gsap } from "gsap";
import type { SceneElement, ElementInteraction } from "../types/presentation";

/**
 * InteractionSystem — makes elements interactive during presentation.
 * Applies hover effects, tooltips, and click actions.
 */
export class InteractionSystem {
  private cleanupFns: (() => void)[] = [];

  /**
   * Apply all interactions for elements in a scene.
   * Call this when a scene becomes active in the presenter.
   */
  applyInteractions(elements: SceneElement[]) {
    this.cleanup(); // clean previous

    for (const element of elements) {
      if (!element.interactions || element.interactions.length === 0) continue;

      const el = document.querySelector(`[data-element-id="${element.id}"]`) as HTMLElement;
      if (!el) continue;

      for (const interaction of element.interactions) {
        const cleanup = this.applyInteraction(el, element, interaction);
        if (cleanup) this.cleanupFns.push(cleanup);
      }
    }
  }

  private applyInteraction(el: HTMLElement, element: SceneElement, interaction: ElementInteraction): (() => void) | null {
    switch (interaction.type) {
      case "hover-scale": return this.applyHoverScale(el, interaction);
      case "hover-glow": return this.applyHoverGlow(el, interaction);
      case "hover-lift": return this.applyHoverLift(el, interaction);
      case "hover-color": return this.applyHoverColor(el, interaction);
      case "click-tooltip": return this.applyClickTooltip(el, interaction);
      case "click-reveal": return this.applyClickReveal(el, interaction);
      case "click-link": return this.applyClickLink(el, interaction);
      default: return null;
    }
  }

  private applyHoverScale(el: HTMLElement, interaction: ElementInteraction): () => void {
    const scale = (interaction.params.scale as number) || 1.1;
    el.style.cursor = "pointer";
    el.style.transition = "transform 0.3s ease";

    const onEnter = () => { gsap.to(el, { scale, duration: 0.3, ease: "back.out(1.7)" }); };
    const onLeave = () => { gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" }); };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.style.cursor = "";
    };
  }

  private applyHoverGlow(el: HTMLElement, interaction: ElementInteraction): () => void {
    const color = (interaction.params.color as string) || "rgba(168, 85, 247, 0.6)";
    el.style.cursor = "pointer";

    const onEnter = () => {
      gsap.to(el, { boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { boxShadow: "none", duration: 0.4, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }

  private applyHoverLift(el: HTMLElement, interaction: ElementInteraction): () => void {
    el.style.cursor = "pointer";

    const onEnter = () => {
      gsap.to(el, { y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { y: 0, boxShadow: "none", duration: 0.3, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }

  private applyHoverColor(el: HTMLElement, interaction: ElementInteraction): () => void {
    const color = (interaction.params.color as string) || "#a855f7";
    const originalBg = el.style.backgroundColor;
    el.style.cursor = "pointer";

    const onEnter = () => {
      gsap.to(el, { backgroundColor: color, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { backgroundColor: originalBg || "transparent", duration: 0.3, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }

  private applyClickTooltip(el: HTMLElement, interaction: ElementInteraction): () => void {
    const text = (interaction.params.text as string) || "Info";
    const position = (interaction.params.position as string) || "top";
    el.style.cursor = "pointer";
    let tooltip: HTMLDivElement | null = null;

    const onClick = (e: Event) => {
      e.stopPropagation();

      // Toggle tooltip
      if (tooltip) {
        gsap.to(tooltip, { opacity: 0, y: position === "top" ? -10 : 10, duration: 0.2, onComplete: () => { tooltip?.remove(); tooltip = null; } });
        return;
      }

      tooltip = document.createElement("div");
      tooltip.textContent = text;
      tooltip.style.cssText = `
        position: absolute; z-index: 10000;
        padding: 8px 16px; border-radius: 8px;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        color: white; font-size: 14px; font-family: Inter, sans-serif;
        white-space: nowrap; pointer-events: none;
        border: 1px solid rgba(255,255,255,0.1);
      `;

      const rect = el.getBoundingClientRect();
      if (position === "top") {
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = "translate(-50%, -100%)";
      } else {
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.transform = "translate(-50%, 0)";
      }

      document.body.appendChild(tooltip);
      gsap.fromTo(tooltip, { opacity: 0, y: position === "top" ? 10 : -10 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" });

      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (tooltip) {
          gsap.to(tooltip, { opacity: 0, duration: 0.2, onComplete: () => { tooltip?.remove(); tooltip = null; } });
        }
      }, 3000);
    };

    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("click", onClick);
      tooltip?.remove();
    };
  }

  private applyClickReveal(el: HTMLElement, interaction: ElementInteraction): () => void {
    const targetId = interaction.params.targetElementId as string;
    if (!targetId) return () => {};

    el.style.cursor = "pointer";
    let revealed = false;

    const targetEl = document.querySelector(`[data-element-id="${targetId}"]`) as HTMLElement;
    if (!targetEl) return () => {};

    // Initially hide the target
    gsap.set(targetEl, { opacity: 0, scale: 0.8 });

    const onClick = (e: Event) => {
      e.stopPropagation();
      revealed = !revealed;
      if (revealed) {
        gsap.to(targetEl, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
      } else {
        gsap.to(targetEl, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" });
      }
    };

    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("click", onClick);
    };
  }

  private applyClickLink(el: HTMLElement, interaction: ElementInteraction): () => void {
    const url = interaction.params.url as string;
    const newTab = (interaction.params.newTab as boolean) ?? true;
    if (!url) return () => {};

    el.style.cursor = "pointer";

    const onClick = (e: Event) => {
      e.stopPropagation();
      if (newTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    };

    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("click", onClick);
    };
  }

  /** Remove all active interactions */
  cleanup() {
    for (const fn of this.cleanupFns) fn();
    this.cleanupFns = [];
    // Remove any orphaned tooltips
    document.querySelectorAll("[data-tooltip-overlay]").forEach(el => el.remove());
  }
}
