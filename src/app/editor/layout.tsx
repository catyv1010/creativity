import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor — Creativity",
  description: "Editor de presentaciones Creativity",
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
