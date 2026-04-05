"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CanvasDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cRef, offset: ["start end", "end start"] });
  const mockupY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="canvas" ref={cRef} className="relative py-32 px-6 overflow-hidden bg-[#eef8f3]">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(6,150,120,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-700/10 bg-emerald-700/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-emerald-700/50 text-xs font-bold uppercase tracking-[0.2em]">Editor</span>
          </div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6 text-[#0a2020]">
            Canvas<br /><span className="relative inline-block"><span className="text-emerald-600">Infinito</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none"><path d="M4 8C50 2,150 2,196 8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </span>
          </h2>
          <p className="text-[#0a2020]/35 text-lg max-w-md mx-auto">Olvida las slides lineales. Navega libre por un espacio sin limites.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14 max-w-2xl mx-auto">
          {[{ n: "\u221E", l: "Canvas" }, { n: "100+", l: "Plantillas" }, { n: "30+", l: "Transiciones" }, { n: "60", l: "FPS" }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05 }} className="bg-white rounded-lg p-4 text-center shadow-[0_1px_8px_rgba(0,0,0,0.03)] border border-emerald-700/5">
              <div className="font-[var(--font-display)] text-2xl font-[900] text-[#0a2020]">{s.n}</div>
              <div className="text-[#0a2020]/30 text-[10px] mt-0.5 font-bold uppercase tracking-wider">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Parallax mockup */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y: mockupY }} className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden bg-[#0f0f1a] shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#1a1a2e] border-b border-white/5">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff5f57]" /><div className="w-3 h-3 rounded-full bg-[#febc2e]" /><div className="w-3 h-3 rounded-full bg-[#28c840]" /></div>
              <div className="flex-1 flex justify-center"><div className="px-5 py-1 rounded-md bg-white/5 text-white/25 text-xs">app.creativity.com/editor</div></div>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(100,100,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,200,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
                {["M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z","M4 6h16M4 12h16M4 18h7","M21 12a9 9 0 11-18 0 9 9 0 0118 0z","M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"].map((d,i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
                  </div>
                ))}
              </div>
              <motion.div animate={{ scale: [1, 1.015, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[12%] left-[20%] w-[34%] aspect-[16/10] rounded-lg bg-gradient-to-br from-purple/20 to-magenta/10 border-2 border-[#6d5aed] p-4">
                <div className="w-1/2 h-2 rounded bg-white/25 mb-2" /><div className="w-3/4 h-1.5 rounded bg-white/12 mb-1" /><div className="w-2/3 h-1.5 rounded bg-white/8 mb-4" />
                <div className="flex gap-2"><div className="w-1/3 h-12 rounded bg-purple/15" /><div className="w-1/3 h-12 rounded bg-magenta/15" /><div className="w-1/3 h-12 rounded bg-cyan/15" /></div>
                {["-top-1 -left-1","-top-1 -right-1","-bottom-1 -left-1","-bottom-1 -right-1"].map((p,j) => <div key={j} className={`absolute ${p} w-2.5 h-2.5 rounded-full bg-[#6d5aed] border-2 border-[#0f0f1a]`} />)}
              </motion.div>
              <motion.div animate={{ y: [0,-6,0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }} className="absolute top-[8%] right-[10%] w-[20%] aspect-[16/10] rounded-lg bg-gradient-to-br from-cyan/12 to-blue-500/8 border border-white/8 p-3">
                <div className="w-2/3 h-1.5 rounded bg-white/15 mb-2" /><div className="w-full h-10 rounded bg-white/[0.04]" />
              </motion.div>
              <motion.div animate={{ y: [0,5,0] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="absolute bottom-[14%] left-[12%] w-[18%] aspect-[16/10] rounded-lg bg-gradient-to-br from-amber-500/12 to-orange-500/8 border border-white/8 p-3">
                <div className="w-1/2 h-1.5 rounded bg-white/15 mb-2" /><div className="w-8 h-8 rounded-full bg-amber-500/15 mx-auto" />
              </motion.div>
              <motion.div animate={{ x: [0,6,0] }} transition={{ duration: 8, repeat: Infinity, delay: 1.5 }} className="absolute bottom-[10%] right-[12%] w-[23%] aspect-[16/10] rounded-lg bg-gradient-to-br from-rose-500/12 to-pink-500/8 border border-white/8 p-3">
                <div className="w-3/4 h-1.5 rounded bg-white/15 mb-1.5" /><div className="grid grid-cols-2 gap-1.5"><div className="h-7 rounded bg-white/[0.04]" /><div className="h-7 rounded bg-white/[0.04]" /></div>
              </motion.div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none"><line x1="54%" y1="32%" x2="70%" y2="20%" stroke="rgba(109,90,237,0.12)" strokeWidth="1" strokeDasharray="4 4" /><line x1="34%" y1="60%" x2="24%" y2="68%" stroke="rgba(245,158,11,0.12)" strokeWidth="1" strokeDasharray="4 4" /><line x1="54%" y1="55%" x2="64%" y2="68%" stroke="rgba(244,63,94,0.12)" strokeWidth="1" strokeDasharray="4 4" /></svg>
              <motion.div animate={{ x: [0,100,160,50,0], y: [0,-30,50,80,0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[43%] left-[43%] z-30">
                <svg width="18" height="22" viewBox="0 0 18 22" fill="white" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"><path d="M1 1l12 8.5-5 1.5-3.5 5.5z" /></svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
