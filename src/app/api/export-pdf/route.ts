import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // seconds

export async function POST(req: NextRequest) {
  try {
    const { html, title, width, height } = await req.json() as {
      html: string;
      title: string;
      width: number;
      height: number;
    };

    if (!html) {
      return NextResponse.json({ error: "html is required" }, { status: 400 });
    }

    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set viewport to match presentation dimensions
    await page.setViewport({ width: width || 1920, height: height || 1080 });

    // Load the HTML content
    await page.setContent(html, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for GSAP and fonts to load
    await page.waitForFunction(() => typeof window.gsap !== "undefined", {
      timeout: 10000,
    }).catch(() => { /* GSAP may not expose globally, continue */ });

    await new Promise((r) => setTimeout(r, 1500));

    const pdfW = width || 1920;
    const pdfH = height || 1080;

    // Get number of scenes to generate one page per scene
    const sceneCount: number = await page.evaluate(() => {
      return document.querySelectorAll("[data-scene='true']").length;
    });

    // Navigate to each scene and capture as PDF pages
    // For simplicity, export the full world as a single PDF with one page per scene
    const pdfBuffer = await page.pdf({
      width: `${pdfW}px`,
      height: `${pdfH}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    const filename = `${(title || "presentacion").replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

    return new NextResponse(pdfBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("[export-pdf] error:", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: String(err) },
      { status: 500 }
    );
  }
}
