import type { Presentation } from "@/core/types";

const STORAGE_KEY = "creativity-presentations";
const CURRENT_KEY = "creativity-current-id-v2";

export interface SavedPresentation {
  id: string;
  title: string;
  updatedAt: string;
  data: Presentation;
}

/** Get all saved presentations (metadata only for listing) */
export function listPresentations(): Omit<SavedPresentation, "data">[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: SavedPresentation[] = JSON.parse(raw);
    return all.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch { return []; }
}

/** Save a presentation */
export function savePresentation(presentation: Presentation): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: SavedPresentation[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex((p) => p.id === presentation.id);
    const entry: SavedPresentation = {
      id: presentation.id,
      title: presentation.title,
      updatedAt: presentation.updatedAt,
      data: presentation,
    };
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.push(entry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    localStorage.setItem(CURRENT_KEY, presentation.id);
  } catch (e) {
    console.warn("Failed to save presentation:", e);
  }
}

/** Load a specific presentation */
export function loadPresentation(id: string): Presentation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const all: SavedPresentation[] = JSON.parse(raw);
    return all.find((p) => p.id === id)?.data ?? null;
  } catch { return null; }
}

/** Get the last opened presentation ID */
export function getLastPresentationId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

/** Delete a presentation */
export function deletePresentation(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const all: SavedPresentation[] = JSON.parse(raw);
    const filtered = all.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}
