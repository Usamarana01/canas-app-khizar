"use client";

import { useState, useEffect } from "react";
import { ProductSelection } from "@/components/products/product-selection";
import { ArtworkUpload } from "@/components/editor/artwork-upload";
import { CanvasEditor } from "@/components/editor/canvas-editor";
import type { ArtworkConfiguration } from "@/lib/data";

interface DesignFile {
  id: string;
  file: File;
  side: "front" | "back";
  thumbnail?: string;
}

type AppStep = "selection" | "upload" | "editor";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>("selection");
  const [configuration, setConfiguration] =
    useState<ArtworkConfiguration | null>(null);
  const [designs, setDesigns] = useState<DesignFile[]>([]);
  const [activeDesign, setActiveDesign] = useState<DesignFile | null>(null);

  // Check if returning from preview page
  useEffect(() => {
    const returnToEditor = sessionStorage.getItem("returnToEditor");
    const artworkData = sessionStorage.getItem("artworkPreview");

    if (returnToEditor === "true" && artworkData) {
      try {
        const data = JSON.parse(artworkData);
        // Restore the editor state
        setCurrentStep("editor");
        // Note: We'd need to reconstruct the configuration and designs from the stored data
        // For now, we'll just clear the return flag
        sessionStorage.removeItem("returnToEditor");
      } catch (error) {
        console.error("Error restoring editor state:", error);
      }
    }
  }, []);

  const handleConfigurationComplete = (config: ArtworkConfiguration) => {
    setConfiguration(config);
    setCurrentStep("upload");
  };

  const handleFilesReady = (files: DesignFile[], active: DesignFile) => {
    setDesigns(files);
    setActiveDesign(active);
    setCurrentStep("editor");
  };

  const handleBackToSelection = () => {
    setCurrentStep("selection");
    setConfiguration(null);
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setDesigns([]);
    setActiveDesign(null);
  };

  if (currentStep === "selection") {
    return (
      <ProductSelection onConfigurationComplete={handleConfigurationComplete} />
    );
  }

  if (currentStep === "upload" && configuration) {
    return (
      <ArtworkUpload
        configuration={configuration}
        onFilesReady={handleFilesReady}
        onBack={handleBackToSelection}
      />
    );
  }

  if (
    currentStep === "editor" &&
    configuration &&
    activeDesign &&
    designs.length > 0
  ) {
    return (
      <CanvasEditor
        designs={designs}
        activeDesign={activeDesign}
        onDesignChange={setActiveDesign}
        onBack={handleBackToUpload}
        canvasSize={{
          width: configuration.canvasWidth,
          height: configuration.canvasHeight,
          unit: configuration.productSize.unit,
        }}
        bleed={configuration.bleed}
      />
    );
  }

  // Fallback
  return (
    <ProductSelection onConfigurationComplete={handleConfigurationComplete} />
  );
}
