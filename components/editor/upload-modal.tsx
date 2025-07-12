"use client";

import type React from "react";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileImage } from "lucide-react";
import Image from "next/image";
import { CanvasEditor } from "./canvas-editor";

interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface DesignFile {
  id: string;
  file: File;
  side: "front" | "back";
  thumbnail?: string;
}

export function UploadModal({ isOpen, onOpenChange }: UploadModalProps) {
  const [designs, setDesigns] = useState<DesignFile[]>([]);
  const [step, setStep] = useState<"upload" | "edit">("upload");
  const [activeDesign, setActiveDesign] = useState<DesignFile | null>(null);

  const generatePdfThumbnail = useCallback(
    async (file: File): Promise<string> => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.5 }); // Use a smaller scale for thumbnails
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        return canvas.toDataURL();
      } catch (error) {
        console.error("Error generating PDF thumbnail:", error);
        return "";
      }
    },
    []
  );

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      let thumbnail = "";

      // Generate thumbnail based on file type
      if (file.type.startsWith("image/")) {
        thumbnail = URL.createObjectURL(file);
      } else if (file.type === "application/pdf") {
        thumbnail = await generatePdfThumbnail(file);
      }

      const newDesign: DesignFile = {
        id: Date.now().toString(),
        file,
        side,
        thumbnail,
      };

      // Replace existing design for this side or add new
      setDesigns((prev) => {
        const filtered = prev.filter((d) => d.side !== side);
        return [...filtered, newDesign];
      });
    }
  };

  const deleteDesign = (id: string) => {
    const designToDelete = designs.find((d) => d.id === id);
    if (designToDelete?.thumbnail) {
      URL.revokeObjectURL(designToDelete.thumbnail);
    }
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    if (activeDesign?.id === id) {
      setActiveDesign(null);
    }
  };

  const selectDesign = (design: DesignFile) => {
    setActiveDesign(design);
    setStep("edit");
  };

  const reset = () => {
    designs.forEach((design) => {
      if (design.thumbnail) {
        URL.revokeObjectURL(design.thumbnail);
      }
    });
    setDesigns([]);
    setStep("upload");
    setActiveDesign(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const frontDesign = designs.find((d) => d.side === "front");
  const backDesign = designs.find((d) => d.side === "back");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        {step === "upload" && (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Upload Your Artwork</DialogTitle>
              <DialogDescription>
                Upload files for the front and back of your product. Accepted
                formats: JPG, PNG, PDF.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <FileUploadSlot
                side="Front"
                design={frontDesign}
                onFileChange={(e) => handleFileChange(e, "front")}
                onEdit={() => frontDesign && selectDesign(frontDesign)}
                onRemove={() => frontDesign && deleteDesign(frontDesign.id)}
              />
              <FileUploadSlot
                side="Back"
                design={backDesign}
                onFileChange={(e) => handleFileChange(e, "back")}
                onEdit={() => backDesign && selectDesign(backDesign)}
                onRemove={() => backDesign && deleteDesign(backDesign.id)}
              />
            </div>

            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                disabled={designs.length === 0}
                onClick={() => {
                  const firstDesign = designs[0];
                  if (firstDesign) {
                    setActiveDesign(firstDesign);
                    setStep("edit");
                  }
                }}
              >
                Proceed to Review
              </Button>
            </div>
          </>
        )}

        {step === "edit" && activeDesign && (
          <CanvasEditor
            designs={designs}
            activeDesign={activeDesign}
            onDesignChange={setActiveDesign}
            onBack={() => setStep("upload")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FileUploadSlot({
  side,
  design,
  onFileChange,
  onEdit,
  onRemove,
}: {
  side: string;
  design: DesignFile | undefined;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const id = `file-upload-${side.toLowerCase()}`;

  const getFileIcon = (design: DesignFile) => {
    if (design.thumbnail) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={design.thumbnail || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-contain rounded"
          />
          {design.file.type === "application/pdf" && (
            <div className="absolute bottom-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
              PDF
            </div>
          )}
        </div>
      );
    }
    return <FileImage className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col justify-center items-center h-full relative min-h-[300px]">
      <h3 className="text-lg font-semibold mb-4">{side} Side</h3>
      {!design ? (
        <>
          <Upload className="w-16 h-16 text-gray-400 mb-4" />
          <Label
            htmlFor={id}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-sm font-medium transition-all hover:scale-105"
          >
            Choose File
          </Label>
          <Input
            id={id}
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept="image/*,.pdf"
          />
          <p className="text-xs text-gray-500 mt-3">or drag and drop</p>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 mb-2">Supported formats:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                JPG
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                PNG
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                PDF
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center w-full">
          <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {getFileIcon(design)}
          </div>
          <p className="text-sm font-medium mb-1 truncate max-w-xs mx-auto">
            {design.file.name}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {(design.file.size / 1024 / 1024).toFixed(1)} MB
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              onClick={onEdit}
              className="bg-[#00AAB2] hover:bg-[#00AAB2]/90"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRemove}
              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
