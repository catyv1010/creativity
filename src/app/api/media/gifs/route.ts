import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "celebration";
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);

  const key = process.env.GIPHY_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GIPHY_API_KEY no configurada", results: [], needsKey: true },
      { status: 200 }
    );
  }

  try {
    const endpoint = q === "__trending__"
      ? `https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=${limit}&rating=g`
      : `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(q)}&limit=${limit}&rating=g&lang=es`;

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Giphy error: ${res.status}`);

    const data = await res.json();
    const results = (data.data ?? []).map((g: Record<string, any>) => ({
      id: g.id as string,
      title: (g.title as string) || "",
      url: (g.images?.fixed_height?.url as string) || (g.images?.original?.url as string) || "",
      preview: (g.images?.fixed_height_still?.url as string) || "",
      width: Number(g.images?.fixed_height?.width || 200),
      height: Number(g.images?.fixed_height?.height || 200),
    })).filter((g: { url: string }) => g.url);

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), results: [] },
      { status: 500 }
    );
  }
}
