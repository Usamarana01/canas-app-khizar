import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={product.href}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-lg">
        <CardContent className="p-0">
          <div className="relative w-full h-52">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6 border-t">
            <h3 className="font-semibold text-lg text-[#1E2A38] truncate">{product.name}</h3>
            <p className="text-base text-gray-600 mt-1">{product.subtitle}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
