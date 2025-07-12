"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  ArrowRight,
  Info,
  Package,
  Layers,
  FileImage,
  Ruler,
} from "lucide-react";
import {
  bleedOptions,
  artworkSideOptions,
  createArtworkConfiguration,
  type ProductSize,
  type BleedOption,
  type ArtworkSideOption,
  type ArtworkConfiguration,
} from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProductSelectionProps {
  onConfigurationComplete: (config: ArtworkConfiguration) => void;
}

export function ProductSelection({
  onConfigurationComplete,
}: ProductSelectionProps) {
  const [customWidth, setCustomWidth] = useState<string>("");
  const [customHeight, setCustomHeight] = useState<string>("");
  const [customBleed, setCustomBleed] = useState<string>("0.0625"); // default 1/16 inch
  const [selectedSides, setSelectedSides] = useState<ArtworkSideOption>(
    artworkSideOptions[0]
  ); // Default to front only

  const handleContinue = () => {
    const width = parseFloat(customWidth);
    const height = parseFloat(customHeight);
    const bleed = parseFloat(customBleed);

    if (width > 0 && height > 0 && bleed >= 0) {
      const customSize: ProductSize = {
        id: "custom",
        name: "Custom Size",
        width,
        height,
        unit: "inches",
        category: "Custom",
      };

      // Patch: create a BleedOption-like object for compatibility
      const customBleedOption = {
        id: "custom-bleed",
        name: `Custom Bleed (${bleed}")`,
        value: bleed,
        description: `Custom bleed of ${bleed} inches`,
        unit: "inches",
      };

      const configuration = createArtworkConfiguration(
        customSize,
        customBleedOption,
        selectedSides
      );
      onConfigurationComplete(configuration);
    }
  };

  const isReadyToContinue =
    customWidth !== "" &&
    customHeight !== "" &&
    parseFloat(customWidth) > 0 &&
    parseFloat(customHeight) > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Custom Artwork
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your custom dimensions to create the perfect canvas for your
            artwork. Specify your size, bleed preferences, and which sides
            you'll be designing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Custom Size Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  Custom Product Size
                </CardTitle>
                <CardDescription>
                  Enter your custom dimensions in inches for your artwork.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-sm font-medium">
                      Width (inches)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      placeholder="Enter width"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">
                      Height (inches)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      placeholder="Enter height"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>

                {isReadyToContinue && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Your Custom Size
                      </span>
                    </div>
                    <p className="text-xl font-bold text-blue-900">
                      {customWidth}" × {customHeight}"
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Canvas with bleed:{" "}
                      {(
                        parseFloat(customWidth) +
                        parseFloat(customBleed) * 2
                      ).toFixed(3)}
                      " ×{" "}
                      {(
                        parseFloat(customHeight) +
                        parseFloat(customBleed) * 2
                      ).toFixed(3)}
                      "
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Size Guidelines
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Minimum size: 0.1" × 0.1"</li>
                    <li>• Maximum size: 100" × 100"</li>
                    <li>• Enter dimensions in inches</li>
                    <li>• Bleed area will be added automatically</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Bleed Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Bleed Settings
                </CardTitle>
                <CardDescription>
                  Bleed area extends your artwork beyond the trim line to
                  prevent white edges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="bleed" className="text-sm font-medium">
                    Bleed (inches)
                  </Label>
                  <Input
                    id="bleed"
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    placeholder="Enter bleed"
                    value={customBleed}
                    onChange={(e) => setCustomBleed(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Common bleed is 0.0625" (1/16 inch). Enter 0 for no bleed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Artwork Sides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-primary" />
                  Artwork Sides
                </CardTitle>
                <CardDescription>
                  Choose which sides of your product will have artwork.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedSides.id}
                  onValueChange={(value) => {
                    const sides = artworkSideOptions.find(
                      (s) => s.id === value
                    );
                    if (sides) setSelectedSides(sides);
                  }}
                  className="space-y-3"
                >
                  {artworkSideOptions.map((side) => (
                    <div key={side.id} className="flex items-start space-x-2">
                      <RadioGroupItem
                        value={side.id}
                        id={side.id}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={side.id} className="font-medium">
                          {side.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {side.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            {isReadyToContinue && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Selected Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Product:</Label>
                    <p className="text-sm text-muted-foreground">Custom Size</p>
                    <p className="text-sm font-semibold text-primary">
                      {customWidth}" × {customHeight}"
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">
                      Bleed Setting:
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSides.name}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">
                      Artwork Sides:
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSides.name}
                    </p>
                  </div>
                  <Separator />
                  <div className="bg-gray-50 p-3 rounded-md">
                    <Label className="text-sm font-medium text-gray-700">
                      Canvas Dimensions:
                    </Label>
                    <p className="text-sm font-bold text-gray-900">
                      {(
                        parseFloat(customWidth) +
                        parseFloat(customBleed) * 2
                      ).toFixed(3)}
                      " ×{" "}
                      {(
                        parseFloat(customHeight) +
                        parseFloat(customBleed) * 2
                      ).toFixed(3)}
                      "
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Includes {parseFloat(customBleed)}" bleed on all sides
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!isReadyToContinue}
              className="w-full"
              size="lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              Continue to Upload Artwork
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
