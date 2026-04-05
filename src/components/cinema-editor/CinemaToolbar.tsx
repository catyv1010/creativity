"use client";

import {
  MousePointer2,
  Hand,
  Type,
  Square,
  Circle,
  Triangle,
  Undo2,
  Redo2,
  Play,
  Download,
  FileCode2,
  FileText,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { usePresentationStore } from "@/store/presentationStore";
import { useHistoryStore } from "@/store/historyStore";
import ImageUploadButton from "./ImageUploadButton";
import { useState, useRef, useEffect } from "react";

const COLOR_SWATCHES = [
  "#ffffff",
  "#000000",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#f59e0b",
  "#F2583E",
  "#84cc16",
  "#3b82f6",
  "#f43f5e",
];

type ToolId = "select" | "pan";

function ToolButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
        active
          ? "bg-purple-500/20 text-purple-400"
          : "text-white/30 hover:text-white/60 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-6 bg-white/10 mx-2" />;
}

export default function CinemaToolbar({ onOpenTemplates, onOpenMedia }: { onOpenTemplates?: () => void; onOpenMedia?: () => void }) {
  const {
    tool,
    setTool,
    setPresentMode,
    showCameraPath,
    toggleCameraPath,
    viewMode,
    setViewMode,
    activeSceneId,
  } = useCinemaEditorStore();

  const { presentation, addTextElement, addShapeElement } =
    usePresentationStore();

  // Export dropdown state
  const [exportOpen, setExportOpen] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExportHTML = () => {
    setExportOpen(false);
    import("@/lib/export-html").then(({ downloadHTML }) => {
      const { presentation: p } = usePresentationStore.getState();
      downloadHTML(p);
    });
  };

  const handleExportPDF = async () => {
    setExportOpen(false);
    setExportingPDF(true);
    setExportError(null);
    try {
      const { downloadPDF } = await import("@/lib/export-html");
      const { presentation: p } = usePresentationStore.getState();
      await downloadPDF(p);
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : "Error al exportar PDF");
      setTimeout(() => setExportError(null), 4000);
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="h-12 bg-[#0f0f1a] border-b border-white/5 flex items-center justify-between px-3 select-none">
      {/* Left side */}
      <div className="flex items-center gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-1">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <span className="text-white/70 text-sm font-medium tracking-tight">
            Creativity
          </span>
        </div>

        <Separator />

        {/* Tool buttons */}
        <ToolButton
          active={tool === "select"}
          onClick={() => setTool("select")}
          title="Select (V)"
        >
          <MousePointer2 size={16} />
        </ToolButton>
        <ToolButton
          active={tool === "pan"}
          onClick={() => setTool("pan")}
          title="Pan (H)"
        >
          <Hand size={16} />
        </ToolButton>

        <Separator />

        {/* Add elements */}
        <ToolButton
          onClick={() => activeSceneId && addTextElement(activeSceneId)}
          title="Add Text"
        >
          <Type size={16} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            activeSceneId && addShapeElement(activeSceneId, "rect")
          }
          title="Rectangle"
        >
          <Square size={16} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            activeSceneId && addShapeElement(activeSceneId, "circle")
          }
          title="Circle"
        >
          <Circle size={16} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            activeSceneId && addShapeElement(activeSceneId, "triangle")
          }
          title="Triangle"
        >
          <Triangle size={16} />
        </ToolButton>
        <ImageUploadButton />

        <Separator />

        {/* Color swatches */}
        <div className="flex items-center gap-1">
          {COLOR_SWATCHES.map((color) => (
            <button
              key={color}
              className="w-4 h-4 rounded-full border border-white/10 hover:scale-125 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Templates & Media buttons */}
        {onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
          >
            Plantillas
          </button>
        )}
        {onOpenMedia && (
          <button
            onClick={onOpenMedia}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
          >
            Media
          </button>
        )}

        <Separator />

        {/* View mode toggle */}
        <div className="flex items-center bg-white/5 rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode("scene")}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "scene"
                ? "bg-purple-500/20 text-purple-400"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            Escena
          </button>
          <button
            onClick={() => setViewMode("world")}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "world"
                ? "bg-purple-500/20 text-purple-400"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            Mapa
          </button>
        </div>

        <Separator />

        {/* Undo / Redo */}
        <ToolButton onClick={() => useHistoryStore.getState().undo()} title="Deshacer (Ctrl+Z)">
          <Undo2 size={16} />
        </ToolButton>
        <ToolButton onClick={() => useHistoryStore.getState().redo()} title="Rehacer (Ctrl+Shift+Z)">
          <Redo2 size={16} />
        </ToolButton>

        <Separator />

        {/* Export dropdown */}
        <div ref={exportRef} className="relative">
          <button
            onClick={() => setExportOpen((v) => !v)}
            disabled={exportingPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {exportingPDF ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            {exportingPDF ? "Exportando..." : "Exportar"}
            <ChevronDown size={11} className={`transition-transform ${exportOpen ? "rotate-180" : ""}`} />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
              <button
                onClick={handleExportHTML}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <FileCode2 size={14} className="text-cyan-400" />
                <div className="text-left">
                  <div className="font-medium">HTML interactivo</div>
                  <div className="text-white/30 text-[10px]">Presentación completa</div>
                </div>
              </button>
              <div className="h-px bg-white/5" />
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <FileText size={14} className="text-rose-400" />
                <div className="text-left">
                  <div className="font-medium">PDF</div>
                  <div className="text-white/30 text-[10px]">Primera escena</div>
                </div>
              </button>
            </div>
          )}

          {/* Error toast */}
          {exportError && (
            <div className="absolute right-0 top-full mt-1 px-3 py-2 bg-red-900/80 border border-red-500/30 rounded-lg text-xs text-red-300 whitespace-nowrap z-50">
              {exportError}
            </div>
          )}
        </div>

        {/* Share button */}
        <button
          onClick={async () => {
            const { copyShareLink } = await import("@/lib/share");
            const { presentation: p } = usePresentationStore.getState();
            const url = await copyShareLink(p);
            alert(`Link copiado: ${url}`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
        >
          Compartir
        </button>

        <Separator />

        {/* Present button */}
        <button
          onClick={() => setPresentMode(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
        >
          <Play size={14} fill="currentColor" />
          Presentar
        </button>
      </div>
    </div>
  );
}
