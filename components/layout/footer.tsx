import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

const footerLinks = {
  Products: [
    { name: "Business Cards", href: "/business-cards" },
    { name: "Postcards", href: "#" },
    { name: "Banners", href: "#" },
    { name: "Brochures", href: "#" },
  ],
  Resources: [
    { name: "Blog", href: "#" },
    { name: "File Setup", href: "#" },
    { name: "Price Match", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Locations", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  "My Account": [
    { name: "Login", href: "/login" },
    { name: "My Orders", href: "#" },
    { name: "My Files", href: "#" },
    { name: "Rewards", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-xl font-bold text-blue-400 mb-4">4over</h3>
            <p className="text-sm text-gray-400">Your partner in print.</p>
            <div className="flex gap-4 mt-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="w-5 h-5 hover:text-blue-400" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="w-5 h-5 hover:text-blue-400" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 hover:text-blue-400" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5 hover:text-blue-400" />
              </Link>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} 4over, Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
