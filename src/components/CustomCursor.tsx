"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ dot: { x: 0, y: 0 }, ring: { x: 0, y: 0 } });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth lerp loop like makemepulse
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // Dot follows fast
      pos.current.dot.x = lerp(pos.current.dot.x, mouse.current.x, 0.35);
      pos.current.dot.y = lerp(pos.current.dot.y, mouse.current.y, 0.35);
      // Ring follows slower — creates lag effect
      pos.current.ring.x = lerp(pos.current.ring.x, mouse.current.x, 0.12);
      pos.current.ring.y = lerp(pos.current.ring.y, mouse.current.y, 0.12);

      if (dot.current) {
        dot.current.style.left = pos.current.dot.x + "px";
        dot.current.style.top = pos.current.dot.y + "px";
      }
      if (ring.current) {
        ring.current.style.left = pos.current.ring.x + "px";
        ring.current.style.top = pos.current.ring.y + "px";
      }
      raf = requestAnimationFrame(animate);
    };

    const addHover = () => ring.current?.classList.add("hovering");
    const removeHover = () => ring.current?.classList.remove("hovering");

    window.addEventListener("mousemove", onMove);
    animate();

    // Observe DOM for hoverable elements (handles dynamic content)
    const attachHovers = () => {
      document.querySelectorAll("a, button, .hoverable").forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };
    attachHovers();
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot hidden md:block" />
      <div ref={ring} className="cursor-ring hidden md:block" />
    </>
  );
}
