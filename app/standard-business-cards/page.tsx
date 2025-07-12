import { ProductGallery } from "@/components/products/product-gallery"
import { PriceSummary } from "@/components/products/price-summary"
import { ProductTabs } from "@/components/products/product-tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { productDetails } from "@/lib/data"

export default function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <ProductGallery images={productDetails.images} />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{productDetails.name}</h1>
          <p className="text-gray-500 mb-4">{productDetails.subtitle}</p>
          <Separator className="my-6" />
          <div className="space-y-6">
            <div>
              <label className="font-semibold text-sm mb-2 block">Shipping Method</label>
              <Select defaultValue="ground">
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">UPS Ground</SelectItem>
                  <SelectItem value="2day">UPS 2nd Day Air</SelectItem>
                  <SelectItem value="nextday">UPS Next Day Air</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">Delivery dates are estimates and not guaranteed.</p>
            </div>
            <PriceSummary price={productDetails.price} />
          </div>
          <div className="mt-8">
            <ProductTabs description={productDetails.description} specs={productDetails.specs} />
          </div>
        </div>
      </div>
    </div>
  )
}
