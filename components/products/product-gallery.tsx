"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: { src: string; alt: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0])

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative w-full aspect-square">
          <Image
            src={mainImage.src || "/placeholder.svg"}
            alt={mainImage.alt}
            fill
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-300"
          />
        </div>
      </Card>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button key={index} onClick={() => setMainImage(image)}>
            <Card
              className={cn(
                "overflow-hidden transition-all",
                mainImage.src === image.src ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-gray-300",
              )}
            >
              <div className="relative w-full aspect-square">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill style={{ objectFit: "cover" }} />
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
