"use client";

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
import { Upload, FileImage, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { ArtworkConfiguration } from "@/lib/data";
import Image from "next/image";
import { usePdfThumbnail } from "./use-pdf-thumbnail";

interface DesignFile {
  id: string;
  file: File;
  side: "front" | "back";
  thumbnail?: string;
}

interface ArtworkUploadProps {
  configuration: ArtworkConfiguration;
  onFilesReady: (files: DesignFile[], activeDesign: DesignFile) => void;
  onBack: () => void;
}

export function ArtworkUpload({
  configuration,
  onFilesReady,
  onBack,
}: ArtworkUploadProps) {
  const [designs, setDesigns] = useState<DesignFile[]>([]);
  const { toast } = useToast();
  const generatePdfThumbnail = usePdfThumbnail();

  const { artworkSides } = configuration;
  const requiresFront =
    artworkSides.value === "front" || artworkSides.value === "both";
  const requiresBack =
    artworkSides.value === "back" || artworkSides.value === "both";

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
  };

  const frontDesign = designs.find((d) => d.side === "front");
  const backDesign = designs.find((d) => d.side === "back");

  const isReadyToContinue =
    (requiresFront ? !!frontDesign : true) &&
    (requiresBack ? !!backDesign : true);

  const handleContinue = () => {
    if (isReadyToContinue && designs.length > 0) {
      const activeDesign = frontDesign || backDesign!;
      onFilesReady(designs, activeDesign);
    }
  };

  const handleClose = () => {
    // Clean up thumbnails
    designs.forEach((design) => {
      if (design.thumbnail) {
        URL.revokeObjectURL(design.thumbnail);
      }
    });
    setDesigns([]);
    onBack();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Upload Your Artwork</DialogTitle>
          <DialogDescription>
            Upload files for the front and back of your product. Accepted
            formats: JPG, PNG, PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {requiresFront && (
              <FileUploadSlot
                side="Front"
                design={frontDesign}
                onFileChange={(e) => handleFileChange(e, "front")}
                onEdit={() => {}}
                onRemove={() => frontDesign && deleteDesign(frontDesign.id)}
              />
            )}
            {requiresBack && (
              <FileUploadSlot
                side="Back"
                design={backDesign}
                onFileChange={(e) => handleFileChange(e, "back")}
                onEdit={() => {}}
                onRemove={() => backDesign && deleteDesign(backDesign.id)}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={!isReadyToContinue}
              onClick={handleContinue}
              className="bg-[#00AAB2] hover:bg-[#00AAB2]/90"
            >
              Proceed to Review
            </Button>
          </div>
        </div>
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
            className="cursor-pointer bg-[#00AAB2] text-white hover:bg-[#00AAB2]/90 px-6 py-3 rounded-md text-sm font-medium transition-all hover:scale-105"
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
            <Button size="sm" variant="outline" onClick={onRemove}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
