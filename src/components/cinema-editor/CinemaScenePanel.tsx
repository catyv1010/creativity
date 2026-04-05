"use client";

import { usePresentationStore } from "@/store/presentationStore";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import type { TransitionType } from "@/core/types";
import {
  Plus,
  Copy,
  Trash2,
  ArrowDownUp,
  Film,
  Clapperboard,
  Focus,
  Zap,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const TRANSITION_CYCLE: TransitionType[] = [
  "camera-move",
  "fade",
  "zoom-blur",
  "whip-pan",
  "dolly-zoom",
  "iris",
  "film-grain-cut",
  "parallax-shift",
];

const TRANSITION_ICONS: Record<string, React.ReactNode> = {
  "camera-move": <Film className="w-3 h-3" />,
  fade: <Sparkles className="w-3 h-3" />,
  "zoom-blur": <Focus className="w-3 h-3" />,
  "whip-pan": <Zap className="w-3 h-3" />,
  "dolly-zoom": <Clapperboard className="w-3 h-3" />,
  iris: <Focus className="w-3 h-3" />,
  "film-grain-cut": <Film className="w-3 h-3" />,
  "parallax-shift": <ArrowDownUp className="w-3 h-3" />,
};

export default function CinemaScenePanel() {
  const { presentation, addScene, deleteScene, duplicateScene, updateSceneTransition } =
    usePresentationStore();
  const { activeSceneId, setActiveScene } = useCinemaEditorStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scenes = presentation.scenes;

  function cycleTransition(sceneId: string, currentType: TransitionType) {
    const idx = TRANSITION_CYCLE.indexOf(currentType);
    const nextType = TRANSITION_CYCLE[(idx + 1) % TRANSITION_CYCLE.length];
    updateSceneTransition(sceneId, { type: nextType });
  }

  return (
    <div className="w-56 h-full flex flex-col bg-[#0f0f1a] border-r border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80">Escenas</h2>
        <button
          onClick={() => addScene()}
          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title="Agregar escena"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Scene list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {scenes.map((scene, index) => {
          const isActive = scene.id === activeSceneId;
          const isHovered = scene.id === hoveredId;

          return (
            <div key={scene.id}>
              {/* Scene thumbnail */}
              <button
                onClick={() => setActiveScene(scene.id)}
                onMouseEnter={() => setHoveredId(scene.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  w-full rounded-lg p-2 text-left transition-all relative group
                  ${isActive
                    ? "ring-2 ring-purple-500 bg-white/5"
                    : "hover:bg-white/5"
                  }
                `}
              >
                {/* Preview block */}
                <div
                  className="w-full aspect-video rounded-md mb-1.5"
                  style={{
                    background: scene.backgroundGradient || scene.backgroundColor,
                  }}
                />

                {/* Info row */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-white/40 min-w-[1.2rem]">
                    {index + 1}
                  </span>
                  <span className="text-xs text-white/70 truncate flex-1">
                    {scene.name}
                  </span>
                </div>

                {/* Hover actions */}
                {isHovered && (
                  <div className="absolute top-1.5 right-1.5 flex gap-0.5">
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateScene(scene.id);
                      }}
                      className="p-1 rounded bg-black/60 hover:bg-purple-600 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Duplicar"
                    >
                      <Copy className="w-3 h-3" />
                    </span>
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScene(scene.id);
                      }}
                      className="p-1 rounded bg-black/60 hover:bg-red-600 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </button>

              {/* Transition indicator (between this scene and the next) */}
              {index < scenes.length - 1 && (
                <div className="flex justify-center py-1">
                  <button
                    onClick={() =>
                      cycleTransition(
                        scenes[index + 1].id,
                        scenes[index + 1].transition.type
                      )
                    }
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 transition-colors group"
                    title={`Transicion: ${scenes[index + 1].transition.type} — Click para cambiar`}
                  >
                    {TRANSITION_ICONS[scenes[index + 1].transition.type] ?? (
                      <ArrowDownUp className="w-3 h-3" />
                    )}
                    <span className="text-[10px] text-white/50 group-hover:text-purple-300 transition-colors">
                      {scenes[index + 1].transition.type}
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
