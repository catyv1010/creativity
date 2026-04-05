import { NextResponse } from "next/server";

export const runtime = "edge";

// Unsplash API (optional, upgrade for real search)
// Picsum (https://picsum.photos) works without any key — beautiful curated photos.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = Math.min(Number(searchParams.get("limit") || 20), 30);
  const page = Number(searchParams.get("page") || 1);

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  // ── Unsplash API (real search) ──────────────────────────────────────────
  if (unsplashKey && q) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${limit}&page=${page}`,
        { headers: { Authorization: `Client-ID ${unsplashKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          source: "unsplash",
          results: (data.results ?? []).map((p: Record<string, any>) => ({
            id: p.id as string,
            url: (p.urls?.regular as string) || (p.urls?.full as string) || "",
            thumb: (p.urls?.small as string) || "",
            author: (p.user?.name as string) || "Unsplash",
            authorUrl: (p.user?.links?.html as string) || "https://unsplash.com",
            downloadUrl: (p.links?.download_location as string) || "",
          })),
        });
      }
    } catch {
      // fall through to Picsum
    }
  }

  // ── Picsum (free, no key, always works) ────────────────────────────────
  try {
    const res = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );
    const data: Array<Record<string, unknown>> = await res.json();
    return NextResponse.json({
      source: "picsum",
      results: data.map((p) => ({
        id: String(p.id),
        url: `https://picsum.photos/id/${p.id}/1200/800`,
        thumb: `https://picsum.photos/id/${p.id}/400/250`,
        author: String(p.author),
        authorUrl: String(p.url),
        downloadUrl: null,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err), results: [] }, { status: 500 });
  }
}
