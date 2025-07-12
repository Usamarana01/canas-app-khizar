import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const links = [
  { name: "Business Cards", href: "/business-cards", img: "/placeholder.svg?width=300&height=200" },
  { name: "Banners", href: "#", img: "/placeholder.svg?width=300&height=200" },
  { name: "Postcards", href: "#", img: "/placeholder.svg?width=300&height=200" },
  { name: "Stickers", href: "#", img: "/placeholder.svg?width=300&height=200" },
]

export function QuickLinks() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link) => (
            <Link href={link.href} key={link.name}>
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={link.img || "/placeholder.svg"}
                    alt={link.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold flex justify-between items-center">
                      {link.name}
                      <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
