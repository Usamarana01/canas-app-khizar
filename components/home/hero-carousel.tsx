"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

const carouselItems = [
  {
    src: "/placeholder.svg?width=1200&height=400",
    alt: "Business Cards",
    title: "Premium Business Cards",
    description: "Make a lasting impression.",
  },
  {
    src: "/placeholder.svg?width=1200&height=400",
    alt: "Flyers",
    title: "Vibrant Marketing Flyers",
    description: "Promote your event or business.",
  },
  {
    src: "/placeholder.svg?width=1200&height=400",
    alt: "Banners",
    title: "Durable Outdoor Banners",
    description: "Get noticed from a distance.",
  },
]

export function HeroCarousel() {
  return (
    <Carousel className="w-full" plugins={[Autoplay({ delay: 5000 })]} opts={{ loop: true }}>
      <CarouselContent>
        {carouselItems.map((item, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[400px]">
              <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-6xl font-bold">{item.title}</h2>
                  <p className="text-lg md:text-xl mt-2">{item.description}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  )
}
