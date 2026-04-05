import type { Presentation } from "@/core/types";

const STORAGE_PREFIX = "creativity-shared-";

/**
 * Save a presentation for sharing and return its share ID.
 * Uses localStorage for now — can be swapped for a backend later.
 */
export function sharePresentation(presentation: Presentation): string {
  const shareId = presentation.id;
  const data = JSON.stringify(presentation);
  localStorage.setItem(`${STORAGE_PREFIX}${shareId}`, data);
  return shareId;
}

/**
 * Load a shared presentation by ID.
 */
export function loadSharedPresentation(shareId: string): Presentation | null {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${shareId}`);
  if (!data) return null;
  try {
    return JSON.parse(data) as Presentation;
  } catch {
    return null;
  }
}

/**
 * Get the share URL for a presentation.
 */
export function getShareUrl(shareId: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/view/${shareId}`;
}

/**
 * Copy share URL to clipboard and return it.
 */
export async function copyShareLink(presentation: Presentation): Promise<string> {
  const shareId = sharePresentation(presentation);
  const url = getShareUrl(shareId);
  await navigator.clipboard.writeText(url);
  return url;
}
