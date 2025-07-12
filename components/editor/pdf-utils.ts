export async function renderPdfPageToDataUrl(
  file: File,
  scale: number = 2, // fallback scale
  targetWidth?: number,
  targetHeight?: number
): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  let effectiveScale = scale;
  if (targetWidth && targetHeight) {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const viewport = page.getViewport({ scale: 1 });
    const scaleX = (targetWidth * dpr) / viewport.width;
    const scaleY = (targetHeight * dpr) / viewport.height;
    effectiveScale = Math.max(scaleX, scaleY);
  } else {
    // Multiply scale by devicePixelRatio for high-DPI screens
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    effectiveScale = scale * dpr;
  }

  const viewport = page.getViewport({ scale: effectiveScale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return canvas.toDataURL("image/png", 0.95);
} 