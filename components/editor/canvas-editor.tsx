// "use client";

// import type React from "react";

// import { useRef, useEffect, useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   FlipHorizontal,
//   FlipVertical,
//   RotateCcw,
//   RotateCw,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   ArrowUp,
//   ArrowDown,
//   ArrowLeft,
//   ArrowRight,
//   Move,
//   Search,
//   Grid3X3,
//   Scissors,
//   Layers,
//   Undo,
//   Redo,
//   TimerResetIcon as Reset,
//   Box,
//   Trash2,
//   FileIcon,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/components/ui/use-toast";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { usePdfThumbnail } from "./use-pdf-thumbnail";
// import { renderPdfPageToDataUrl } from "./pdf-utils";

// const DEFAULT_CANVAS_SIZE = { width: 3.5, height: 2, unit: "inches" } as const;

// interface DesignFile {
//   id: string;
//   file: File;
//   side: "front" | "back";
//   thumbnail?: string;
// }

// interface CanvasEditorProps {
//   designs: DesignFile[];
//   activeDesign: DesignFile;
//   onDesignChange: (design: DesignFile) => void;
//   onBack: () => void;
//   canvasSize?: { width: number; height: number; unit: string };
//   bleed?: number; // in inches
// }

// export function CanvasEditor({
//   designs: initialDesigns,
//   activeDesign,
//   onDesignChange,
//   onBack,
//   canvasSize = DEFAULT_CANVAS_SIZE,
//   bleed = 0.0625,
// }: CanvasEditorProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const imageRef = useRef<HTMLImageElement>(null);
//   const magnifierRef = useRef<HTMLDivElement>(null);
//   const threeDRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   const [designs, setDesigns] = useState<DesignFile[]>(initialDesigns);
//   const [showGuidelines, setShowGuidelines] = useState(true);
//   const [showCutLines, setShowCutLines] = useState(true);
//   const [maskOpacity, setMaskOpacity] = useState([0]);
//   const [maskMode, setMaskMode] = useState<"solid" | "wireframe">("solid");
//   const [is3DView, setIs3DView] = useState(false);
//   const [isPanMode, setIsPanMode] = useState(false);
//   const [isMagnifierMode, setIsMagnifierMode] = useState(false);
//   const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
//   const [showMagnifier, setShowMagnifier] = useState(false);
//   const [bleedWarning, setBleedWarning] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [activeSide, setActiveSide] = useState<"front" | "back">("front");
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isMouseOver3D, setIsMouseOver3D] = useState(false);

//   // Dynamic canvas dimensions
//   const [canvasDimensions, setCanvasDimensions] = useState({
//     width: 800,
//     height: 600,
//     actualWidth: canvasSize.width,
//     actualHeight: canvasSize.height,
//     unit: canvasSize.unit,
//     dpi: 300,
//   });

//   // Calculate canvas dimensions based on custom size
//   useEffect(() => {
//     const ppi = 300; // Standard print resolution
//     const widthInPixels = Math.round(canvasSize.width * ppi);
//     const heightInPixels = Math.round(canvasSize.height * ppi);
//     const bleedInPixels = Math.round(bleed * ppi);
    
//     console.log(`Canvas size calculation:`, {
//       input: `${canvasSize.width}" × ${canvasSize.height}"`,
//       output: `${widthInPixels}px × ${heightInPixels}px`,
//       bleed: `${bleedInPixels}px`,
//       ppi
//     });
    
//     setCanvasDimensions(prev => ({
//       ...prev,
//       width: widthInPixels, // NO bleed added
//       height: heightInPixels, // NO bleed added
//       actualWidth: canvasSize.width,
//       actualHeight: canvasSize.height,
//       unit: canvasSize.unit,
//       dpi: ppi
//     }));
//   }, [canvasSize.width, canvasSize.height, canvasSize.unit, bleed]);

//   const [transform, setTransform] = useState({
//     scale: 1,
//     rotation: 0,
//     x: 0,
//     y: 0,
//     flipX: false,
//     flipY: false,
//   });
//   const [history, setHistory] = useState<(typeof transform)[]>([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const { toast } = useToast();

//   const generatePdfThumbnail = usePdfThumbnail();

//   // Get current side design
//   const currentDesign =
//     designs.find((d) => d.id === activeDesign.id) || activeDesign;

//   // Update active side when design changes
//   useEffect(() => {
//     if (currentDesign) {
//       setActiveSide(currentDesign.side);
//     }
//   }, [currentDesign.id, currentDesign.side]);

//   const loadDesign = useCallback(
//     async (design: DesignFile) => {
//       if (design.file.type === "application/pdf") {
//         try {
//           const dataUrl = await renderPdfPageToDataUrl(design.file, 2);
//           setImageUrl(dataUrl);
//         } catch (error) {
//           console.error("Error loading PDF:", error);
//           toast({
//             title: "PDF Loading Error",
//             description: "Failed to load PDF. Please try again.",
//             variant: "destructive",
//           });
//         }
//       } else {
//         const url = URL.createObjectURL(design.file);
//         setImageUrl(url);
//         return () => URL.revokeObjectURL(url);
//       }
//     },
//     [toast]
//   );

//   useEffect(() => {
//     if (currentDesign) {
//       loadDesign(currentDesign);
//     }
//   }, [currentDesign, loadDesign]);

//   // Real-time canvas drawing
//   const drawCanvas = useCallback(
//     (ctx: CanvasRenderingContext2D) => {
//       const canvas = ctx.canvas;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Checkered transparency background
//       const checkSize = 10;
//       ctx.fillStyle = "#ffffff";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = "#f0f0f0";
//       for (let x = 0; x < canvas.width; x += checkSize * 2) {
//         for (let y = 0; y < canvas.height; y += checkSize * 2) {
//           ctx.fillRect(x, y, checkSize, checkSize);
//           ctx.fillRect(x + checkSize, y + checkSize, checkSize, checkSize);
//         }
//       }

//       // Draw image if loaded
//       if (imageRef.current && imageRef.current.complete) {
//         drawImage(ctx);
//       }

//       // Draw guidelines
//       if (showGuidelines || showCutLines) {
//         drawGuidelines(ctx);
//       }

//       // Draw mask overlay
//       if (maskOpacity[0] > 0) {
//         drawMask(ctx);
//       }

//       // Check bleed coverage
//       checkBleedCoverage();
//     },
//     [transform, showGuidelines, showCutLines, imageUrl, maskOpacity, maskMode]
//   );

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         canvas.width = canvasDimensions.width;
//         canvas.height = canvasDimensions.height;
//         drawCanvas(ctx);
//       }
//     }

//     if (history.length === 0) {
//       setHistory([transform]);
//       setHistoryIndex(0);
//     }
//   }, [
//     transform,
//     showGuidelines,
//     showCutLines,
//     imageUrl,
//     maskOpacity,
//     maskMode,
//     canvasDimensions,
//     drawCanvas,
//   ]);

//   const drawGuidelines = (ctx: CanvasRenderingContext2D) => {
//     const canvas = ctx.canvas;
//     const ppi = canvasDimensions.dpi; // Use the actual DPI from canvas dimensions
//     const bleedPx = bleed * ppi;
//     const safePx = 0.0625 * ppi; // 1/8 inch safe margin
//     const lineWidth = 2; // or whatever you use

//     // Calculate the actual finished size in pixels (without bleed)
//     const finishedWidthPx = canvasSize.width * ppi;
//     const finishedHeightPx = canvasSize.height * ppi;
    
//     // Position guidelines based on bleed offset - this ensures they align with design template
//     // The canvas is expanded by bleed on all sides, so guidelines start at bleed offset
//     const finishedRect = {
//       x: bleedPx,
//       y: bleedPx,
//       w: finishedWidthPx,
//       h: finishedHeightPx,
//     };
  
//     // Bleed line (black) - at canvas edge, but inset by half line width
//     const bleedRect = {
//       x: lineWidth / 2,
//       y: lineWidth / 2,
//       w: canvas.width - lineWidth,
//       h: canvas.height - lineWidth,
//     };

//     // Red line (cut) - inset by bleedPx, plus half line width
//     const cutRect = {
//       x: bleedPx + lineWidth / 2,
//       y: bleedPx + lineWidth / 2,
//       w: canvas.width - 2 * bleedPx - lineWidth,
//       h: canvas.height - 2 * bleedPx - lineWidth,
//     };
  
//     // Blue line (safe) - inset by safePx from cut line, plus half line width
//     const safeRect = {
//       x: cutRect.x + safePx + lineWidth / 2,
//       y: cutRect.y + safePx + lineWidth / 2,
//       w: cutRect.w - 2 * safePx - lineWidth,
//       h: cutRect.h - 2 * safePx - lineWidth,
//     };
  
//     ctx.save();
  
//     // Bleed line (black) - outermost, at canvas edges
//     if (showGuidelines) {
//       ctx.strokeStyle = "#000000";
//       ctx.lineWidth = 2;
//       ctx.setLineDash([8, 8]);
//       ctx.strokeRect(bleedRect.x, bleedRect.y, bleedRect.w, bleedRect.h);
//     }
  
//     // Cut line (red) - finished size, offset by bleed amount
//     if (showCutLines) {
//       ctx.strokeStyle = "#ff0000";
//       ctx.lineWidth = 2;
//       ctx.setLineDash([]);
//       ctx.strokeRect(cutRect.x, cutRect.y, cutRect.w, cutRect.h);
//     }
  
//     // Safe line (blue) - safe area
//     if (showGuidelines) {
//       ctx.strokeStyle = "#0066cc";
//       ctx.lineWidth = 1;
//       ctx.setLineDash([5, 5]);
//       ctx.strokeRect(safeRect.x, safeRect.y, safeRect.w, safeRect.h);
//     }
  
//     ctx.restore();
//   };

//   const drawImage = (ctx: CanvasRenderingContext2D) => {
//     const canvas = ctx.canvas;
//     const img = imageRef.current!;
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     ctx.save();

//     ctx.translate(centerX + transform.x, centerY + transform.y);
//     ctx.rotate((transform.rotation * Math.PI) / 180);
//     ctx.scale(
//       transform.scale * (transform.flipX ? -1 : 1),
//       transform.scale * (transform.flipY ? -1 : 1)
//     );

//     // Use original image dimensions
//     const imgWidth = img.width;
//     const imgHeight = img.height;

//     ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

//     ctx.restore();
//   };

//   const drawMask = (ctx: CanvasRenderingContext2D) => {
//     const canvas = ctx.canvas;
//     const opacity = maskOpacity[0] / 100;

//     ctx.save();
//     ctx.globalAlpha = opacity;

//     if (maskMode === "solid") {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     } else {
//       ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
//       ctx.lineWidth = 1;
//       ctx.setLineDash([2, 2]);

//       for (let x = 0; x < canvas.width; x += 20) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//         ctx.stroke();
//       }
//       for (let y = 0; y < canvas.height; y += 20) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//         ctx.stroke();
//       }
//     }

//     ctx.restore();
//   };

//   const checkBleedCoverage = () => {
//     const hasBleedCoverage = transform.scale >= 1.1;
//     setBleedWarning(!hasBleedCoverage);
//   };

//   const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isMagnifierMode) {
//       const canvas = canvasRef.current!;
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       setMagnifierPosition({ x, y });
//       setShowMagnifier(true);
//     }
//   };

//   const handleCanvasMouseLeave = () => {
//     if (isMagnifierMode) {
//       setShowMagnifier(false);
//     }
//   };

//   // 3D mouse tracking
//   const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!threeDRef.current) return;

//     const rect = threeDRef.current.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;

//     setMousePosition({ x, y });
//   };

//   const saveState = () => {
//     const newHistory = history.slice(0, historyIndex + 1);
//     newHistory.push({ ...transform });

//     if (newHistory.length > 20) {
//       newHistory.shift();
//     } else {
//       setHistoryIndex((prev) => prev + 1);
//     }

//     setHistory(newHistory);
//   };

//   // Real-time file operations
//   const replaceDesign = async (id: string) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*,.pdf";
//     input.onchange = async (e) => {
//       const file = (e.target as HTMLInputElement).files?.[0];
//       if (file) {
//         const designToReplace = designs.find((d) => d.id === id);
//         if (!designToReplace) return;

//         let thumbnail = "";
//         if (file.type.startsWith("image/")) {
//           thumbnail = URL.createObjectURL(file);
//         } else if (file.type === "application/pdf") {
//           thumbnail = await generatePdfThumbnail(file);
//         }

//         // Clean up old thumbnail
//         if (designToReplace.thumbnail) {
//           URL.revokeObjectURL(designToReplace.thumbnail);
//         }

//         const newDesign: DesignFile = {
//           id: designToReplace.id,
//           file,
//           side: designToReplace.side, // Keep the same side
//           thumbnail,
//         };

//         setDesigns((prev) => prev.map((d) => (d.id === id ? newDesign : d)));

//         // Update active design if this was the active one
//         if (activeDesign.id === id) {
//           onDesignChange(newDesign);
//         }

//         toast({
//           title: "File Replaced",
//           description: `${file.name} has been uploaded for ${designToReplace.side} side.`,
//         });
//       }
//     };
//     input.click();
//   };

//   const flipArtwork = (axis: "X" | "Y") => {
//     setTransform((prev) => ({
//       ...prev,
//       [`flip${axis}`]: !prev[`flip${axis}` as keyof typeof prev],
//     }));
//     saveState();
//   };

//   const rotateArtwork = (degrees: number) => {
//     setTransform((prev) => ({
//       ...prev,
//       rotation: prev.rotation + degrees,
//     }));
//     saveState();
//   };

//   const scaleArtwork = (factor: number) => {
//     setTransform((prev) => ({
//       ...prev,
//       scale: Math.max(0.1, Math.min(5, prev.scale * factor)),
//     }));
//     saveState();
//   };

//   const fitToTemplate = () => {
//     setTransform((prev) => ({
//       ...prev,
//       scale: 1.2,
//       x: 0,
//       y: 0,
//       rotation: 0,
//     }));
//     saveState();
//   };

//   const nudgeArtwork = (direction: "up" | "down" | "left" | "right") => {
//     // Calculate nudge amount based on canvas size (1% of the smaller dimension)
//     const nudgeAmount = Math.max(5, Math.min(canvasDimensions.width, canvasDimensions.height) * 0.01);

//     setTransform((prev) => {
//       switch (direction) {
//         case "up":
//           return { ...prev, y: prev.y - nudgeAmount };
//         case "down":
//           return { ...prev, y: prev.y + nudgeAmount };
//         case "left":
//           return { ...prev, x: prev.x - nudgeAmount };
//         case "right":
//           return { ...prev, x: prev.x + nudgeAmount };
//         default:
//           return prev;
//       }
//     });
//     saveState();
//   };

//   const undo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setTransform(history[historyIndex - 1]);
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       setTransform(history[historyIndex + 1]);
//     }
//   };

//   const resetView = () => {
//     const initialTransform = {
//       scale: 1,
//       rotation: 0,
//       x: 0,
//       y: 0,
//       flipX: false,
//       flipY: false,
//     };
//     setTransform(initialTransform);
//     setIs3DView(false);
//     saveState();
//   };

//   const submitArtwork = () => {
//     const artworkData = {
//       designs: designs.map((d) => ({
//         id: d.id,
//         side: d.side,
//         fileName: d.file.name,
//         thumbnail: d.thumbnail,
//       })),
//       canvasSize: canvasDimensions,
//       transform,
//     };
//     sessionStorage.setItem("artworkPreview", JSON.stringify(artworkData));
//     router.push("/artwork-preview");
//   };

//   const toolbarSections = [
//     {
//       title: "Transform",
//       tools: [
//         {
//           name: "Flip Horizontal",
//           icon: FlipHorizontal,
//           action: () => flipArtwork("X"),
//           tooltip: "Flip artwork horizontally",
//         },
//         {
//           name: "Flip Vertical",
//           icon: FlipVertical,
//           action: () => flipArtwork("Y"),
//           tooltip: "Flip artwork vertically",
//         },
//         {
//           name: "Rotate Left",
//           icon: RotateCcw,
//           action: () => rotateArtwork(-90),
//           tooltip: "Rotate 90° counter-clockwise",
//         },
//         {
//           name: "Rotate Right",
//           icon: RotateCw,
//           action: () => rotateArtwork(90),
//           tooltip: "Rotate 90° clockwise",
//         },
//       ],
//     },
//     {
//       title: "Scale",
//       tools: [
//         {
//           name: "Scale Up",
//           icon: ZoomIn,
//           action: () => scaleArtwork(1.1),
//           tooltip: "Increase size by 10%",
//         },
//         {
//           name: "Scale Down",
//           icon: ZoomOut,
//           action: () => scaleArtwork(0.9),
//           tooltip: "Decrease size by 10%",
//         },
//         {
//           name: "Fit to Template",
//           icon: Maximize,
//           action: fitToTemplate,
//           tooltip: "Fit artwork to template with bleed",
//         },
//       ],
//     },
//     {
//       title: "Position",
//       tools: [
//         {
//           name: "Nudge Up",
//           icon: ArrowUp,
//           action: () => nudgeArtwork("up"),
//           tooltip: "Move artwork up",
//         },
//         {
//           name: "Nudge Down",
//           icon: ArrowDown,
//           action: () => nudgeArtwork("down"),
//           tooltip: "Move artwork down",
//         },
//         {
//           name: "Nudge Left",
//           icon: ArrowLeft,
//           action: () => nudgeArtwork("left"),
//           tooltip: "Move artwork left",
//         },
//         {
//           name: "Nudge Right",
//           icon: ArrowRight,
//           action: () => nudgeArtwork("right"),
//           tooltip: "Move artwork right",
//         },
//       ],
//     },
//     {
//       title: "View",
//       tools: [
//         {
//           name: "Pan Mode",
//           icon: Move,
//           action: () => setIsPanMode(!isPanMode),
//           active: isPanMode,
//           tooltip: "Enable pan mode for canvas navigation",
//         },
//         {
//           name: "3D View",
//           icon: Box,
//           action: () => setIs3DView(!is3DView),
//           active: is3DView,
//           tooltip: "Toggle 3D preview of both sides",
//         },
//         {
//           name: "Magnifier",
//           icon: Search,
//           action: () => setIsMagnifierMode(!isMagnifierMode),
//           active: isMagnifierMode,
//           tooltip: "Enable magnifier tool",
//         },
//       ],
//     },
//     {
//       title: "Guidelines",
//       tools: [
//         {
//           name: "Toggle Guidelines",
//           icon: Grid3X3,
//           action: () => setShowGuidelines(!showGuidelines),
//           active: showGuidelines,
//           tooltip: "Show/hide bleed and safe area guidelines",
//         },
//         {
//           name: "Toggle Cut Lines",
//           icon: Scissors,
//           action: () => setShowCutLines(!showCutLines),
//           active: showCutLines,
//           tooltip: "Show/hide cut lines",
//         },
//       ],
//     },
//     {
//       title: "History",
//       tools: [
//         {
//           name: "Undo",
//           icon: Undo,
//           action: undo,
//           disabled: historyIndex <= 0,
//           tooltip: "Undo last action",
//         },
//         {
//           name: "Redo",
//           icon: Redo,
//           action: redo,
//           disabled: historyIndex >= history.length - 1,
//           tooltip: "Redo last undone action",
//         },
//         {
//           name: "Reset View",
//           icon: Reset,
//           action: resetView,
//           tooltip: "Reset all transformations",
//         },
//       ],
//     },
//   ];

//   const frontDesign = designs.find((d) => d.side === "front");
//   const backDesign = designs.find((d) => d.side === "back");

//   return (
//     <TooltipProvider>
//       <div className="flex h-full bg-gray-100">
//         {/* Left Sidebar for File Management */}
//         <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold">Uploaded Files</h3>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {designs.map((design) => (
//               <DesignThumbnail
//                 key={design.id}
//                 design={design}
//                 isActive={design.id === currentDesign.id}
//                 onSelect={() => onDesignChange(design)}
//                 onDelete={() => replaceDesign(design.id)}
//               />
//             ))}
//             {designs.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <FileIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                 <p className="text-sm">No files uploaded yet</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Editor Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Hidden image for loading */}
//           {imageUrl && (
//             <img
//               ref={imageRef}
//               src={imageUrl || "/placeholder.svg"}
//               alt="Artwork"
//               className="hidden"
//               onLoad={() => {
//                 const canvas = canvasRef.current;
//                 if (canvas) {
//                   const ctx = canvas.getContext("2d");
//                   if (ctx) {
//                     drawCanvas(ctx);
//                   }
//                 }
//               }}
//             />
//           )}

//           {/* Enhanced Toolbar */}
//           <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onBack}
//                 className="text-sm hover:scale-105 transition-transform bg-transparent"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
//               </Button>

//               {/* Front/Back Toggle */}
//               <Tabs
//                 value={activeSide}
//                 onValueChange={(value) => {
//                   const side = value as "front" | "back";
//                   setActiveSide(side);
//                   // Switch to the design for the selected side
//                   const targetDesign = designs.find((d) => d.side === side);
//                   if (targetDesign) {
//                     onDesignChange(targetDesign);
//                   }
//                 }}
//               >
//                 <TabsList>
//                   <TabsTrigger value="front" disabled={!frontDesign}>
//                     Front
//                   </TabsTrigger>
//                   <TabsTrigger value="back" disabled={!backDesign}>
//                     Back
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>

//               {/* Canvas Size Display */}
//               <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
//                 {canvasDimensions.actualWidth}" ×{" "}
//                 {canvasDimensions.actualHeight}" ({canvasDimensions.unit}) - {canvasDimensions.width}×{canvasDimensions.height}px
//               </div>
//             </div>

//             {/* Toolbar Sections */}
//             <div className="flex flex-wrap gap-6">
//               {toolbarSections.map((section) => (
//                 <div key={section.title} className="flex flex-col gap-2">
//                   <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                     {section.title}
//                   </span>
//                   <div className="flex gap-1">
//                     {section.tools.map((tool) => (
//                       <Tooltip key={tool.name}>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={tool.action}
//                             disabled={
//                               "disabled" in tool ? tool.disabled : false
//                             }
//                             className={cn(
//                               "h-9 w-9 hover:scale-105 transition-all duration-200",
//                               ("active" in tool ? tool.active : false) &&
//                                 "bg-[#00AAB2] text-white hover:bg-[#00AAB2]/90"
//                             )}
//                           >
//                             <tool.icon className="w-4 h-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{tool.tooltip}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {/* Mask Controls */}
//               <div className="flex flex-col gap-2">
//                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                   Mask
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className={cn(
//                           "h-9 w-9",
//                           maskMode === "wireframe" && "bg-[#00AAB2] text-white"
//                         )}
//                         onClick={() =>
//                           setMaskMode(
//                             maskMode === "solid" ? "wireframe" : "solid"
//                           )
//                         }
//                       >
//                         <Layers className="w-4 h-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Toggle mask mode (solid/wireframe)</p>
//                     </TooltipContent>
//                   </Tooltip>
//                   <div className="w-20">
//                     <Slider
//                       value={maskOpacity}
//                       onValueChange={setMaskOpacity}
//                       max={100}
//                       step={1}
//                       className="w-full"
//                     />
//                   </div>
//                   <span className="text-xs text-gray-500 w-8">
//                     {maskOpacity[0]}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Canvas Area */}
//           <div className="flex-1 relative overflow-auto p-8">
//             <div className="w-full h-full flex flex-col items-center justify-center">
//               {!is3DView ? (
//                 <canvas
//                   ref={canvasRef}
//                   className="border border-gray-300 rounded-lg shadow-lg bg-white"
//                   style={{
//                     cursor: isPanMode
//                       ? "grab"
//                       : isMagnifierMode
//                       ? "none"
//                       : "default",
//                     maxWidth: "100%",
//                     maxHeight: "100%",
//                   }}
//                   onMouseMove={handleCanvasMouseMove}
//                   onMouseLeave={handleCanvasMouseLeave}
//                 />
//               ) : (
//                 <div
//                   ref={threeDRef}
//                   className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden"
//                   onMouseMove={handle3DMouseMove}
//                   onMouseEnter={() => setIsMouseOver3D(true)}
//                   onMouseLeave={() => setIsMouseOver3D(false)}
//                 >
//                   <div
//                     className="relative transform-gpu transition-transform duration-300 ease-out"
//                     style={{
//                       transform: `perspective(1200px) rotateY(${
//                         isMouseOver3D ? (mousePosition.x - 0.5) * 40 - 20 : -20
//                       }deg) rotateX(${
//                         isMouseOver3D ? (mousePosition.y - 0.5) * -20 + 8 : 8
//                       }deg)`,
//                       transformStyle: "preserve-3d",
//                     }}
//                   >
//                     {/* Front side */}
//                     <div
//                       className="w-96 h-60 bg-white rounded-xl shadow-2xl border-2 border-gray-200 relative overflow-hidden"
//                       style={{
//                         transformStyle: "preserve-3d",
//                         backfaceVisibility: "hidden",
//                       }}
//                     >
//                       {frontDesign?.thumbnail && (
//                         <Image
//                           src={frontDesign.thumbnail || "/placeholder.svg"}
//                           alt="Front design"
//                           fill
//                           className="object-cover rounded-xl"
//                           style={{
//                             transform: `scale(${transform.scale}) rotate(${
//                               transform.rotation
//                             }deg) ${transform.flipX ? "scaleX(-1)" : ""} ${
//                               transform.flipY ? "scaleY(-1)" : ""
//                             }`,
//                           }}
//                         />
//                       )}
//                       <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
//                         Front
//                       </div>
//                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 rounded-xl"></div>
//                     </div>

//                     {/* Back side */}
//                     {backDesign && (
//                       <div
//                         className="w-96 h-60 bg-white rounded-xl shadow-2xl border-2 border-gray-200 absolute top-0 overflow-hidden"
//                         style={{
//                           transform:
//                             "translateX(15px) translateZ(-8px) rotateY(180deg)",
//                           transformStyle: "preserve-3d",
//                           backfaceVisibility: "hidden",
//                         }}
//                       >
//                         {backDesign.thumbnail && (
//                           <Image
//                             src={backDesign.thumbnail || "/placeholder.svg"}
//                             alt="Back design"
//                             fill
//                             className="object-cover rounded-xl scale-x-[-1]"
//                             style={{
//                               transform: `scale(${transform.scale}) rotate(${
//                                 transform.rotation
//                               }deg) ${
//                                 transform.flipX ? "scaleX(1)" : "scaleX(-1)"
//                               } ${transform.flipY ? "scaleY(-1)" : ""}`,
//                             }}
//                           />
//                         )}
//                         <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium scale-x-[-1]">
//                           Back
//                         </div>
//                         <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-white/20 rounded-xl"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Magnifier with improved positioning */}
//               {isMagnifierMode && showMagnifier && imageUrl && !is3DView && (
//                 <div
//                   ref={magnifierRef}
//                   className="absolute pointer-events-none border-4 border-white rounded-full shadow-2xl overflow-hidden z-50"
//                   style={{
//                     left: magnifierPosition.x - 100,
//                     top: magnifierPosition.y - 100,
//                     width: 200,
//                     height: 200,
//                     backgroundImage: `url(${imageUrl})`,
//                     backgroundSize: `${canvasDimensions.width * 3}px ${
//                       canvasDimensions.height * 3
//                     }px`,
//                     backgroundPosition: `-${
//                       (magnifierPosition.x - 100) * 3
//                     }px -${(magnifierPosition.y - 100) * 3}px`,
//                     backgroundRepeat: "no-repeat",
//                   }}
//                 >
//                   <div className="absolute inset-0 border-2 border-gray-400 rounded-full"></div>
//                   <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
//                   <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
//                 </div>
//               )}

//               {/* Guidelines Text */}
//               <div className="mt-4 text-center text-sm">
//                 <p>
//                   <span className="text-blue-600 font-semibold">blue line</span>{" "}
//                   - text safe area{" "}
//                   <span className="text-red-600 font-semibold">red line</span> -
//                   cut line{" "}
//                   <span className="text-black font-semibold">black line</span> -
//                   bleed line
//                 </p>
//                 {bleedWarning && (
//                   <p className="text-orange-600 font-semibold mt-2">
//                     The artwork does not extend all the way to the black bleed
//                     line. To ensure complete print coverage on the final
//                     product, adjust the work to touch or extend past the bleed
//                     line on all sides.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex justify-end">
//             <Button
//               onClick={submitArtwork}
//               className="bg-[#00AAB2] hover:bg-[#00AAB2]/90 text-white px-8 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-200"
//             >
//               Submit Artwork
//             </Button>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

// function DesignThumbnail({
//   design,
//   isActive,
//   onSelect,
//   onDelete,
// }: {
//   design: DesignFile;
//   isActive: boolean;
//   onSelect: () => void;
//   onDelete: () => void;
// }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
//         isActive
//           ? "border-[#00AAB2] bg-[#00AAB2]/5"
//           : "border-gray-200 hover:bg-gray-50"
//       )}
//       onClick={onSelect}
//     >
//       <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
//         {design.thumbnail ? (
//           <Image
//             src={design.thumbnail || "/placeholder.svg"}
//             alt="Thumbnail"
//             width={48}
//             height={48}
//             className="w-full h-full object-cover rounded"
//           />
//         ) : (
//           <FileIcon className="w-6 h-6 text-gray-400" />
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">{design.file.name}</p>
//         <p className="text-xs text-gray-500 capitalize">{design.side} Side</p>
//       </div>

//       <Button
//         size="sm"
//         variant="outline"
//         onClick={(e) => {
//           e.stopPropagation();
//           onDelete();
//         }}
//         className="text-[#00AAB2] hover:text-[#00AAB2] hover:bg-[#00AAB2]/10 border-[#00AAB2]"
//       >
//         Replace
//       </Button>
//     </div>
//   );
// }









// "use client"
// import type React from "react"
// import { useRef, useEffect, useState, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Slider } from "@/components/ui/slider"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   FlipHorizontal,
//   FlipVertical,
//   RotateCcw,
//   RotateCw,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   ArrowUp,
//   ArrowDown,
//   ArrowLeft,
//   ArrowRight,
//   Move,
//   Search,
//   Grid3X3,
//   Scissors,
//   Layers,
//   Undo,
//   Redo,
//   TimerResetIcon as Reset,
//   Box,
//   FileIcon,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/components/ui/use-toast"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { usePdfThumbnail } from "./use-pdf-thumbnail"
// import { renderPdfPageToDataUrl } from "./pdf-utils"

// const DEFAULT_CANVAS_SIZE = { width: 3.5, height: 2, unit: "inches" } as const

// interface DesignFile {
//   id: string
//   file: File
//   side: "front" | "back"
//   thumbnail?: string
// }

// interface CanvasEditorProps {
//   designs: DesignFile[]
//   activeDesign: DesignFile
//   onDesignChange: (design: DesignFile) => void
//   onBack: () => void
//   canvasSize?: { width: number; height: number; unit: string }
//   bleed?: number // in inches
// }

// export function CanvasEditor({
//   designs: initialDesigns,
//   activeDesign,
//   onDesignChange,
//   onBack,
//   canvasSize = DEFAULT_CANVAS_SIZE,
//   bleed = 0.0625,
// }: CanvasEditorProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const imageRef = useRef<HTMLImageElement>(null)
//   const magnifierRef = useRef<HTMLDivElement>(null)
//   const threeDRef = useRef<HTMLDivElement>(null)
//   const router = useRouter()
//   const [designs, setDesigns] = useState<DesignFile[]>(initialDesigns)
//   const [showGuidelines, setShowGuidelines] = useState(true)
//   const [showCutLines, setShowCutLines] = useState(true)
//   const [maskOpacity, setMaskOpacity] = useState([0])
//   const [maskMode, setMaskMode] = useState<"solid" | "wireframe">("solid")
//   const [is3DView, setIs3DView] = useState(false)
//   const [isPanMode, setIsPanMode] = useState(false)
//   const [isMagnifierMode, setIsMagnifierMode] = useState(false)
//   const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
//   const [showMagnifier, setShowMagnifier] = useState(false)
//   const [bleedWarning, setBleedWarning] = useState(false)
//   const [imageUrl, setImageUrl] = useState<string>("")
//   const [activeSide, setActiveSide] = useState<"front" | "back">("front")
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
//   const [isMouseOver3D, setIsMouseOver3D] = useState(false)

//   // Dynamic canvas dimensions
//   const [canvasDimensions, setCanvasDimensions] = useState({
//     width: 800,
//     height: 600,
//     actualWidth: canvasSize.width,
//     actualHeight: canvasSize.height,
//     unit: canvasSize.unit,
//     dpi: 300,
//   })

//   // Calculate canvas dimensions based on custom size
//   useEffect(() => {
//     const ppi = 300 // Standard print resolution
//     const widthInPixels = Math.round(canvasSize.width * ppi)
//     const heightInPixels = Math.round(canvasSize.height * ppi)
//     const bleedInPixels = Math.round(bleed * ppi)

//     console.log(`Canvas size calculation:`, {
//       input: `${canvasSize.width}" × ${canvasSize.height}"`,
//       output: `${widthInPixels}px × ${heightInPixels}px`,
//       bleed: `${bleedInPixels}px`,
//       ppi,
//     })

//     setCanvasDimensions((prev) => ({
//       ...prev,
//       width: widthInPixels, // NO bleed added
//       height: heightInPixels, // NO bleed added
//       actualWidth: canvasSize.width,
//       actualHeight: canvasSize.height,
//       unit: canvasSize.unit,
//       dpi: ppi,
//     }))
//   }, [canvasSize.width, canvasSize.height, canvasSize.unit, bleed])

//   const [transform, setTransform] = useState({
//     scale: 1,
//     rotation: 0,
//     x: 0,
//     y: 0,
//     flipX: false,
//     flipY: false,
//   })

//   const [history, setHistory] = useState<(typeof transform)[]>([])
//   const [historyIndex, setHistoryIndex] = useState(-1)
//   const { toast } = useToast()
//   const generatePdfThumbnail = usePdfThumbnail()

//   // Get current side design
//   const currentDesign = designs.find((d) => d.id === activeDesign.id) || activeDesign

//   // Update active side when design changes
//   useEffect(() => {
//     if (currentDesign) {
//       setActiveSide(currentDesign.side)
//     }
//   }, [activeDesign.id])

//   const loadDesign = useCallback(
//     async (design: DesignFile) => {
//       if (design.file.type === "application/pdf") {
//         try {
//           const dataUrl = await renderPdfPageToDataUrl(design.file, 2)
//           setImageUrl(dataUrl)
//         } catch (error) {
//           console.error("Error loading PDF:", error)
//           toast({
//             title: "PDF Loading Error",
//             description: "Failed to load PDF. Please try again.",
//             variant: "destructive",
//           })
//         }
//       } else {
//         const url = URL.createObjectURL(design.file)
//         setImageUrl(url)
//         return () => URL.revokeObjectURL(url)
//       }
//     },
//     [toast],
//   )

//   useEffect(() => {
//     if (currentDesign) {
//       loadDesign(currentDesign)
//     }
//   }, [currentDesign, loadDesign])

//   // Real-time canvas drawing
//   const drawCanvas = useCallback(
//     (ctx: CanvasRenderingContext2D) => {
//       const canvas = ctx.canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       // Checkered transparency background
//       const checkSize = 10
//       ctx.fillStyle = "#ffffff"
//       ctx.fillRect(0, 0, canvas.width, canvas.height)
//       ctx.fillStyle = "#f0f0f0"
//       for (let x = 0; x < canvas.width; x += checkSize * 2) {
//         for (let y = 0; y < canvas.height; y += checkSize * 2) {
//           ctx.fillRect(x, y, checkSize, checkSize)
//           ctx.fillRect(x + checkSize, y + checkSize, checkSize, checkSize)
//         }
//       }

//       // Draw image if loaded
//       if (imageRef.current && imageRef.current.complete) {
//         drawImage(ctx)
//       }

//       // Draw guidelines
//       if (showGuidelines || showCutLines) {
//         drawGuidelines(ctx)
//       }

//       // Draw mask overlay
//       if (maskOpacity[0] > 0) {
//         drawMask(ctx)
//       }

//       // Check bleed coverage
//       checkBleedCoverage()
//     },
//     [transform, showGuidelines, showCutLines, imageUrl, maskOpacity, maskMode],
//   )

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (canvas) {
//       const ctx = canvas.getContext("2d")
//       if (ctx) {
//         canvas.width = canvasDimensions.width
//         canvas.height = canvasDimensions.height
//         drawCanvas(ctx)
//       }
//     }
//     if (history.length === 0) {
//       setHistory([transform])
//       setHistoryIndex(0)
//     }
//   }, [transform, showGuidelines, showCutLines, imageUrl, maskOpacity, maskMode, canvasDimensions, drawCanvas])

//   const drawGuidelines = (ctx: CanvasRenderingContext2D) => {
//     const canvas = ctx.canvas
//     const ppi = canvasDimensions.dpi // Use the actual DPI from canvas dimensions
//     const bleedPx = bleed * ppi
//     const safePx = 0.0625 * ppi // 1/8 inch safe margin
//     const lineWidth = 2 // or whatever you use

//     // Calculate the actual finished size in pixels (without bleed)
//     const finishedWidthPx = canvasSize.width * ppi
//     const finishedHeightPx = canvasSize.height * ppi

//     // Position guidelines based on bleed offset - this ensures they align with design template
//     // The canvas is expanded by bleed on all sides, so guidelines start at bleed offset
//     const finishedRect = {
//       x: bleedPx,
//       y: bleedPx,
//       w: finishedWidthPx,
//       h: finishedHeightPx,
//     }

//     // Bleed line (black) - at canvas edge, but inset by half line width
//     const bleedRect = {
//       x: lineWidth / 2,
//       y: lineWidth / 2,
//       w: canvas.width - lineWidth,
//       h: canvas.height - lineWidth,
//     }

//     // Red line (cut) - inset by bleedPx, plus half line width
//     const cutRect = {
//       x: bleedPx + lineWidth / 2,
//       y: bleedPx + lineWidth / 2,
//       w: canvas.width - 2 * bleedPx - lineWidth,
//       h: canvas.height - 2 * bleedPx - lineWidth,
//     }

//     // Blue line (safe) - inset by safePx from cut line, plus half line width
//     const safeRect = {
//       x: cutRect.x + safePx + lineWidth / 2,
//       y: cutRect.y + safePx + lineWidth / 2,
//       w: cutRect.w - 2 * safePx - lineWidth,
//       h: cutRect.h - 2 * safePx - lineWidth,
//     }

//     ctx.save()

//     // Bleed line (black) - outermost, at canvas edges
//     if (showGuidelines) {
//       ctx.strokeStyle = "#000000"
//       ctx.lineWidth = 2
//       ctx.setLineDash([8, 8])
//       ctx.strokeRect(bleedRect.x, bleedRect.y, bleedRect.w, bleedRect.h)
//     }

//     // Cut line (red) - finished size, offset by bleed amount
//     if (showCutLines) {
//       ctx.strokeStyle = "#ff0000"
//       ctx.lineWidth = 2
//       ctx.setLineDash([])
//       ctx.strokeRect(cutRect.x, cutRect.y, cutRect.w, cutRect.h)
//     }

//     // Safe line (blue) - safe area
//     if (showGuidelines) {
//       ctx.strokeStyle = "#0066cc"
//       ctx.lineWidth = 1
//       ctx.setLineDash([5, 5])
//       ctx.strokeRect(safeRect.x, safeRect.y, safeRect.w, safeRect.h)
//     }

//     ctx.restore()
//   }

//   const drawImage = (ctx: CanvasRenderingContext2D) => {
//     const canvas = ctx.canvas
//     const img = imageRef.current!
//     const centerX = canvas.width / 2
//     const centerY = canvas.height / 2

//     ctx.save()
//     ctx.translate(centerX + transform.x, centerY + transform.y)
//     ctx.rotate((transform.rotation * Math.PI) / 180)
//     ctx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale * (transform.flipY ? -1 : 1))

//     // Use original image dimensions
//     const imgWidth = img.width
//     const imgHeight = img.height
//     ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
//     ctx.restore()
//   }

//   const drawMask = (ctx: CanvasRenderingContext2D) => {
//     const canvas = ctx.canvas
//     const opacity = maskOpacity[0] / 100

//     ctx.save()
//     ctx.globalAlpha = opacity
//     if (maskMode === "solid") {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
//       ctx.fillRect(0, 0, canvas.width, canvas.height)
//     } else {
//       ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
//       ctx.lineWidth = 1
//       ctx.setLineDash([2, 2])
//       for (let x = 0; x < canvas.width; x += 20) {
//         ctx.beginPath()
//         ctx.moveTo(x, 0)
//         ctx.lineTo(x, canvas.height)
//         ctx.stroke()
//       }
//       for (let y = 0; y < canvas.height; y += 20) {
//         ctx.beginPath()
//         ctx.moveTo(0, y)
//         ctx.lineTo(canvas.width, y)
//         ctx.stroke()
//       }
//     }
//     ctx.restore()
//   }

//   const checkBleedCoverage = () => {
//     const hasBleedCoverage = transform.scale >= 1.1
//     setBleedWarning(!hasBleedCoverage)
//   }

//   const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isMagnifierMode) {
//       const canvas = canvasRef.current!
//       const rect = canvas.getBoundingClientRect()
//       const x = e.clientX - rect.left
//       const y = e.clientY - rect.top
//       setMagnifierPosition({ x, y })
//       setShowMagnifier(true)
//     }
//   }

//   const handleCanvasMouseLeave = () => {
//     if (isMagnifierMode) {
//       setShowMagnifier(false)
//     }
//   }

//   // 3D mouse tracking
//   const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!threeDRef.current) return
//     const rect = threeDRef.current.getBoundingClientRect()
//     const x = (e.clientX - rect.left) / rect.width
//     const y = (e.clientY - rect.top) / rect.height
//     setMousePosition({ x, y })
//   }

//   const saveState = () => {
//     const newHistory = history.slice(0, historyIndex + 1)
//     newHistory.push({ ...transform })
//     if (newHistory.length > 20) {
//       newHistory.shift()
//     } else {
//       setHistoryIndex((prev) => prev + 1)
//     }
//     setHistory(newHistory)
//   }

//   // Function to capture canvas state as image
//   const captureCanvasState = async (design: DesignFile): Promise<string | null> => {
//     return new Promise((resolve) => {
//       // Create a temporary canvas
//       const tempCanvas = document.createElement("canvas")
//       const tempCtx = tempCanvas.getContext("2d")
//       if (!tempCtx) {
//         resolve(null)
//         return
//       }

//       tempCanvas.width = canvasDimensions.width
//       tempCanvas.height = canvasDimensions.height

//       // Load the design image
//       const img = new window.Image()
//       img.crossOrigin = "anonymous"

//       img.onload = () => {
//         // Clear canvas with white background
//         tempCtx.fillStyle = "#ffffff"
//         tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

//         // Draw the image with current transform
//         const centerX = tempCanvas.width / 2
//         const centerY = tempCanvas.height / 2

//         tempCtx.save()
//         tempCtx.translate(centerX + transform.x, centerY + transform.y)
//         tempCtx.rotate((transform.rotation * Math.PI) / 180)
//         tempCtx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale * (transform.flipY ? -1 : 1))

//         const imgWidth = img.width
//         const imgHeight = img.height
//         tempCtx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
//         tempCtx.restore()

//         // Convert to data URL
//         const dataUrl = tempCanvas.toDataURL("image/png")
//         resolve(dataUrl)
//       }

//       img.onerror = () => {
//         resolve(null)
//       }

//       // Set image source
//       if (design.file.type === "application/pdf") {
//         renderPdfPageToDataUrl(design.file, 2)
//           .then((dataUrl) => {
//             img.src = dataUrl
//           })
//           .catch(() => {
//             resolve(null)
//           })
//       } else {
//         img.src = URL.createObjectURL(design.file)
//       }
//     })
//   }

//   // Real-time file operations
//   const replaceDesign = async (id: string) => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "image/*,.pdf"
//     input.onchange = async (e) => {
//       const file = (e.target as HTMLInputElement).files?.[0]
//       if (file) {
//         const designToReplace = designs.find((d) => d.id === id)
//         if (!designToReplace) return

//         let thumbnail = ""
//         if (file.type.startsWith("image/")) {
//           thumbnail = URL.createObjectURL(file)
//         } else if (file.type === "application/pdf") {
//           thumbnail = await generatePdfThumbnail(file)
//         }

//         // Clean up old thumbnail
//         if (designToReplace.thumbnail) {
//           URL.revokeObjectURL(designToReplace.thumbnail)
//         }

//         const newDesign: DesignFile = {
//           id: designToReplace.id,
//           file,
//           side: designToReplace.side, // Keep the same side
//           thumbnail,
//         }

//         setDesigns((prev) => prev.map((d) => (d.id === id ? newDesign : d)))

//         // Update active design if this was the active one
//         if (activeDesign.id === id) {
//           onDesignChange(newDesign)
//         }

//         toast({
//           title: "File Replaced",
//           description: `${file.name} has been uploaded for ${designToReplace.side} side.`,
//         })
//       }
//     }
//     input.click()
//   }

//   const flipArtwork = (axis: "X" | "Y") => {
//     setTransform((prev) => ({
//       ...prev,
//       [`flip${axis}`]: !prev[`flip${axis}` as keyof typeof prev],
//     }))
//     saveState()
//   }

//   const rotateArtwork = (degrees: number) => {
//     setTransform((prev) => ({
//       ...prev,
//       rotation: prev.rotation + degrees,
//     }))
//     saveState()
//   }

//   const scaleArtwork = (factor: number) => {
//     setTransform((prev) => ({
//       ...prev,
//       scale: Math.max(0.1, Math.min(5, prev.scale * factor)),
//     }))
//     saveState()
//   }

//   const fitToTemplate = () => {
//     setTransform((prev) => ({
//       ...prev,
//       scale: 1.2,
//       x: 0,
//       y: 0,
//       rotation: 0,
//     }))
//     saveState()
//   }

//   const nudgeArtwork = (direction: "up" | "down" | "left" | "right") => {
//     // Calculate nudge amount based on canvas size (1% of the smaller dimension)
//     const nudgeAmount = Math.max(5, Math.min(canvasDimensions.width, canvasDimensions.height) * 0.01)
//     setTransform((prev) => {
//       switch (direction) {
//         case "up":
//           return { ...prev, y: prev.y - nudgeAmount }
//         case "down":
//           return { ...prev, y: prev.y + nudgeAmount }
//         case "left":
//           return { ...prev, x: prev.x - nudgeAmount }
//         case "right":
//           return { ...prev, x: prev.x + nudgeAmount }
//         default:
//           return prev
//       }
//     })
//     saveState()
//   }

//   const undo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1)
//       setTransform(history[historyIndex - 1])
//     }
//   }

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1)
//       setTransform(history[historyIndex + 1])
//     }
//   }

//   const resetView = () => {
//     const initialTransform = {
//       scale: 1,
//       rotation: 0,
//       x: 0,
//       y: 0,
//       flipX: false,
//       flipY: false,
//     }
//     setTransform(initialTransform)
//     setIs3DView(false)
//     saveState()
//   }

//   const submitArtwork = async () => {
//     toast({
//       title: "Processing Artwork",
//       description: "Capturing final canvas states...",
//     })

//     try {
//       // Capture canvas states for both sides
//       const frontDesign = designs.find((d) => d.side === "front")
//       const backDesign = designs.find((d) => d.side === "back")

//       const canvasImages: { [key: string]: string } = {}

//       if (frontDesign) {
//         const frontImage = await captureCanvasState(frontDesign)
//         if (frontImage) {
//           canvasImages.front = frontImage
//         }
//       }

//       if (backDesign) {
//         const backImage = await captureCanvasState(backDesign)
//         if (backImage) {
//           canvasImages.back = backImage
//         }
//       }

//       // Save canvas images to localStorage
//       localStorage.setItem("artworkCanvasImages", JSON.stringify(canvasImages))

//       const artworkData = {
//         designs: designs.map((d) => ({
//           id: d.id,
//           side: d.side,
//           fileName: d.file.name,
//           thumbnail: d.thumbnail,
//         })),
//         canvasSize: canvasDimensions,
//         transform,
//       }

//       sessionStorage.setItem("artworkPreview", JSON.stringify(artworkData))

//       toast({
//         title: "Artwork Captured",
//         description: "Canvas states saved successfully!",
//       })

//       router.push("/artwork-preview")
//     } catch (error) {
//       console.error("Error capturing artwork:", error)
//       toast({
//         title: "Error",
//         description: "Failed to capture artwork. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const toolbarSections = [
//     {
//       title: "Transform",
//       tools: [
//         {
//           name: "Flip Horizontal",
//           icon: FlipHorizontal,
//           action: () => flipArtwork("X"),
//           tooltip: "Flip artwork horizontally",
//         },
//         {
//           name: "Flip Vertical",
//           icon: FlipVertical,
//           action: () => flipArtwork("Y"),
//           tooltip: "Flip artwork vertically",
//         },
//         {
//           name: "Rotate Left",
//           icon: RotateCcw,
//           action: () => rotateArtwork(-90),
//           tooltip: "Rotate 90° counter-clockwise",
//         },
//         {
//           name: "Rotate Right",
//           icon: RotateCw,
//           action: () => rotateArtwork(90),
//           tooltip: "Rotate 90° clockwise",
//         },
//       ],
//     },
//     {
//       title: "Scale",
//       tools: [
//         {
//           name: "Scale Up",
//           icon: ZoomIn,
//           action: () => scaleArtwork(1.1),
//           tooltip: "Increase size by 10%",
//         },
//         {
//           name: "Scale Down",
//           icon: ZoomOut,
//           action: () => scaleArtwork(0.9),
//           tooltip: "Decrease size by 10%",
//         },
//         {
//           name: "Fit to Template",
//           icon: Maximize,
//           action: fitToTemplate,
//           tooltip: "Fit artwork to template with bleed",
//         },
//       ],
//     },
//     {
//       title: "Position",
//       tools: [
//         {
//           name: "Nudge Up",
//           icon: ArrowUp,
//           action: () => nudgeArtwork("up"),
//           tooltip: "Move artwork up",
//         },
//         {
//           name: "Nudge Down",
//           icon: ArrowDown,
//           action: () => nudgeArtwork("down"),
//           tooltip: "Move artwork down",
//         },
//         {
//           name: "Nudge Left",
//           icon: ArrowLeft,
//           action: () => nudgeArtwork("left"),
//           tooltip: "Move artwork left",
//         },
//         {
//           name: "Nudge Right",
//           icon: ArrowRight,
//           action: () => nudgeArtwork("right"),
//           tooltip: "Move artwork right",
//         },
//       ],
//     },
//     {
//       title: "View",
//       tools: [
//         {
//           name: "Pan Mode",
//           icon: Move,
//           action: () => setIsPanMode(!isPanMode),
//           active: isPanMode,
//           tooltip: "Enable pan mode for canvas navigation",
//         },
//         {
//           name: "3D View",
//           icon: Box,
//           action: () => setIs3DView(!is3DView),
//           active: is3DView,
//           tooltip: "Toggle 3D preview of both sides",
//         },
//         {
//           name: "Magnifier",
//           icon: Search,
//           action: () => setIsMagnifierMode(!isMagnifierMode),
//           active: isMagnifierMode,
//           tooltip: "Enable magnifier tool",
//         },
//       ],
//     },
//     {
//       title: "Guidelines",
//       tools: [
//         {
//           name: "Toggle Guidelines",
//           icon: Grid3X3,
//           action: () => setShowGuidelines(!showGuidelines),
//           active: showGuidelines,
//           tooltip: "Show/hide bleed and safe area guidelines",
//         },
//         {
//           name: "Toggle Cut Lines",
//           icon: Scissors,
//           action: () => setShowCutLines(!showCutLines),
//           active: showCutLines,
//           tooltip: "Show/hide cut lines",
//         },
//       ],
//     },
//     {
//       title: "History",
//       tools: [
//         {
//           name: "Undo",
//           icon: Undo,
//           action: undo,
//           disabled: historyIndex <= 0,
//           tooltip: "Undo last action",
//         },
//         {
//           name: "Redo",
//           icon: Redo,
//           action: redo,
//           disabled: historyIndex >= history.length - 1,
//           tooltip: "Redo last undone action",
//         },
//         {
//           name: "Reset View",
//           icon: Reset,
//           action: resetView,
//           tooltip: "Reset all transformations",
//         },
//       ],
//     },
//   ]

//   const frontDesign = designs.find((d) => d.side === "front")
//   const backDesign = designs.find((d) => d.side === "back")

//   return (
//     <TooltipProvider>
//       <div className="flex h-full bg-gray-100">
//         {/* Left Sidebar for File Management */}
//         <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold">Uploaded Files</h3>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {designs.map((design) => (
//               <DesignThumbnail
//                 key={design.id}
//                 design={design}
//                 isActive={design.id === currentDesign.id}
//                 onSelect={() => onDesignChange(design)}
//                 onDelete={() => replaceDesign(design.id)}
//               />
//             ))}
//             {designs.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <FileIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                 <p className="text-sm">No files uploaded yet</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Editor Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Hidden image for loading */}
//           {imageUrl && (
//             <img
//               ref={imageRef}
//               src={imageUrl || "/placeholder.svg"}
//               alt="Artwork"
//               className="hidden"
//               onLoad={() => {
//                 const canvas = canvasRef.current
//                 if (canvas) {
//                   const ctx = canvas.getContext("2d")
//                   if (ctx) {
//                     drawCanvas(ctx)
//                   }
//                 }
//               }}
//             />
//           )}

//           {/* Enhanced Toolbar */}
//           <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onBack}
//                 className="text-sm hover:scale-105 transition-transform bg-transparent"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
//               </Button>

//               {/* Front/Back Toggle */}
//               <Tabs
//                 value={activeSide}
//                 onValueChange={(value) => {
//                   const side = value as "front" | "back"
//                   setActiveSide(side)
//                   // Switch to the design for the selected side
//                   const targetDesign = designs.find((d) => d.side === side)
//                   if (targetDesign) {
//                     onDesignChange(targetDesign)
//                   }
//                 }}
//               >
//                 <TabsList>
//                   <TabsTrigger value="front" disabled={!frontDesign}>
//                     Front
//                   </TabsTrigger>
//                   <TabsTrigger value="back" disabled={!backDesign}>
//                     Back
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>

//               {/* Canvas Size Display */}
//               <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
//                 {canvasDimensions.actualWidth}" × {canvasDimensions.actualHeight}" ({canvasDimensions.unit}) -{" "}
//                 {canvasDimensions.width}×{canvasDimensions.height}px
//               </div>
//             </div>

//             {/* Toolbar Sections */}
//             <div className="flex flex-wrap gap-6">
//               {toolbarSections.map((section) => (
//                 <div key={section.title} className="flex flex-col gap-2">
//                   <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{section.title}</span>
//                   <div className="flex gap-1">
//                     {section.tools.map((tool) => (
//                       <Tooltip key={tool.name}>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={tool.action}
//                             disabled={"disabled" in tool ? tool.disabled : false}
//                             className={cn(
//                               "h-9 w-9 hover:scale-105 transition-all duration-200",
//                               ("active" in tool ? tool.active : false) &&
//                                 "bg-[#00AAB2] text-white hover:bg-[#00AAB2]/90",
//                             )}
//                           >
//                             <tool.icon className="w-4 h-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{tool.tooltip}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {/* Mask Controls */}
//               <div className="flex flex-col gap-2">
//                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mask</span>
//                 <div className="flex items-center gap-2">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className={cn("h-9 w-9", maskMode === "wireframe" && "bg-[#00AAB2] text-white")}
//                         onClick={() => setMaskMode(maskMode === "solid" ? "wireframe" : "solid")}
//                       >
//                         <Layers className="w-4 h-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Toggle mask mode (solid/wireframe)</p>
//                     </TooltipContent>
//                   </Tooltip>
//                   <div className="w-20">
//                     <Slider value={maskOpacity} onValueChange={setMaskOpacity} max={100} step={1} className="w-full" />
//                   </div>
//                   <span className="text-xs text-gray-500 w-8">{maskOpacity[0]}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Canvas Area */}
//           <div className="flex-1 relative overflow-auto p-8">
//             <div className="w-full h-full flex flex-col items-center justify-center">
//               {!is3DView ? (
//                 <canvas
//                   ref={canvasRef}
//                   className="border border-gray-300 rounded-lg shadow-lg bg-white"
//                   style={{
//                     cursor: isPanMode ? "grab" : isMagnifierMode ? "none" : "default",
//                     maxWidth: "100%",
//                     maxHeight: "100%",
//                   }}
//                   onMouseMove={handleCanvasMouseMove}
//                   onMouseLeave={handleCanvasMouseLeave}
//                 />
//               ) : (
//                 <div
//                   ref={threeDRef}
//                   className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden"
//                   onMouseMove={handle3DMouseMove}
//                   onMouseEnter={() => setIsMouseOver3D(true)}
//                   onMouseLeave={() => setIsMouseOver3D(false)}
//                 >
//                   <div
//                     className="relative transform-gpu transition-transform duration-300 ease-out"
//                     style={{
//                       transform: `perspective(1200px) rotateY(${
//                         isMouseOver3D ? (mousePosition.x - 0.5) * 40 - 20 : -20
//                       }deg) rotateX(${isMouseOver3D ? (mousePosition.y - 0.5) * -20 + 8 : 8}deg)`,
//                       transformStyle: "preserve-3d",
//                     }}
//                   >
//                     {/* Front side */}
//                     <div
//                       className="w-96 h-60 bg-white rounded-xl shadow-2xl border-2 border-gray-200 relative overflow-hidden"
//                       style={{
//                         transformStyle: "preserve-3d",
//                         backfaceVisibility: "hidden",
//                       }}
//                     >
//                       {frontDesign?.thumbnail && (
//                         <Image
//                           src={frontDesign.thumbnail || "/placeholder.svg"}
//                           alt="Front design"
//                           fill
//                           className="object-cover rounded-xl"
//                           style={{
//                             transform: `scale(${transform.scale}) rotate(${
//                               transform.rotation
//                             }deg) ${transform.flipX ? "scaleX(-1)" : ""} ${transform.flipY ? "scaleY(-1)" : ""}`,
//                           }}
//                         />
//                       )}
//                       <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
//                         Front
//                       </div>
//                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 rounded-xl"></div>
//                     </div>

//                     {/* Back side */}
//                     {backDesign && (
//                       <div
//                         className="w-96 h-60 bg-white rounded-xl shadow-2xl border-2 border-gray-200 absolute top-0 overflow-hidden"
//                         style={{
//                           transform: "translateX(15px) translateZ(-8px) rotateY(180deg)",
//                           transformStyle: "preserve-3d",
//                           backfaceVisibility: "hidden",
//                         }}
//                       >
//                         {backDesign.thumbnail && (
//                           <Image
//                             src={backDesign.thumbnail || "/placeholder.svg"}
//                             alt="Back design"
//                             fill
//                             className="object-cover rounded-xl scale-x-[-1]"
//                             style={{
//                               transform: `scale(${transform.scale}) rotate(${transform.rotation}deg) ${
//                                 transform.flipX ? "scaleX(1)" : "scaleX(-1)"
//                               } ${transform.flipY ? "scaleY(-1)" : ""}`,
//                             }}
//                           />
//                         )}
//                         <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium scale-x-[-1]">
//                           Back
//                         </div>
//                         <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-white/20 rounded-xl"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Magnifier with improved positioning */}
//               {isMagnifierMode && showMagnifier && imageUrl && !is3DView && (
//                 <div
//                   ref={magnifierRef}
//                   className="absolute pointer-events-none border-4 border-white rounded-full shadow-2xl overflow-hidden z-50"
//                   style={{
//                     left: magnifierPosition.x - 100,
//                     top: magnifierPosition.y - 100,
//                     width: 200,
//                     height: 200,
//                     backgroundImage: `url(${imageUrl})`,
//                     backgroundSize: `${canvasDimensions.width * 3}px ${canvasDimensions.height * 3}px`,
//                     backgroundPosition: `-${(magnifierPosition.x - 100) * 3}px -${(magnifierPosition.y - 100) * 3}px`,
//                     backgroundRepeat: "no-repeat",
//                   }}
//                 >
//                   <div className="absolute inset-0 border-2 border-gray-400 rounded-full"></div>
//                   <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
//                   <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
//                 </div>
//               )}

//               {/* Guidelines Text */}
//               <div className="mt-4 text-center text-sm">
//                 <p>
//                   <span className="text-blue-600 font-semibold">blue line</span> - text safe area{" "}
//                   <span className="text-red-600 font-semibold">red line</span> - cut line{" "}
//                   <span className="text-black font-semibold">black line</span> - bleed line
//                 </p>
//                 {bleedWarning && (
//                   <p className="text-orange-600 font-semibold mt-2">
//                     The artwork does not extend all the way to the black bleed line. To ensure complete print coverage
//                     on the final product, adjust the work to touch or extend past the bleed line on all sides.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex justify-end">
//             <Button
//               onClick={submitArtwork}
//               className="bg-[#00AAB2] hover:bg-[#00AAB2]/90 text-white px-8 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-200"
//             >
//               Submit Artwork
//             </Button>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }

// function DesignThumbnail({
//   design,
//   isActive,
//   onSelect,
//   onDelete,
// }: {
//   design: DesignFile
//   isActive: boolean
//   onSelect: () => void
//   onDelete: () => void
// }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
//         isActive ? "border-[#00AAB2] bg-[#00AAB2]/5" : "border-gray-200 hover:bg-gray-50",
//       )}
//       onClick={onSelect}
//     >
//       <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
//         {design.thumbnail ? (
//           <Image
//             src={design.thumbnail || "/placeholder.svg"}
//             alt="Thumbnail"
//             width={48}
//             height={48}
//             className="w-full h-full object-cover rounded"
//           />
//         ) : (
//           <FileIcon className="w-6 h-6 text-gray-400" />
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">{design.file.name}</p>
//         <p className="text-xs text-gray-500 capitalize">{design.side} Side</p>
//       </div>
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={(e) => {
//           e.stopPropagation()
//           onDelete()
//         }}
//         className="text-[#00AAB2] hover:text-[#00AAB2] hover:bg-[#00AAB2]/10 border-[#00AAB2]"
//       >
//         Replace
//       </Button>
//     </div>
//   )
// }






// with 3d 



"use client"
import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Search,
  Grid3X3,
  Scissors,
  Layers,
  Undo,
  Redo,
  TimerResetIcon as Reset,
  Box,
  FileIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePdfThumbnail } from "./use-pdf-thumbnail"
import { renderPdfPageToDataUrl } from "./pdf-utils"

const DEFAULT_CANVAS_SIZE = { width: 3.5, height: 2, unit: "inches" } as const

interface DesignFile {
  id: string
  file: File
  side: "front" | "back"
  thumbnail?: string
}

interface CanvasEditorProps {
  designs: DesignFile[]
  activeDesign: DesignFile
  onDesignChange: (design: DesignFile) => void
  onBack: () => void
  canvasSize?: { width: number; height: number; unit: string }
  bleed?: number // in inches
}

export function CanvasEditor({
  designs: initialDesigns,
  activeDesign,
  onDesignChange,
  onBack,
  canvasSize = DEFAULT_CANVAS_SIZE,
  bleed = 0.0625,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const magnifierRef = useRef<HTMLDivElement>(null)
  const threeDRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [designs, setDesigns] = useState<DesignFile[]>(initialDesigns)
  const [showGuidelines, setShowGuidelines] = useState(true)
  const [showCutLines, setShowCutLines] = useState(true)
  const [maskOpacity, setMaskOpacity] = useState([0])
  const [maskMode, setMaskMode] = useState<"solid" | "wireframe">("solid")
  const [is3DView, setIs3DView] = useState(false)
  const [isPanMode, setIsPanMode] = useState(false)
  const [isMagnifierMode, setIsMagnifierMode] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [bleedWarning, setBleedWarning] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [activeSide, setActiveSide] = useState<"front" | "back">("front")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseOver3D, setIsMouseOver3D] = useState(false)

  // 3D Controls state
  const [threeDControls, setThreeDControls] = useState({ x: 0, y: 0 })
  const [canvas3DImages, setCanvas3DImages] = useState<{ front?: string; back?: string }>({})

  // Pan mode state
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })

  // Dynamic canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
    actualWidth: canvasSize.width,
    actualHeight: canvasSize.height,
    unit: canvasSize.unit,
    dpi: 300,
  })

  // Calculate canvas dimensions based on custom size
  useEffect(() => {
    const ppi = 300 // Standard print resolution
    const widthInPixels = Math.round(canvasSize.width * ppi)
    const heightInPixels = Math.round(canvasSize.height * ppi)
    const bleedInPixels = Math.round(bleed * ppi)

    console.log(`Canvas size calculation:`, {
      input: `${canvasSize.width}" × ${canvasSize.height}"`,
      output: `${widthInPixels}px × ${heightInPixels}px`,
      bleed: `${bleedInPixels}px`,
      ppi,
    })

    setCanvasDimensions((prev) => ({
      ...prev,
      width: widthInPixels, // NO bleed added
      height: heightInPixels, // NO bleed added
      actualWidth: canvasSize.width,
      actualHeight: canvasSize.height,
      unit: canvasSize.unit,
      dpi: ppi,
    }))
  }, [canvasSize.width, canvasSize.height, canvasSize.unit, bleed])

  const [transform, setTransform] = useState({
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
  })

  const [history, setHistory] = useState<(typeof transform)[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const { toast } = useToast()
  const generatePdfThumbnail = usePdfThumbnail()

  // Get current side design
  const currentDesign = designs.find((d) => d.id === activeDesign.id) || activeDesign

  // Update active side when design changes
  useEffect(() => {
    if (currentDesign) {
      setActiveSide(currentDesign.side)
    }
  }, [activeDesign.id])

  const loadDesign = useCallback(
    async (design: DesignFile) => {
      if (design.file.type === "application/pdf") {
        try {
          const dataUrl = await renderPdfPageToDataUrl(design.file, 2)
          setImageUrl(dataUrl)
        } catch (error) {
          console.error("Error loading PDF:", error)
          toast({
            title: "PDF Loading Error",
            description: "Failed to load PDF. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        const url = URL.createObjectURL(design.file)
        setImageUrl(url)
        return () => URL.revokeObjectURL(url)
      }
    },
    [toast],
  )

  useEffect(() => {
    if (currentDesign) {
      loadDesign(currentDesign)
    }
  }, [currentDesign, loadDesign])

  // Real-time canvas drawing
  const drawCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const canvas = ctx.canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Checkered transparency background
      const checkSize = 10
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#f0f0f0"
      for (let x = 0; x < canvas.width; x += checkSize * 2) {
        for (let y = 0; y < canvas.height; y += checkSize * 2) {
          ctx.fillRect(x, y, checkSize, checkSize)
          ctx.fillRect(x + checkSize, y + checkSize, checkSize, checkSize)
        }
      }

      // Draw image if loaded
      if (imageRef.current && imageRef.current.complete) {
        drawImage(ctx)
      }

      // Draw guidelines
      if (showGuidelines || showCutLines) {
        drawGuidelines(ctx)
      }

      // Draw mask overlay
      if (maskOpacity[0] > 0) {
        drawMask(ctx)
      }

      // Check bleed coverage
      checkBleedCoverage()
    },
    [transform, showGuidelines, showCutLines, imageUrl, maskOpacity, maskMode],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = canvasDimensions.width
        canvas.height = canvasDimensions.height
        drawCanvas(ctx)
      }
    }
    if (history.length === 0) {
      setHistory([transform])
      setHistoryIndex(0)
    }
  }, [transform, showGuidelines, showCutLines, imageUrl, maskOpacity, maskMode, canvasDimensions, drawCanvas])

  const drawGuidelines = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas
    const ppi = canvasDimensions.dpi // Use the actual DPI from canvas dimensions
    const bleedPx = bleed * ppi
    const safePx = 0.0625 * ppi // 1/8 inch safe margin
    const lineWidth = 2 // or whatever you use

    // Calculate the actual finished size in pixels (without bleed)
    const finishedWidthPx = canvasSize.width * ppi
    const finishedHeightPx = canvasSize.height * ppi

    // Position guidelines based on bleed offset - this ensures they align with design template
    // The canvas is expanded by bleed on all sides, so guidelines start at bleed offset
    const finishedRect = {
      x: bleedPx,
      y: bleedPx,
      w: finishedWidthPx,
      h: finishedHeightPx,
    }

    // Bleed line (black) - at canvas edge, but inset by half line width
    const bleedRect = {
      x: lineWidth / 2,
      y: lineWidth / 2,
      w: canvas.width - lineWidth,
      h: canvas.height - lineWidth,
    }

    // Red line (cut) - inset by bleedPx, plus half line width
    const cutRect = {
      x: bleedPx + lineWidth / 2,
      y: bleedPx + lineWidth / 2,
      w: canvas.width - 2 * bleedPx - lineWidth,
      h: canvas.height - 2 * bleedPx - lineWidth,
    }

    // Blue line (safe) - inset by safePx from cut line, plus half line width
    const safeRect = {
      x: cutRect.x + safePx + lineWidth / 2,
      y: cutRect.y + safePx + lineWidth / 2,
      w: cutRect.w - 2 * safePx - lineWidth,
      h: cutRect.h - 2 * safePx - lineWidth,
    }

    ctx.save()

    // Bleed line (black) - outermost, at canvas edges
    if (showGuidelines) {
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.strokeRect(bleedRect.x, bleedRect.y, bleedRect.w, bleedRect.h)
    }

    // Cut line (red) - finished size, offset by bleed amount
    if (showCutLines) {
      ctx.strokeStyle = "#ff0000"
      ctx.lineWidth = 2
      ctx.setLineDash([])
      ctx.strokeRect(cutRect.x, cutRect.y, cutRect.w, cutRect.h)
    }

    // Safe line (blue) - safe area
    if (showGuidelines) {
      ctx.strokeStyle = "#0066cc"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.strokeRect(safeRect.x, safeRect.y, safeRect.w, safeRect.h)
    }

    ctx.restore()
  }

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas
    const img = imageRef.current!
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    ctx.save()
    ctx.translate(centerX + transform.x, centerY + transform.y)
    ctx.rotate((transform.rotation * Math.PI) / 180)
    ctx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale * (transform.flipY ? -1 : 1))

    // Use original image dimensions
    const imgWidth = img.width
    const imgHeight = img.height
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
    ctx.restore()
  }

  const drawMask = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas
    const opacity = maskOpacity[0] / 100

    ctx.save()
    ctx.globalAlpha = opacity
    if (maskMode === "solid") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }
    ctx.restore()
  }

  const generateCanvasDataURL = useCallback(
    async (side: "front" | "back"): Promise<string | null> => {
      const design = designs.find((d) => d.side === side)
      if (!design) return null

      return new Promise((resolve) => {
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        if (!tempCtx) {
          resolve(null)
          return
        }

        tempCanvas.width = canvasDimensions.width
        tempCanvas.height = canvasDimensions.height

        const img = new window.Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          // Clear canvas with white background
          tempCtx.fillStyle = "#ffffff"
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

          // Draw the image with current transform
          const centerX = tempCanvas.width / 2
          const centerY = tempCanvas.height / 2

          tempCtx.save()
          tempCtx.translate(centerX + transform.x, centerY + transform.y)
          tempCtx.rotate((transform.rotation * Math.PI) / 180)
          tempCtx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale * (transform.flipY ? -1 : 1))

          const imgWidth = img.width
          const imgHeight = img.height
          tempCtx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
          tempCtx.restore()

          // Draw guidelines
          drawGuidelinesOnCanvas(tempCtx)

          const dataUrl = tempCanvas.toDataURL("image/png")
          resolve(dataUrl)
        }

        img.onerror = () => resolve(null)

        if (design.file.type === "application/pdf") {
          renderPdfPageToDataUrl(design.file, 2)
            .then((dataUrl) => {
              img.src = dataUrl
            })
            .catch(() => resolve(null))
        } else {
          img.src = URL.createObjectURL(design.file)
        }
      })
    },
    [designs, canvasDimensions, transform],
  )

  const drawGuidelinesOnCanvas = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas
    const ppi = canvasDimensions.dpi
    const bleedPx = bleed * ppi
    const safePx = 0.0625 * ppi
    const lineWidth = 2

    ctx.save()

    // Bleed line (black)
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.setLineDash([8, 8])
    ctx.strokeRect(lineWidth / 2, lineWidth / 2, canvas.width - lineWidth, canvas.height - lineWidth)

    // Cut line (red)
    ctx.strokeStyle = "#ff0000"
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.strokeRect(
      bleedPx + lineWidth / 2,
      bleedPx + lineWidth / 2,
      canvas.width - 2 * bleedPx - lineWidth,
      canvas.height - 2 * bleedPx - lineWidth,
    )

    // Safe line (blue)
    ctx.strokeStyle = "#0066cc"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    const safeX = bleedPx + safePx + lineWidth / 2
    const safeY = bleedPx + safePx + lineWidth / 2
    const safeW = canvas.width - 2 * bleedPx - 2 * safePx - lineWidth
    const safeH = canvas.height - 2 * bleedPx - 2 * safePx - lineWidth
    ctx.strokeRect(safeX, safeY, safeW, safeH)

    ctx.restore()
  }

  const update3DImages = useCallback(async () => {
    try {
      const frontImage = await generateCanvasDataURL("front")
      const backImage = await generateCanvasDataURL("back")
      setCanvas3DImages({
        front: frontImage ?? undefined,
        back: backImage ?? undefined,
      })
    } catch (error) {
      console.error("Error updating 3D images:", error)
    }
  }, [generateCanvasDataURL])

  useEffect(() => {
    if (is3DView) {
      update3DImages()
    }
  }, [is3DView, transform, currentDesign, update3DImages])

  // Update 3D images when in 3D view

  const checkBleedCoverage = () => {
    const hasBleedCoverage = transform.scale >= 1.1
    setBleedWarning(!hasBleedCoverage)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMagnifierMode) {
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMagnifierPosition({ x, y })
      setShowMagnifier(true)
    }
  }

  const handleCanvasMouseLeave = () => {
    if (isMagnifierMode) {
      setShowMagnifier(false)
    }
  }

  // 3D mouse tracking
  const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!threeDRef.current) return
    const rect = threeDRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  const saveState = () => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ ...transform })
    if (newHistory.length > 20) {
      newHistory.shift()
    } else {
      setHistoryIndex((prev) => prev + 1)
    }
    setHistory(newHistory)
  }

  // Function to capture canvas state as image
  const captureCanvasState = async (design: DesignFile): Promise<string | null> => {
    return new Promise((resolve) => {
      // Create a temporary canvas
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) {
        resolve(null)
        return
      }

      tempCanvas.width = canvasDimensions.width
      tempCanvas.height = canvasDimensions.height

      // Load the design image
      const img = new window.Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        // Clear canvas with white background
        tempCtx.fillStyle = "#ffffff"
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

        // Draw the image with current transform
        const centerX = tempCanvas.width / 2
        const centerY = tempCanvas.height / 2

        tempCtx.save()
        tempCtx.translate(centerX + transform.x, centerY + transform.y)
        tempCtx.rotate((transform.rotation * Math.PI) / 180)
        tempCtx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale * (transform.flipY ? -1 : 1))

        const imgWidth = img.width
        const imgHeight = img.height
        tempCtx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
        tempCtx.restore()

        // Convert to data URL
        const dataUrl = tempCanvas.toDataURL("image/png")
        resolve(dataUrl)
      }

      img.onerror = () => {
        resolve(null)
      }

      // Set image source
      if (design.file.type === "application/pdf") {
        renderPdfPageToDataUrl(design.file, 2)
          .then((dataUrl) => {
            img.src = dataUrl
          })
          .catch(() => {
            resolve(null)
          })
      } else {
        img.src = URL.createObjectURL(design.file)
      }
    })
  }

  // Real-time file operations
  const replaceDesign = async (id: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,.pdf"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const designToReplace = designs.find((d) => d.id === id)
        if (!designToReplace) return

        let thumbnail = ""
        if (file.type.startsWith("image/")) {
          thumbnail = URL.createObjectURL(file)
        } else if (file.type === "application/pdf") {
          thumbnail = await generatePdfThumbnail(file)
        }

        // Clean up old thumbnail
        if (designToReplace.thumbnail) {
          URL.revokeObjectURL(designToReplace.thumbnail)
        }

        const newDesign: DesignFile = {
          id: designToReplace.id,
          file,
          side: designToReplace.side, // Keep the same side
          thumbnail,
        }

        setDesigns((prev) => prev.map((d) => (d.id === id ? newDesign : d)))

        // Update active design if this was the active one
        if (activeDesign.id === id) {
          onDesignChange(newDesign)
        }

        toast({
          title: "File Replaced",
          description: `${file.name} has been uploaded for ${designToReplace.side} side.`,
        })
      }
    }
    input.click()
  }

  const flipArtwork = (axis: "X" | "Y") => {
    setTransform((prev) => ({
      ...prev,
      [`flip${axis}`]: !prev[`flip${axis}` as keyof typeof prev],
    }))
    saveState()
  }

  const rotateArtwork = (degrees: number) => {
    setTransform((prev) => ({
      ...prev,
      rotation: prev.rotation + degrees,
    }))
    saveState()
  }

  const scaleArtwork = (factor: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale * factor)),
    }))
    saveState()
  }

  const fitToTemplate = () => {
    setTransform((prev) => ({
      ...prev,
      scale: 1.2,
      x: 0,
      y: 0,
      rotation: 0,
    }))
    saveState()
  }

  const nudgeArtwork = (direction: "up" | "down" | "left" | "right") => {
    // Calculate nudge amount based on canvas size (1% of the smaller dimension)
    const nudgeAmount = Math.max(5, Math.min(canvasDimensions.width, canvasDimensions.height) * 0.01)
    setTransform((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, y: prev.y - nudgeAmount }
        case "down":
          return { ...prev, y: prev.y + nudgeAmount }
        case "left":
          return { ...prev, x: prev.x - nudgeAmount }
        case "right":
          return { ...prev, x: prev.x + nudgeAmount }
        default:
          return prev
      }
    })
    saveState()
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setTransform(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setTransform(history[historyIndex + 1])
    }
  }

  const resetView = () => {
    const initialTransform = {
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
    }
    setTransform(initialTransform)
    setIs3DView(false)
    setThreeDControls({ x: 0, y: 0 })
    setCanvasOffset({ x: 0, y: 0 })
    saveState()
  }

  const submitArtwork = async () => {
    toast({
      title: "Processing Artwork",
      description: "Capturing final canvas states...",
    })

    try {
      // Capture canvas states for both sides
      const frontDesign = designs.find((d) => d.side === "front")
      const backDesign = designs.find((d) => d.side === "back")

      const canvasImages: { [key: string]: string } = {}

      if (frontDesign) {
        const frontImage = await captureCanvasState(frontDesign)
        if (frontImage) {
          canvasImages.front = frontImage
        }
      }

      if (backDesign) {
        const backImage = await captureCanvasState(backDesign)
        if (backImage) {
          canvasImages.back = backImage
        }
      }

      // Save canvas images to localStorage
      localStorage.setItem("artworkCanvasImages", JSON.stringify(canvasImages))

      const artworkData = {
        designs: designs.map((d) => ({
          id: d.id,
          side: d.side,
          fileName: d.file.name,
          thumbnail: d.thumbnail,
        })),
        canvasSize: canvasDimensions,
        transform,
      }

      sessionStorage.setItem("artworkPreview", JSON.stringify(artworkData))

      toast({
        title: "Artwork Captured",
        description: "Canvas states saved successfully!",
      })

      router.push("/artwork-preview")
    } catch (error) {
      console.error("Error capturing artwork:", error)
      toast({
        title: "Error",
        description: "Failed to capture artwork. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toolbarSections = [
    {
      title: "Transform",
      tools: [
        {
          name: "Flip Horizontal",
          icon: FlipHorizontal,
          action: () => flipArtwork("X"),
          tooltip: "Flip artwork horizontally",
        },
        {
          name: "Flip Vertical",
          icon: FlipVertical,
          action: () => flipArtwork("Y"),
          tooltip: "Flip artwork vertically",
        },
        {
          name: "Rotate Left",
          icon: RotateCcw,
          action: () => rotateArtwork(-90),
          tooltip: "Rotate 90° counter-clockwise",
        },
        {
          name: "Rotate Right",
          icon: RotateCw,
          action: () => rotateArtwork(90),
          tooltip: "Rotate 90° clockwise",
        },
      ],
    },
    {
      title: "Scale",
      tools: [
        {
          name: "Scale Up",
          icon: ZoomIn,
          action: () => scaleArtwork(1.1),
          tooltip: "Increase size by 10%",
        },
        {
          name: "Scale Down",
          icon: ZoomOut,
          action: () => scaleArtwork(0.9),
          tooltip: "Decrease size by 10%",
        },
        {
          name: "Fit to Template",
          icon: Maximize,
          action: fitToTemplate,
          tooltip: "Fit artwork to template with bleed",
        },
      ],
    },
    {
      title: "Position",
      tools: [
        {
          name: "Nudge Up",
          icon: ArrowUp,
          action: () => nudgeArtwork("up"),
          tooltip: "Move artwork up",
        },
        {
          name: "Nudge Down",
          icon: ArrowDown,
          action: () => nudgeArtwork("down"),
          tooltip: "Move artwork down",
        },
        {
          name: "Nudge Left",
          icon: ArrowLeft,
          action: () => nudgeArtwork("left"),
          tooltip: "Move artwork left",
        },
        {
          name: "Nudge Right",
          icon: ArrowRight,
          action: () => nudgeArtwork("right"),
          tooltip: "Move artwork right",
        },
      ],
    },
    {
      title: "View",
      tools: [
        {
          name: "Pan Mode",
          icon: Move,
          action: () => setIsPanMode(!isPanMode),
          active: isPanMode,
          tooltip: "Enable pan mode for canvas navigation",
        },
        {
          name: "3D View",
          icon: Box,
          action: () => setIs3DView(!is3DView),
          active: is3DView,
          tooltip: "Toggle 3D preview of both sides",
        },
        {
          name: "Magnifier",
          icon: Search,
          action: () => setIsMagnifierMode(!isMagnifierMode),
          active: isMagnifierMode,
          tooltip: "Enable magnifier tool",
        },
      ],
    },
    {
      title: "Guidelines",
      tools: [
        {
          name: "Toggle Guidelines",
          icon: Grid3X3,
          action: () => setShowGuidelines(!showGuidelines),
          active: showGuidelines,
          tooltip: "Show/hide bleed and safe area guidelines",
        },
        {
          name: "Toggle Cut Lines",
          icon: Scissors,
          action: () => setShowCutLines(!showCutLines),
          active: showCutLines,
          tooltip: "Show/hide cut lines",
        },
      ],
    },
    {
      title: "History",
      tools: [
        {
          name: "Undo",
          icon: Undo,
          action: undo,
          disabled: historyIndex <= 0,
          tooltip: "Undo last action",
        },
        {
          name: "Redo",
          icon: Redo,
          action: redo,
          disabled: historyIndex >= history.length - 1,
          tooltip: "Redo last undone action",
        },
        {
          name: "Reset View",
          icon: Reset,
          action: resetView,
          tooltip: "Reset all transformations",
        },
      ],
    },
  ]

  const frontDesign = designs.find((d) => d.side === "front")
  const backDesign = designs.find((d) => d.side === "back")

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanMode) {
      setPanStart({ x: e.clientX, y: e.clientY })
      setIsPanning(true)
    }
  }

  const handleCanvasMouseMoveWithPan = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      setCanvasOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-full bg-gray-100">
        {/* Left Sidebar for File Management */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Uploaded Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {designs.map((design) => (
              <DesignThumbnail
                key={design.id}
                design={design}
                isActive={design.id === currentDesign.id}
                onSelect={() => onDesignChange(design)}
                onDelete={() => replaceDesign(design.id)}
              />
            ))}
            {designs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Hidden image for loading */}
          {imageUrl && (
            <img
              ref={imageRef}
              src={imageUrl || "/placeholder.svg"}
              alt="Artwork"
              className="hidden"
              onLoad={() => {
                const canvas = canvasRef.current
                if (canvas) {
                  const ctx = canvas.getContext("2d")
                  if (ctx) {
                    drawCanvas(ctx)
                  }
                }
              }}
            />
          )}

          {/* Enhanced Toolbar */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="text-sm hover:scale-105 transition-transform bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
              </Button>

              {/* Front/Back Toggle */}
              <Tabs
                value={activeSide}
                onValueChange={(value) => {
                  const side = value as "front" | "back"
                  setActiveSide(side)
                  // Switch to the design for the selected side
                  const targetDesign = designs.find((d) => d.side === side)
                  if (targetDesign) {
                    onDesignChange(targetDesign)
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="front" disabled={!frontDesign}>
                    Front
                  </TabsTrigger>
                  <TabsTrigger value="back" disabled={!backDesign}>
                    Back
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Canvas Size Display */}
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                {canvasDimensions.actualWidth}" × {canvasDimensions.actualHeight}" ({canvasDimensions.unit}) -{" "}
                {canvasDimensions.width}×{canvasDimensions.height}px
              </div>
            </div>

            {/* Toolbar Sections */}
            <div className="flex flex-wrap gap-6">
              {toolbarSections.map((section) => (
                <div key={section.title} className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{section.title}</span>
                  <div className="flex gap-1">
                    {section.tools.map((tool) => (
                      <Tooltip key={tool.name}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={tool.action}
                            disabled={"disabled" in tool ? tool.disabled : false}
                            className={cn(
                              "h-9 w-9 hover:scale-105 transition-all duration-200",
                              ("active" in tool ? tool.active : false) &&
                                "bg-[#00AAB2] text-white hover:bg-[#00AAB2]/90",
                            )}
                          >
                            <tool.icon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tool.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mask Controls */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mask</span>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-9 w-9", maskMode === "wireframe" && "bg-[#00AAB2] text-white")}
                        onClick={() => setMaskMode(maskMode === "solid" ? "wireframe" : "solid")}
                      >
                        <Layers className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle mask mode (solid/wireframe)</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="w-20">
                    <Slider value={maskOpacity} onValueChange={setMaskOpacity} max={100} step={1} className="w-full" />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{maskOpacity[0]}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative overflow-auto p-8">
            <div className="w-full h-full flex flex-col items-center justify-center">
              {!is3DView ? (
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 rounded-lg shadow-lg bg-white"
                  style={{
                    cursor: isPanMode ? (isPanning ? "grabbing" : "grab") : isMagnifierMode ? "none" : "default",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                  }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseLeave}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden relative"
                  style={{
                    perspective: "1200px",
                  }}
                >
                  <div
                    className="relative transform-gpu transition-transform duration-300 ease-out"
                    style={{
                      transform: `rotateX(${threeDControls.x}deg) rotateY(${threeDControls.y}deg)`,
                      transformStyle: "preserve-3d",
                      width: "400px",
                      height: "300px",
                    }}
                  >
                    {/* Front Face */}
                    <div
                      className="absolute inset-0 bg-white border-2 border-gray-300 shadow-lg"
                      style={{
                        transform: "translateZ(10px)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {canvas3DImages.front ? (
                        <img
                          src={canvas3DImages.front || "/placeholder.svg"}
                          alt="Front artwork with guidelines"
                          className="w-full h-full object-contain"
                        />
                      ) : frontDesign?.thumbnail ? (
                        <img
                          src={frontDesign.thumbnail || "/placeholder.svg"}
                          alt="Front artwork"
                          className="w-full h-full object-cover"
                          style={{
                            padding: `${(bleed || 0.125) * 300}px`,
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Front Design
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        Front
                      </div>
                    </div>

                    {/* Back Face */}
                    {backDesign && (
                      <div
                        className="absolute inset-0 bg-white border-2 border-gray-400 shadow-lg"
                        style={{
                          transform: "translateZ(-10px) rotateY(180deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {canvas3DImages.back ? (
                          <img
                            src={canvas3DImages.back || "/placeholder.svg"}
                            alt="Back artwork with guidelines"
                            className="w-full h-full object-contain"
                          />
                        ) : backDesign.thumbnail ? (
                          <img
                            src={backDesign.thumbnail || "/placeholder.svg"}
                            alt="Back artwork"
                            className="w-full h-full object-cover"
                            style={{
                              padding: `${(bleed || 0.125) * 300}px`,
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Back Design
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs">
                          Back
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3D Controls */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-[200px]">
                    <div className="text-xs font-medium text-gray-700 mb-3">3D Rotation Controls</div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">X:</span>
                          <span className="text-xs font-bold text-gray-900">{threeDControls.x}°</span>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={threeDControls.x}
                          onChange={(e) =>
                            setThreeDControls((prev) => ({ ...prev, x: Number.parseInt(e.target.value) }))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          title="Rotate X-axis"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Y:</span>
                          <span className="text-xs font-bold text-gray-900">{threeDControls.y}°</span>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={threeDControls.y}
                          onChange={(e) =>
                            setThreeDControls((prev) => ({ ...prev, y: Number.parseInt(e.target.value) }))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          title="Rotate Y-axis"
                        />
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setThreeDControls({ x: 0, y: 0 })}
                        className="w-full justify-center text-xs"
                        title="Reset 3D View"
                      >
                        <Reset className="w-3 h-3 mr-1" />
                        Reset View
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Magnifier with improved positioning */}
              {isMagnifierMode && showMagnifier && imageUrl && !is3DView && (
                <div
                  ref={magnifierRef}
                  className="absolute pointer-events-none border-4 border-white rounded-full shadow-2xl overflow-hidden z-50"
                  style={{
                    left: magnifierPosition.x - 100,
                    top: magnifierPosition.y - 100,
                    width: 200,
                    height: 200,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: `${canvasDimensions.width * 2}px ${canvasDimensions.height * 2}px`,
                    backgroundPosition: `-${(magnifierPosition.x - 100) * 2}px -${(magnifierPosition.y - 100) * 2}px`,
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute inset-0 border-2 border-gray-400 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    2x Zoom
                  </div>
                </div>
              )}

              {/* Guidelines Text */}
              <div className="mt-4 text-center text-sm">
                <p>
                  <span className="text-blue-600 font-semibold">blue line</span> - text safe area{" "}
                  <span className="text-red-600 font-semibold">red line</span> - cut line{" "}
                  <span className="text-black font-semibold">black line</span> - bleed line
                </p>
                {bleedWarning && (
                  <p className="text-orange-600 font-semibold mt-2">
                    The artwork does not extend all the way to the black bleed line. To ensure complete print coverage
                    on the final product, adjust the work to touch or extend past the bleed line on all sides.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex justify-end">
            <Button
              onClick={submitArtwork}
              className="bg-[#00AAB2] hover:bg-[#00AAB2]/90 text-white px-8 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-200"
            >
              Submit Artwork
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function DesignThumbnail({
  design,
  isActive,
  onSelect,
  onDelete,
}: {
  design: DesignFile
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
        isActive ? "border-[#00AAB2] bg-[#00AAB2]/5" : "border-gray-200 hover:bg-gray-50",
      )}
      onClick={onSelect}
    >
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
        {design.thumbnail ? (
          <Image
            src={design.thumbnail || "/placeholder.svg"}
            alt="Thumbnail"
            width={48}
            height={48}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <FileIcon className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{design.file.name}</p>
        <p className="text-xs text-gray-500 capitalize">{design.side} Side</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="text-[#00AAB2] hover:text-[#00AAB2] hover:bg-[#00AAB2]/10 border-[#00AAB2]"
      >
        Replace
      </Button>
    </div>
  )
}
