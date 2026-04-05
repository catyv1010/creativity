"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseTooltip() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const half = window.innerWidth / 2;
      const boxW = el.offsetWidth || 100;
      if (e.clientX < half) {
        el.style.left = e.clientX + 25 + "px";
      } else {
        el.style.left = e.clientX - 25 - boxW + "px";
      }
      el.style.top = e.clientY + 25 + "px";
    };

    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const tip = target.getAttribute("data-tooltip");
      if (tip) {
        setText(tip);
        setVisible(true);
      }
    };

    const onLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", onMove);

    const attach = () => {
      document.querySelectorAll("[data-tooltip]").forEach((item) => {
        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
      });
    };

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-[9997] pointer-events-none px-3 py-1.5 bg-white text-black text-sm font-medium font-[var(--font-body)] rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {text}
    </div>
  );
}
