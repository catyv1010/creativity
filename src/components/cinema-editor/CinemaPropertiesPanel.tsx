"use client";

import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { usePresentationStore } from "@/store/presentationStore";
import { Trash2, Plus } from "lucide-react";
import type {
  TextContent,
  AnimationPreset,
  TransitionType,
} from "@/core/types";
import { FONT_PAIRINGS, ALL_FONTS } from "@/lib/fonts";

const TABS = [
  { key: "transform" as const, label: "Diseño" },
  { key: "animation" as const, label: "Animacion" },
  { key: "transition" as const, label: "Transicion" },
];

const ANIMATION_PRESETS: AnimationPreset[] = [
  "none",
  "fadeIn",
  "fadeOut",
  "slideInLeft",
  "slideInRight",
  "slideInUp",
  "slideInDown",
  "scaleIn",
  "scaleOut",
  "rotateIn",
  "cinematicZoom",
  "dramaticReveal",
  "glitchIn",
  "blurIn",
  "splitReveal",
  "zoomBounceIn",
  "rubberBand",
  "float",
  "pulse",
  "shake",
  "glow",
];

const TRANSITION_TYPES: TransitionType[] = [
  "camera-move",
  "fade",
  "zoom-blur",
  "whip-pan",
  "dolly-zoom",
  "iris",
  "film-grain-cut",
  "parallax-shift",
  "custom",
];

const inputClass =
  "w-full px-2 py-1 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50";
const labelClass = "text-white/20 text-[10px]";
const sectionClass =
  "text-white/30 text-[10px] font-bold uppercase tracking-wider";

export default function CinemaPropertiesPanel() {
  const { activeSceneId, selectedElementIds, rightPanelTab, setRightPanelTab } =
    useCinemaEditorStore();
  const {
    presentation,
    updateElement,
    deleteElement,
    updateScene,
    updateSceneTransition,
    addAnimation,
    deleteAnimation,
    updateAnimation,
  } = usePresentationStore();

  const scene = presentation.scenes.find((s) => s.id === activeSceneId);
  const element = scene?.elements.find((e) =>
    selectedElementIds.includes(e.id)
  );

  return (
    <div
      className="w-72 h-full flex flex-col border-l border-white/5 overflow-hidden"
      style={{ backgroundColor: "#0f0f1a" }}
    >
      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setRightPanelTab(tab.key)}
            className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
              rightPanelTab === tab.key
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {rightPanelTab === "transform" && (
          <DesignTab
            scene={scene}
            element={element}
            activeSceneId={activeSceneId}
            updateElement={updateElement}
            deleteElement={deleteElement}
            updateScene={updateScene}
          />
        )}
        {rightPanelTab === "animation" && (
          <AnimationTab
            element={element}
            activeSceneId={activeSceneId}
            addAnimation={addAnimation}
            deleteAnimation={deleteAnimation}
            updateAnimation={updateAnimation}
          />
        )}
        {rightPanelTab === "transition" && (
          <TransitionTab
            scene={scene}
            activeSceneId={activeSceneId}
            updateSceneTransition={updateSceneTransition}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Design Tab ─── */

function DesignTab({
  scene,
  element,
  activeSceneId,
  updateElement,
  deleteElement,
  updateScene,
}: {
  scene: ReturnType<
    typeof usePresentationStore.getState
  >["presentation"]["scenes"][0] | undefined;
  element: ReturnType<
    typeof usePresentationStore.getState
  >["presentation"]["scenes"][0]["elements"][0] | undefined;
  activeSceneId: string | null;
  updateElement: (
    sceneId: string,
    elementId: string,
    patch: Record<string, unknown>
  ) => void;
  deleteElement: (sceneId: string, elementId: string) => void;
  updateScene: (sceneId: string, patch: Record<string, unknown>) => void;
}) {
  if (!scene || !activeSceneId) return null;

  // No element selected → scene properties
  if (!element) {
    return (
      <div className="space-y-4">
        <p className={sectionClass}>Propiedades de escena</p>

        <div className="space-y-1">
          <label className={labelClass}>Nombre</label>
          <input
            className={inputClass}
            value={scene.name ?? ""}
            onChange={(e) => updateScene(activeSceneId, { name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Color de fondo</label>
          <input
            type="color"
            className={`${inputClass} h-8 cursor-pointer`}
            value={
              scene.backgroundColor as string ??
              "#000000"
            }
            onChange={(e) =>
              updateScene(activeSceneId, { backgroundColor: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Gradiente de fondo</label>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {[
              { label: "Ninguno", value: "" },
              { label: "Noche", value: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)" },
              { label: "Ocean", value: "linear-gradient(135deg, #0c1445 0%, #0f766e 100%)" },
              { label: "Sunset", value: "linear-gradient(135deg, #1e1b4b 0%, #be185d 50%, #f59e0b 100%)" },
              { label: "Aurora", value: "linear-gradient(135deg, #042f2e 0%, #7c3aed 50%, #06b6d4 100%)" },
              { label: "Fire", value: "linear-gradient(135deg, #1c1917 0%, #dc2626 50%, #f59e0b 100%)" },
              { label: "Forest", value: "linear-gradient(135deg, #052e16 0%, #15803d 100%)" },
              { label: "Royal", value: "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)" },
              { label: "Rose", value: "linear-gradient(135deg, #1c1917 0%, #be185d 100%)" },
              { label: "Cyber", value: "linear-gradient(135deg, #0a0a1a 0%, #06b6d4 50%, #a855f7 100%)" },
            ].map((g) => (
              <button
                key={g.label}
                title={g.label}
                onClick={() => updateScene(activeSceneId, { backgroundGradient: g.value })}
                className="w-full aspect-square rounded-md border border-white/10 hover:border-white/30 transition-colors cursor-pointer overflow-hidden"
                style={{
                  background: g.value || scene.backgroundColor || "#000",
                }}
              />
            ))}
          </div>
          <input
            className={inputClass}
            placeholder="linear-gradient(...) personalizado"
            value={
              (scene.backgroundGradient as string) ??
              ""
            }
            onChange={(e) =>
              updateScene(activeSceneId, { backgroundGradient: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Duracion (s)</label>
          <input
            type="number"
            className={inputClass}
            min={0.5}
            step={0.5}
            value={scene.duration as number ?? 5}
            onChange={(e) =>
              updateScene(activeSceneId, {
                duration: parseFloat(e.target.value) || 5,
              })
            }
          />
        </div>
      </div>
    );
  }

  // Element selected
  const t = element.transform;

  const patchTransform = (patch: Record<string, unknown>) => {
    updateElement(activeSceneId, element.id, {
      transform: { ...element.transform, ...patch },
    });
  };

  const isText = element.content?.type === "text";
  const isShape = element.type === "shape";
  const textContent = isText ? (element.content as TextContent) : null;

  return (
    <div className="space-y-4">
      <p className={sectionClass}>Transformar</p>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className={labelClass}>X</label>
          <input
            type="number"
            className={inputClass}
            value={t.x}
            onChange={(e) => patchTransform({ x: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Y</label>
          <input
            type="number"
            className={inputClass}
            value={t.y}
            onChange={(e) => patchTransform({ y: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className={labelClass}>Ancho</label>
          <input
            type="number"
            className={inputClass}
            value={t.width}
            onChange={(e) =>
              patchTransform({ width: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Alto</label>
          <input
            type="number"
            className={inputClass}
            value={t.height}
            onChange={(e) =>
              patchTransform({ height: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-1">
        <label className={labelClass}>Rotacion ({t.rotation}°)</label>
        <input
          type="range"
          min={0}
          max={360}
          value={t.rotation}
          onChange={(e) =>
            patchTransform({ rotation: parseFloat(e.target.value) })
          }
          className="w-full accent-purple-500"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-1">
        <label className={labelClass}>
          Opacidad ({Math.round(t.opacity * 100)}%)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(t.opacity * 100)}
          onChange={(e) =>
            patchTransform({ opacity: parseInt(e.target.value) / 100 })
          }
          className="w-full accent-purple-500"
        />
      </div>

      {/* Text-specific */}
      {isText && textContent && (
        <>
          <p className={sectionClass}>Texto</p>

          <div className="space-y-1">
            <label className={labelClass}>Fuente</label>
            <select
              className="w-full px-2 py-1 rounded bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-purple/50"
              value={textContent.fontFamily ?? "Inter"}
              onChange={(e) =>
                updateElement(activeSceneId, element.id, {
                  content: {
                    ...textContent,
                    fontFamily: e.target.value,
                  } as TextContent,
                })
              }
            >
              <option disabled>--- Combinaciones ---</option>
              {FONT_PAIRINGS.map((fp) => (
                <option key={fp.id} value={fp.display}>
                  {fp.name} ({fp.display})
                </option>
              ))}
              <option disabled>--- Todas las fuentes ---</option>
              {[...ALL_FONTS].sort((a, b) => a.localeCompare(b)).map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Tamaño de fuente</label>
            <input
              type="range"
              min={8}
              max={200}
              value={textContent.fontSize}
              onChange={(e) =>
                updateElement(activeSceneId, element.id, {
                  content: {
                    ...textContent,
                    fontSize: parseInt(e.target.value),
                  } as TextContent,
                })
              }
              className="w-full accent-purple-500"
            />
            <span className="text-white/30 text-[10px]">
              {textContent.fontSize}px
            </span>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Peso</label>
            <div className="flex gap-1">
              {([
                { label: "Normal", value: 400 },
                { label: "Bold", value: 700 },
                { label: "Black", value: 900 },
              ] as const).map((fw) => (
                <button
                  key={fw.value}
                  onClick={() =>
                    updateElement(activeSceneId, element.id, {
                      content: {
                        ...textContent,
                        fontWeight: fw.value,
                      } as TextContent,
                    })
                  }
                  className={`flex-1 py-1 text-[10px] rounded ${
                    textContent.fontWeight === fw.value
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Alineacion</label>
            <div className="flex gap-1">
              {([
                { label: "Izq", value: "left" as const },
                { label: "Centro", value: "center" as const },
                { label: "Der", value: "right" as const },
              ]).map((al) => (
                <button
                  key={al.value}
                  onClick={() =>
                    updateElement(activeSceneId, element.id, {
                      content: {
                        ...textContent,
                        textAlign: al.value,
                      } as TextContent,
                    })
                  }
                  className={`flex-1 py-1 text-[10px] rounded ${
                    textContent.textAlign === al.value
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  {al.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Color</label>
            <input
              type="color"
              className={`${inputClass} h-8 cursor-pointer`}
              value={textContent.color ?? "#ffffff"}
              onChange={(e) =>
                updateElement(activeSceneId, element.id, {
                  content: {
                    ...textContent,
                    color: e.target.value,
                  } as TextContent,
                })
              }
            />
          </div>
        </>
      )}

      {/* Shape-specific */}
      {isShape && (
        <>
          <p className={sectionClass}>Forma</p>

          <div className="space-y-1">
            <label className={labelClass}>Color de relleno</label>
            <input
              type="color"
              className={`${inputClass} h-8 cursor-pointer`}
              value={
                (element.style as Record<string, unknown>)?.fill as string ??
                "#a855f7"
              }
              onChange={(e) =>
                updateElement(activeSceneId, element.id, {
                  style: { ...element.style, fill: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>
              Border Radius (
              {(element.style as Record<string, unknown>)?.borderRadius as number ?? 0}
              )
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={
                (element.style as Record<string, unknown>)?.borderRadius as number ?? 0
              }
              onChange={(e) =>
                updateElement(activeSceneId, element.id, {
                  style: {
                    ...element.style,
                    borderRadius: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-purple-500"
            />
          </div>
        </>
      )}

      {/* Depth Layer */}
      <p className={sectionClass}>Capas</p>
      <div className="space-y-1">
        <label className={labelClass}>Capa de profundidad</label>
        <input
          type="number"
          className={inputClass}
          min={-5}
          max={5}
          value={element.depthLayer}
          onChange={(e) =>
            updateElement(activeSceneId, element.id, {
              depthLayer: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteElement(activeSceneId, element.id)}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
      >
        <Trash2 size={12} />
        Eliminar elemento
      </button>
    </div>
  );
}

/* ─── Animation Tab ─── */

function AnimationTab({
  element,
  activeSceneId,
  addAnimation,
  deleteAnimation,
  updateAnimation,
}: {
  element: ReturnType<
    typeof usePresentationStore.getState
  >["presentation"]["scenes"][0]["elements"][0] | undefined;
  activeSceneId: string | null;
  addAnimation: (sceneId: string, elementId: string) => void;
  deleteAnimation: (sceneId: string, elementId: string, animId: string) => void;
  updateAnimation: (
    sceneId: string,
    elementId: string,
    animId: string,
    patch: Record<string, unknown>
  ) => void;
}) {
  if (!element || !activeSceneId) {
    return (
      <p className="text-white/30 text-xs text-center mt-8">
        Selecciona un elemento para ver sus animaciones
      </p>
    );
  }

  const animations = element.animations ?? [];

  return (
    <div className="space-y-4">
      <p className={sectionClass}>Animaciones</p>

      {animations.length === 0 && (
        <p className="text-white/20 text-xs">Sin animaciones</p>
      )}

      {animations.map((anim) => (
        <div
          key={anim.id}
          className="p-2 rounded bg-white/3 border border-white/5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[11px] font-medium">
              {anim.preset ?? "custom"}
            </span>
            <button
              onClick={() => deleteAnimation(activeSceneId, element.id, anim.id)}
              className="text-red-400/60 hover:text-red-400 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>

          {/* Preset selector */}
          <div className="space-y-1">
            <label className={labelClass}>Preset</label>
            <select
              className={inputClass}
              value={anim.preset ?? "none"}
              onChange={(e) =>
                updateAnimation(activeSceneId, element.id, anim.id, {
                  preset: e.target.value as AnimationPreset,
                })
              }
            >
              {ANIMATION_PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className={labelClass}>
              Duracion ({anim.timing?.duration ?? 1}s)
            </label>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={anim.timing?.duration ?? 1}
              onChange={(e) =>
                updateAnimation(activeSceneId, element.id, anim.id, {
                  timing: {
                    ...anim.timing,
                    duration: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-purple-500"
            />
          </div>

          {/* Easing */}
          <div className="space-y-1">
            <label className={labelClass}>Easing</label>
            <input
              className={inputClass}
              value={anim.easing ?? "power2.out"}
              onChange={(e) =>
                updateAnimation(activeSceneId, element.id, anim.id, {
                  easing: e.target.value,
                })
              }
            />
          </div>
        </div>
      ))}

      <button
        onClick={() => addAnimation(activeSceneId, element.id)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded bg-purple-600/20 text-purple-300 text-xs hover:bg-purple-600/30 transition-colors"
      >
        <Plus size={12} />
        Agregar animacion
      </button>
    </div>
  );
}

/* ─── Transition Tab ─── */

function TransitionTab({
  scene,
  activeSceneId,
  updateSceneTransition,
}: {
  scene: ReturnType<
    typeof usePresentationStore.getState
  >["presentation"]["scenes"][0] | undefined;
  activeSceneId: string | null;
  updateSceneTransition: (
    sceneId: string,
    transition: Record<string, unknown>
  ) => void;
}) {
  if (!scene || !activeSceneId) return null;

  const transition = scene.transition as
    | { type?: string; duration?: number; easing?: string }
    | undefined;

  return (
    <div className="space-y-4">
      <p className={sectionClass}>Transicion de escena</p>

      {/* Type selector */}
      <div className="space-y-1">
        <label className={labelClass}>Tipo</label>
        <select
          className={inputClass}
          value={transition?.type ?? "fade"}
          onChange={(e) =>
            updateSceneTransition(activeSceneId, {
              type: e.target.value as TransitionType,
            })
          }
        >
          {TRANSITION_TYPES.map((tt) => (
            <option key={tt} value={tt}>
              {tt}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <label className={labelClass}>
          Duracion ({transition?.duration ?? 1}s)
        </label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={transition?.duration ?? 1}
          onChange={(e) =>
            updateSceneTransition(activeSceneId, {
              duration: parseFloat(e.target.value),
            })
          }
          className="w-full accent-purple-500"
        />
      </div>

      {/* Easing */}
      <div className="space-y-1">
        <label className={labelClass}>Easing</label>
        <input
          className={inputClass}
          value={transition?.easing ?? "power2.inOut"}
          onChange={(e) =>
            updateSceneTransition(activeSceneId, { easing: e.target.value })
          }
        />
      </div>
    </div>
  );
}
