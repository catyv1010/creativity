"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const productLinks: Record<string, string> = {
  "Canvas Infinito": "/cinema-editor",
  "AI Studio": "/cinema-editor",
  "Plantillas": "/cinema-editor",
  "Transiciones": "/cinema-editor",
  "Colaboracion": "#",
};

const links = [
  { title: "Producto", items: ["Canvas Infinito","AI Studio","Plantillas","Transiciones","Colaboracion"] },
  { title: "Recursos", items: ["Tutoriales","Blog","Comunidad","API Docs","Changelog"] },
  { title: "Empresa", items: ["Sobre Nosotros","Carreras","Prensa","Contacto","Legal"] },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [email, setEmail] = useState("");

  return (
    <footer ref={ref} className="relative pt-24 pb-8 px-6 overflow-hidden bg-[#030014]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
      <div className="absolute inset-0 noise-animated pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden mb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-coral via-magenta to-purple" />
          <div className="relative p-10 sm:p-14 text-center">
            <h3 className="font-[var(--font-display)] text-3xl sm:text-5xl font-[900] text-white mb-4">Unete a la revolucion creativa</h3>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Se el primero en acceder a nuevas funciones y plantillas.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all font-medium" />
              <button className="hoverable px-8 py-3.5 rounded-xl bg-white text-coral font-bold hover:bg-gold hover:text-black transition-all duration-300 hover:scale-105 whitespace-nowrap">Suscribirme</button>
            </form>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-coral via-magenta to-purple rotate-6" />
                <div className="absolute inset-[2px] rounded-[6px] bg-[#030014] flex items-center justify-center">
                  <span className="text-sm font-extrabold text-shimmer font-[var(--font-display)]">C</span>
                </div>
              </div>
              <span className="text-lg font-extrabold font-[var(--font-display)] text-white">Creativity</span>
            </div>
            <p className="text-white/20 text-sm mb-6 max-w-xs leading-relaxed">La plataforma de presentaciones artisticas potenciada por IA.</p>
            <div className="flex gap-2">
              {["X","Li","Yt"].map((ic,i) => (
                <a key={i} href="#" className="hoverable w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/20 text-xs font-bold hover:bg-white/[0.08] hover:text-white/50 transition-all">{ic}</a>
              ))}
            </div>
          </div>
          {links.map((col,i) => (
            <div key={i}>
              <h4 className="font-[var(--font-display)] font-bold text-white/50 text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map((l,j) => <li key={j}><a href={col.title === "Producto" ? (productLinks[l] || "#") : "#"} className="hoverable link-bullet text-sm text-white/20 hover:text-coral transition-all duration-300">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/10 text-xs">&copy; 2026 Creativity. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            {["Privacidad","Terminos","Cookies"].map((x,i) => <a key={i} href="#" className="hoverable text-white/10 hover:text-white/30 text-xs transition-colors">{x}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
