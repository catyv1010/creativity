"use client";

import { usePresentationStore } from "@/store/presentationStore";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import type { Scene, TransitionType } from "@/core/types";
import {
  Plus, Copy, Trash2, ArrowDownUp, Film, Clapperboard,
  Focus, Zap, Sparkles, Gamepad2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CinemaSceneRenderer from "./CinemaSceneRenderer";

// ─── Constants ───────────────────────────────────────────────────────────────

const SCENE_W = 1920;
const SCENE_H = 1080;

// Thumbnail dimensions (inside the panel card, excluding padding)
const THUMB_W = 192; // px — approx panel width minus padding
const THUMB_SCALE = THUMB_W / SCENE_W; // ~0.1

const TRANSITION_CYCLE: TransitionType[] = [
  "camera-move", "fade", "zoom-blur", "whip-pan",
  "dolly-zoom", "iris", "film-grain-cut", "parallax-shift",
];

const TRANSITION_ICONS: Record<string, React.ReactNode> = {
  "camera-move":    <Film className="w-3 h-3" />,
  fade:             <Sparkles className="w-3 h-3" />,
  "zoom-blur":      <Focus className="w-3 h-3" />,
  "whip-pan":       <Zap className="w-3 h-3" />,
  "dolly-zoom":     <Clapperboard className="w-3 h-3" />,
  iris:             <Focus className="w-3 h-3" />,
  "film-grain-cut": <Film className="w-3 h-3" />,
  "parallax-shift": <ArrowDownUp className="w-3 h-3" />,
};

// ─── MiniScenePreview ─────────────────────────────────────────────────────────
// Renders a real scaled-down preview of the scene using CinemaSceneRenderer.

function MiniScenePreview({ scene }: { scene: Scene }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(THUMB_SCALE);

  useEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth || THUMB_W;
    setScale(w / SCENE_W);
  }, []);

  const thumbH = Math.round(SCENE_H * scale);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md overflow-hidden relative bg-[#0a0a14]"
      style={{ height: thumbH }}
    >
      {/* Scaled scene — pointer-events:none so clicks pass through to parent button */}
      <div
        style={{
          width: SCENE_W,
          height: SCENE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <CinemaSceneRenderer scene={scene} zoom={1} interactive={false} />
      </div>

      {/* Quiz badge */}
      {(scene as any).quiz && (
        <div className="absolute top-1 left-1 bg-purple-600/80 rounded px-1 py-0.5 flex items-center gap-0.5">
          <Gamepad2 className="w-2 h-2 text-white" />
          <span className="text-white text-[8px] font-bold">QUIZ</span>
        </div>
      )}
    </div>
  );
}

// ─── Editable scene name ──────────────────────────────────────────────────────

function SceneName({ scene, onRename }: { scene: Scene; onRename: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(scene.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setValue(scene.name); }, [scene.name]);

  const commit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== scene.name) onRename(trimmed);
    else setValue(scene.name);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setEditing(false); setValue(scene.name); }
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
        autoFocus
        className="flex-1 bg-white/10 text-white text-xs rounded px-1 py-0.5 outline-none border border-purple-500/50 min-w-0"
      />
    );
  }

  return (
    <span
      className="text-xs text-white/70 truncate flex-1 cursor-text"
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
      title="Doble click para renombrar"
    >
      {scene.name}
    </span>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export default function CinemaScenePanel() {
  const { presentation, addScene, deleteScene, duplicateScene, updateSceneTransition, updateScene } =
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
          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
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
                {/* ── Real thumbnail ── */}
                <MiniScenePreview scene={scene} />

                {/* Info row */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-mono text-white/30 shrink-0">
                    {index + 1}
                  </span>
                  <SceneName
                    scene={scene}
                    onRename={(name) => updateScene(scene.id, { name })}
                  />
                </div>

                {/* Hover actions */}
                {isHovered && (
                  <div className="absolute top-2 right-2 flex gap-0.5 z-10">
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); duplicateScene(scene.id); }}
                      className="p-1 rounded bg-black/70 hover:bg-purple-600 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Duplicar"
                    >
                      <Copy className="w-3 h-3" />
                    </span>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }}
                      className="p-1 rounded bg-black/70 hover:bg-red-600 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </button>

              {/* Transition pill */}
              {index < scenes.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <button
                    onClick={() => cycleTransition(scenes[index + 1].id, scenes[index + 1].transition.type)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 transition-colors group cursor-pointer"
                    title={`Transición: ${scenes[index + 1].transition.type} — Click para cambiar`}
                  >
                    {TRANSITION_ICONS[scenes[index + 1].transition.type] ?? <ArrowDownUp className="w-3 h-3" />}
                    <span className="text-[9px] text-white/40 group-hover:text-purple-300 transition-colors">
                      {scenes[index + 1].transition.type}
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add scene button at bottom */}
        <button
          onClick={() => addScene()}
          className="w-full mt-1 py-3 rounded-lg border border-dashed border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 text-white/20 hover:text-purple-400 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          Nueva escena
        </button>
      </div>
    </div>
  );
}
