"use client";

import { useEditorStore } from "@/store/editorStore";
import SlideRenderer from "../SlideRenderer";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "@/lib/defaults";
import { Plus, Copy, Trash2 } from "lucide-react";

const THUMB_W = 192;
const THUMB_SCALE = THUMB_W / SLIDE_WIDTH;
const THUMB_H = SLIDE_HEIGHT * THUMB_SCALE;

export default function SlidePanel() {
  const { presentation, activeSlideId, setActiveSlide, addSlide, duplicateSlide, deleteSlide } = useEditorStore();

  return (
    <div className="w-56 bg-[#0f0f1a] border-r border-white/5 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Slides</span>
        <button onClick={addSlide} className="w-6 h-6 rounded bg-purple/20 hover:bg-purple/30 flex items-center justify-center text-purple transition-colors cursor-pointer">
          <Plus size={14} />
        </button>
      </div>

      {/* Slide thumbnails */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {presentation.slideOrder.map((sid, i) => {
          const slide = presentation.slides[sid];
          if (!slide) return null;
          const isActive = sid === activeSlideId;

          return (
            <div key={sid} className="group relative">
              <button
                onClick={() => setActiveSlide(sid)}
                className={`w-full rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  isActive ? "border-purple shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "border-transparent hover:border-white/10"
                }`}
              >
                {/* Slide number */}
                <div className="absolute top-1 left-1 z-10 w-5 h-5 rounded bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/50 text-[9px] font-bold">
                  {i + 1}
                </div>

                {/* Thumbnail */}
                <div style={{ width: THUMB_W, height: THUMB_H, transform: `scale(1)`, overflow: "hidden" }}>
                  <div style={{ transform: `scale(${THUMB_SCALE})`, transformOrigin: "0 0", width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}>
                    <SlideRenderer slide={slide} zoom={THUMB_SCALE} interactive={false} />
                  </div>
                </div>
              </button>

              {/* Actions on hover */}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => duplicateSlide(sid)} className="w-5 h-5 rounded bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white cursor-pointer">
                  <Copy size={10} />
                </button>
                {presentation.slideOrder.length > 1 && (
                  <button onClick={() => deleteSlide(sid)} className="w-5 h-5 rounded bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-red-400 cursor-pointer">
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
