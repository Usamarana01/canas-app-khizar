"use client"

import { Button } from "@/components/ui/button"
import { UploadModal } from "@/components/editor/upload-modal"
import { useState } from "react"

export function PriceSummary({ price }: { price: number }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  return (
    <>
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Price Summary</span>
          <span className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Taxes and shipping calculated at checkout.</p>
        <Button className="w-full" size="lg" onClick={() => setIsUploadModalOpen(true)}>
          Upload Your Artwork
        </Button>
      </div>
      <UploadModal isOpen={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
    </>
  )
}
