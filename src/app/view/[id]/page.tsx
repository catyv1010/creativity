"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadSharedPresentation } from "@/lib/share";
import { usePresentationStore } from "@/store/presentationStore";
import CinemaPresenter from "@/components/cinema-editor/CinemaPresenter";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";

export default function ViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { loadPresentation } = usePresentationStore();

  useEffect(() => {
    const presentation = loadSharedPresentation(id);
    if (presentation) {
      loadPresentation(presentation);
      useCinemaEditorStore.getState().setPresentMode(true);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id, loadPresentation]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/30 text-sm">Cargando presentacion...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-lg mb-2">Presentacion no encontrada</p>
          <p className="text-white/20 text-sm">El link puede haber expirado o ser incorrecto.</p>
          <a href="/" className="inline-block mt-4 px-4 py-2 rounded-full bg-purple-600 text-white text-sm hover:bg-purple-500 transition-colors">
            Ir a Creativity
          </a>
        </div>
      </div>
    );
  }

  return <CinemaPresenter />;
}
