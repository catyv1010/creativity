"use client";

import { useRef } from "react";
import { Image } from "lucide-react";
import { usePresentationStore } from "@/store/presentationStore";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";

export default function ImageUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addImageElement } = usePresentationStore();
  const { activeSceneId } = useCinemaEditorStore();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSceneId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addImageElement(activeSceneId, dataUrl);
    };
    reader.readAsDataURL(file);

    // Reset so same file can be selected again
    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        title="Imagen"
        className="flex items-center justify-center w-8 h-8 rounded-md transition-colors text-white/30 hover:text-white/60 hover:bg-white/5"
      >
        <Image size={16} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </>
  );
}
