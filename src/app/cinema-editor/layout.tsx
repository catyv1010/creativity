import { getGoogleFontsUrl } from "@/lib/fonts";

export default function CinemaEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden">
      <link rel="stylesheet" href={getGoogleFontsUrl()} />
      {children}
    </div>
  );
}
