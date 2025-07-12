"use client";
import { useCallback } from "react";
import { renderPdfPageToDataUrl } from "./pdf-utils";

export function usePdfThumbnail() {
  return useCallback(async (file: File): Promise<string> => {
    return renderPdfPageToDataUrl(file, 2); // Use high scale for quality everywhere
  }, []);
} 