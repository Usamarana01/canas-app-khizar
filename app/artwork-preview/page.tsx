// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { ArrowLeft, Download, Share2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// interface ArtworkData {
//   designs: Array<{
//     id: string;
//     side: "front" | "back";
//     fileName: string;
//     thumbnail?: string;
//   }>;
//   canvasSize: {
//     width: number;
//     height: number;
//     actualWidth: number;
//     actualHeight: number;
//     unit: string;
//     dpi: number;
//   };
//   transform: {
//     scale: number;
//     rotation: number;
//     x: number;
//     y: number;
//     flipX: boolean;
//     flipY: boolean;
//   };
// }

// export default function ArtworkPreviewPage() {
//   const router = useRouter();
//   const [artworkData, setArtworkData] = useState<ArtworkData | null>(null);

//   useEffect(() => {
//     const data = sessionStorage.getItem("artworkPreview");
//     if (data) {
//       setArtworkData(JSON.parse(data));
//     } else {
//       router.push("/");
//     }
//   }, [router]);

//   if (!artworkData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00AAB2] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading artwork preview...</p>
//         </div>
//       </div>
//     );
//   }

//   const frontDesign = artworkData.designs.find((d) => d.side === "front");
//   const backDesign = artworkData.designs.find((d) => d.side === "back");

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => router.push("/")}
//               className="gap-2"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Start Over
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Artwork Preview
//               </h1>
//               <p className="text-gray-600">
//                 Final preview of your submitted artwork
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button variant="outline" className="gap-2 bg-transparent">
//               <Share2 className="w-4 h-4" />
//               Share
//             </Button>
//             <Button className="gap-2 bg-[#00AAB2] hover:bg-[#00AAB2]/90">
//               <Download className="w-4 h-4" />
//               Download
//             </Button>
//           </div>
//         </div>

//         {/* Artwork Preview */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Front Side */}
//           <Card className="overflow-hidden">
//             <CardContent className="p-6">
//               <div className="text-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   Front Side
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {artworkData.canvasSize.actualWidth}" ×{" "}
//                   {artworkData.canvasSize.actualHeight}" (
//                   {artworkData.canvasSize.unit})
//                 </p>
//               </div>

//               <div className="relative bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
//                 {frontDesign?.thumbnail ? (
//                   <div className="relative">
//                     <Image
//                       src={frontDesign.thumbnail || "/placeholder.svg"}
//                       alt="Front design preview"
//                       width={300}
//                       height={200}
//                       className="rounded-lg shadow-lg border-4 border-white"
//                       style={{
//                         transform: `scale(${
//                           artworkData.transform.scale
//                         }) rotate(${artworkData.transform.rotation}deg) ${
//                           artworkData.transform.flipX ? "scaleX(-1)" : ""
//                         } ${artworkData.transform.flipY ? "scaleY(-1)" : ""}`,
//                       }}
//                     />

//                     {/* Guidelines overlay */}
//                     <div className="absolute inset-0 pointer-events-none">
//                       {/* Bleed line (black) */}
//                       <div
//                         className="absolute inset-0 border-2 border-dashed border-black opacity-30 rounded-lg"
//                         style={{ margin: "-8px" }}
//                       ></div>
//                       {/* Cut line (red) */}
//                       <div className="absolute inset-0 border-2 border-red-500 rounded-lg"></div>
//                       {/* Safe line (blue) */}
//                       <div
//                         className="absolute inset-0 border border-dashed border-blue-500 rounded-lg"
//                         style={{ margin: "8px" }}
//                       ></div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500">
//                     <div className="w-64 h-40 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
//                       <p>No front design uploaded</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Back Side */}
//           <Card className="overflow-hidden">
//             <CardContent className="p-6">
//               <div className="text-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   Back Side
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {artworkData.canvasSize.actualWidth}" ×{" "}
//                   {artworkData.canvasSize.actualHeight}" (
//                   {artworkData.canvasSize.unit})
//                 </p>
//               </div>

//               <div className="relative bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
//                 {backDesign?.thumbnail ? (
//                   <div className="relative">
//                     <Image
//                       src={backDesign.thumbnail || "/placeholder.svg"}
//                       alt="Back design preview"
//                       width={300}
//                       height={200}
//                       className="rounded-lg shadow-lg border-4 border-white"
//                       style={{
//                         transform: `scale(${
//                           artworkData.transform.scale
//                         }) rotate(${artworkData.transform.rotation}deg) ${
//                           artworkData.transform.flipX ? "scaleX(-1)" : ""
//                         } ${artworkData.transform.flipY ? "scaleY(-1)" : ""}`,
//                       }}
//                     />

//                     {/* Guidelines overlay */}
//                     <div className="absolute inset-0 pointer-events-none">
//                       {/* Bleed line (black) */}
//                       <div
//                         className="absolute inset-0 border-2 border-dashed border-black opacity-30 rounded-lg"
//                         style={{ margin: "-8px" }}
//                       ></div>
//                       {/* Cut line (red) */}
//                       <div className="absolute inset-0 border-2 border-red-500 rounded-lg"></div>
//                       {/* Safe line (blue) */}
//                       <div
//                         className="absolute inset-0 border border-dashed border-blue-500 rounded-lg"
//                         style={{ margin: "8px" }}
//                       ></div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500">
//                     <div className="w-64 h-40 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
//                       <p>No back design uploaded</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Specifications */}
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//               Artwork Specifications
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
//                 <p className="text-sm text-gray-600">
//                   {artworkData.canvasSize.actualWidth}" ×{" "}
//                   {artworkData.canvasSize.actualHeight}" (
//                   {artworkData.canvasSize.unit})
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {artworkData.canvasSize.dpi} DPI
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">
//                   Files Uploaded
//                 </h4>
//                 {artworkData.designs.map((design) => (
//                   <p
//                     key={design.id}
//                     className="text-sm text-gray-600 capitalize"
//                   >
//                     {design.side}: {design.fileName}
//                   </p>
//                 ))}
//               </div>

//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">
//                   Transformations
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   Scale: {Math.round(artworkData.transform.scale * 100)}%
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Rotation: {artworkData.transform.rotation}°
//                 </p>
//                 {(artworkData.transform.flipX ||
//                   artworkData.transform.flipY) && (
//                   <p className="text-sm text-gray-600">
//                     Flipped: {artworkData.transform.flipX ? "Horizontal " : ""}
//                     {artworkData.transform.flipY ? "Vertical" : ""}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-4 mt-8">
//           <Button
//             variant="outline"
//             size="lg"
//             onClick={() => router.push("/")}
//             className="px-8"
//           >
//             Edit Artwork
//           </Button>
//           <Button
//             size="lg"
//             className="px-8 bg-[#00AAB2] hover:bg-[#00AAB2]/90"
//             onClick={() => {
//               // In production, this would submit to the printing queue
//               alert(
//                 "Artwork submitted successfully! You will receive a confirmation email shortly."
//               );
//               router.push("/");
//             }}
//           >
//             Confirm & Submit
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }









"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ArtworkData {
  designs: Array<{
    id: string
    side: "front" | "back"
    fileName: string
    thumbnail?: string
  }>
  canvasSize: {
    width: number
    height: number
    actualWidth: number
    actualHeight: number
    unit: string
    dpi: number
  }
  transform: {
    scale: number
    rotation: number
    x: number
    y: number
    flipX: boolean
    flipY: boolean
  }
}

interface CanvasImages {
  front?: string
  back?: string
}

export default function ArtworkPreviewPage() {
  const router = useRouter()
  const [artworkData, setArtworkData] = useState<ArtworkData | null>(null)
  const [canvasImages, setCanvasImages] = useState<CanvasImages>({})

  useEffect(() => {
    const data = sessionStorage.getItem("artworkPreview")
    const savedCanvasImages = localStorage.getItem("artworkCanvasImages")

    if (data) {
      setArtworkData(JSON.parse(data))
    } else {
      router.push("/")
    }

    if (savedCanvasImages) {
      setCanvasImages(JSON.parse(savedCanvasImages))
    }
  }, [router])

  if (!artworkData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00AAB2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading artwork preview...</p>
        </div>
      </div>
    )
  }

  const frontDesign = artworkData.designs.find((d) => d.side === "front")
  const backDesign = artworkData.designs.find((d) => d.side === "back")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Artwork Preview</h1>
              <p className="text-gray-600">Final preview of your submitted artwork</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button className="gap-2 bg-[#00AAB2] hover:bg-[#00AAB2]/90">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Artwork Preview - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Front Side */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Front Side</h3>
                <p className="text-sm text-gray-600">
                  {artworkData.canvasSize.actualWidth}" × {artworkData.canvasSize.actualHeight}" (
                  {artworkData.canvasSize.unit})
                </p>
              </div>
              <div className="relative bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                {canvasImages.front ? (
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={canvasImages.front || "/placeholder.svg"}
                      alt="Front design final canvas"
                      className="rounded-lg shadow-lg border-4 border-white max-w-full max-h-full object-contain"
                    />
                    {/* Guidelines overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Bleed line (black) */}
                      <div
                        className="absolute inset-0 border-2 border-dashed border-black opacity-30 rounded-lg"
                        style={{ margin: "-8px" }}
                      ></div>
                      {/* Cut line (red) */}
                      <div className="absolute inset-0 border-2 border-red-500 rounded-lg"></div>
                      {/* Safe line (blue) */}
                      <div
                        className="absolute inset-0 border border-dashed border-blue-500 rounded-lg"
                        style={{ margin: "8px" }}
                      ></div>
                    </div>
                  </div>
                ) : frontDesign ? (
                  <div className="text-center text-gray-500">
                    <div className="w-64 h-40 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p>Front design canvas not captured</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="w-64 h-40 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p>No front design uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Back Side */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Back Side</h3>
                <p className="text-sm text-gray-600">
                  {artworkData.canvasSize.actualWidth}" × {artworkData.canvasSize.actualHeight}" (
                  {artworkData.canvasSize.unit})
                </p>
              </div>
              <div className="relative bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                {canvasImages.back ? (
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={canvasImages.back || "/placeholder.svg"}
                      alt="Back design final canvas"
                      className="rounded-lg shadow-lg border-4 border-white max-w-full max-h-full object-contain"
                    />
                    {/* Guidelines overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Bleed line (black) */}
                      <div
                        className="absolute inset-0 border-2 border-dashed border-black opacity-30 rounded-lg"
                        style={{ margin: "-8px" }}
                      ></div>
                      {/* Cut line (red) */}
                      <div className="absolute inset-0 border-2 border-red-500 rounded-lg"></div>
                      {/* Safe line (blue) */}
                      <div
                        className="absolute inset-0 border border-dashed border-blue-500 rounded-lg"
                        style={{ margin: "8px" }}
                      ></div>
                    </div>
                  </div>
                ) : backDesign ? (
                  <div className="text-center text-gray-500">
                    <div className="w-64 h-40 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p>Back design canvas not captured</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="w-64 h-40 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p>No back design uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specifications */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Artwork Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                <p className="text-sm text-gray-600">
                  {artworkData.canvasSize.actualWidth}" × {artworkData.canvasSize.actualHeight}" (
                  {artworkData.canvasSize.unit})
                </p>
                <p className="text-sm text-gray-600">{artworkData.canvasSize.dpi} DPI</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Files Uploaded</h4>
                {artworkData.designs.map((design) => (
                  <p key={design.id} className="text-sm text-gray-600 capitalize">
                    {design.side}: {design.fileName}
                  </p>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Transformations</h4>
                <p className="text-sm text-gray-600">Scale: {Math.round(artworkData.transform.scale * 100)}%</p>
                <p className="text-sm text-gray-600">Rotation: {artworkData.transform.rotation}°</p>
                {(artworkData.transform.flipX || artworkData.transform.flipY) && (
                  <p className="text-sm text-gray-600">
                    Flipped: {artworkData.transform.flipX ? "Horizontal " : ""}
                    {artworkData.transform.flipY ? "Vertical" : ""}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" size="lg" onClick={() => router.push("/")} className="px-8">
            Edit Artwork
          </Button>
          <Button
            size="lg"
            className="px-8 bg-[#00AAB2] hover:bg-[#00AAB2]/90"
            onClick={() => {
              // In production, this would submit to the printing queue
              alert("Artwork submitted successfully! You will receive a confirmation email shortly.")
              // Clear the saved data
              localStorage.removeItem("artworkCanvasImages")
              sessionStorage.removeItem("artworkPreview")
              router.push("/")
            }}
          >
            Confirm & Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
