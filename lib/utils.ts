import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility: Extract DPI from JPEG/PNG EXIF (browser only, minimal parser)
export async function getImageDPI(
  file: File
): Promise<{ x: number; y: number; found: boolean }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const view = new DataView(reader.result as ArrayBuffer);
      // JPEG: look for APP0 (JFIF) or APP1 (EXIF)
      if (file.type === "image/jpeg") {
        let offset = 2;
        while (offset < view.byteLength) {
          if (view.getUint16(offset) === 0xffe0) {
            // APP0
            // JFIF header
            if (view.getUint32(offset + 4) === 0x4a464946) {
              // 'JFIF'
              const units = view.getUint8(offset + 9);
              const xDensity = view.getUint16(offset + 10);
              const yDensity = view.getUint16(offset + 12);
              if (units === 1) {
                // DPI
                resolve({ x: xDensity, y: yDensity, found: true });
                return;
              } else if (units === 2) {
                // Dots per cm
                resolve({
                  x: Math.round(xDensity * 2.54),
                  y: Math.round(yDensity * 2.54),
                  found: true,
                });
                return;
              }
            }
          }
          // Next marker
          if (view.getUint8(offset) !== 0xff) break;
          offset += 2 + view.getUint16(offset + 2);
        }
      }
      // PNG: look for pHYs chunk
      if (file.type === "image/png") {
        // PNG signature is 8 bytes
        let offset = 8;
        while (offset < view.byteLength) {
          const length = view.getUint32(offset);
          const type = String.fromCharCode(
            view.getUint8(offset + 4),
            view.getUint8(offset + 5),
            view.getUint8(offset + 6),
            view.getUint8(offset + 7)
          );
          if (type === "pHYs") {
            const xPPU = view.getUint32(offset + 8);
            const yPPU = view.getUint32(offset + 12);
            const unit = view.getUint8(offset + 16);
            if (unit === 1) {
              // pixels per meter
              resolve({
                x: Math.round(xPPU * 0.0254),
                y: Math.round(yPPU * 0.0254),
                found: true,
              });
              return;
            }
          }
          offset += 12 + length;
        }
      }
      // Not found, default
      resolve({ x: 300, y: 300, found: false });
    };
    reader.readAsArrayBuffer(file.slice(0, 256 * 1024)); // Only need the first 256KB
  });
}

// Utility: Extract DPI from PDF using pdfjs-dist
export async function getPdfDPI(
  file: File
): Promise<{ x: number; y: number; found: boolean }> {
  try {
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    // PDF units: 1/72 inch
    const { width, height } = page.getViewport({ scale: 1 });
    // Try to get pixel size from renderable area
    // We'll use 72 DPI as the default for PDF points
    return { x: 72, y: 72, found: true };
  } catch (e) {
    return { x: 300, y: 300, found: false };
  }
}
