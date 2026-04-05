"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import AnimatedLogo from "./AnimatedLogo";

const links = [
  { label: "AI Studio", href: "#features" },
  { label: "Plantillas", href: "#templates" },
  { label: "Canvas", href: "#canvas" },
  { label: "Precios", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "nav-blur border-b border-white/8 py-0"
          : "border-b border-transparent py-0"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        <a href="#" className="hoverable">
          <AnimatedLogo size={scrolled ? "sm" : "md"} />
        </a>

        {/* Nav links with underline animation (Paper Tiger style) */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a key={link.href} href={link.href}
              className="hoverable relative px-4 py-2 text-sm text-white/50 hover:text-white transition-colors duration-400 font-medium group"
              style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
              {link.label}
              {/* Underline wipe */}
              <span className="absolute bottom-0.5 left-4 right-4 h-px bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)" }} />
            </a>
          ))}
        </div>

        {/* CTA button with wipe fill (Paper Tiger style) */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="hoverable text-sm text-white/50 hover:text-white transition-colors duration-400">
            Iniciar Sesion
          </a>
          <a href="/cinema-editor" className="hoverable group relative text-sm px-6 py-2.5 rounded-full border border-white/15 overflow-hidden font-bold transition-colors duration-700"
            style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 flex items-center gap-2">
              Comenzar Gratis
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 rounded-full" style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }} />
          </a>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-white/70 hover:text-white py-2">{link.label}</a>
          ))}
          <a href="/cinema-editor" className="mt-2 text-center px-5 py-3 rounded-full bg-coral text-white font-bold">Comenzar Gratis</a>
        </motion.div>
      )}
    </motion.nav>
  );
}
