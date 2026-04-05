"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import type { TextContent } from "@/core/types";

interface Props {
  content: TextContent;
  onChange: (html: string) => void;
  onBlur: () => void;
  zoom: number;
}

/**
 * InlineTextEditor — Tiptap-powered rich text editing directly on the canvas.
 * Activated on double-click, deactivated on blur/Escape.
 */
export default function InlineTextEditor({ content, onChange, onBlur, zoom }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Escribe aqui..." }),
    ],
    content: content.html,
    autofocus: "end",
    editorProps: {
      attributes: {
        class: "outline-none w-full h-full",
        style: [
          `font-size: ${content.fontSize}px`,
          `font-weight: ${content.fontWeight}`,
          `font-family: ${content.fontFamily || "Inter, sans-serif"}`,
          `color: ${content.color}`,
          `text-align: ${content.textAlign}`,
          `line-height: ${content.lineHeight || 1.3}`,
          content.letterSpacing ? `letter-spacing: ${content.letterSpacing}px` : "",
        ].filter(Boolean).join("; "),
      },
      handleKeyDown: (_view, event) => {
        // Escape exits editing
        if (event.key === "Escape") {
          onBlur();
          return true;
        }
        // Stop propagation so editor shortcuts don't interfere
        event.stopPropagation();
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
    onBlur: () => {
      onBlur();
    },
  });

  // Clean up
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="w-full h-full overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <EditorContent editor={editor} className="w-full h-full" />
    </div>
  );
}
