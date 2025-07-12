// This utility returns a static PDF icon as a data URL for any PDF file.
// This avoids SSR/CSR issues and always provides a thumbnail.

// A simple red PDF icon SVG as a data URL
const PDF_ICON_DATA_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' rx='24' fill='%23e53e3e'/><text x='50%' y='50%' text-anchor='middle' dy='.35em' font-size='48' fill='white' font-family='Arial, sans-serif'>PDF</text></svg>";

export async function generatePdfThumbnail(file: File): Promise<string> {
  // Always return the static icon for PDFs
  return PDF_ICON_DATA_URL;
} 