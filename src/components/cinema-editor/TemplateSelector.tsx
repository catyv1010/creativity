"use client";

import { TEMPLATE_CATALOG } from "@/core/scene/templates";
import { PREMIUM_TEMPLATE_CATALOG } from "@/core/scene/premium-templates";
import { usePresentationStore } from "@/store/presentationStore";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { Sparkles, X, Crown, Film, Layers, Eye, Zap } from "lucide-react";

const BASIC_ICONS = [Film, Layers, Eye, Zap];

interface Props {
  onClose: () => void;
}

export default function TemplateSelector({ onClose }: Props) {
  const { loadPresentation } = usePresentationStore();
  const { setActiveScene } = useCinemaEditorStore();

  const applyTemplate = (createFn: () => any) => {
    const presentation = createFn();
    loadPresentation(presentation);
    if (presentation.scenes.length > 0) {
      setActiveScene(presentation.scenes[0].id);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      style={{ cursor: "default" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#12121f] border border-white/10 rounded-2xl w-[780px] max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h2 className="text-white font-semibold text-sm">Plantillas</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-8">
          {/* PREMIUM TEMPLATES — with real photo previews */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={16} className="text-amber-400" />
              <span className="text-white/80 text-sm font-semibold">Premium — Con imagenes reales</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PREMIUM_TEMPLATE_CATALOG.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.create)}
                  className="group text-left rounded-xl border border-white/5 hover:border-purple-500/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer overflow-hidden"
                >
                  {/* Real photo preview */}
                  <div className="w-full h-40 overflow-hidden relative">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121f] via-transparent to-transparent" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-amber-500/20 border border-amber-500/30">
                      <span className="text-amber-400 text-[10px] font-bold">PREMIUM</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white/90 text-sm font-semibold mb-1">{template.name}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* BASIC TEMPLATES */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film size={16} className="text-purple-400" />
              <span className="text-white/80 text-sm font-semibold">Cinematograficas</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATE_CATALOG.map((template, i) => {
                const Icon = BASIC_ICONS[i % BASIC_ICONS.length];
                const gradients = [
                  "from-indigo-600/30 to-purple-600/30",
                  "from-cyan-600/30 to-teal-600/30",
                  "from-gray-600/30 to-zinc-800/30",
                  "from-rose-600/30 to-amber-600/30",
                ];
                return (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template.create)}
                    className="group text-left p-4 rounded-xl border border-white/5 hover:border-purple-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-3 group-hover:scale-[1.02] transition-transform`}>
                      <Icon size={28} className="text-white/25 group-hover:text-white/50 transition-colors" />
                    </div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">{template.name}</h3>
                    <p className="text-white/35 text-xs leading-relaxed">{template.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
