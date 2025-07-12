"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Business Cards", href: "/business-cards" },
  { name: "Marketing Products", href: "#" },
  { name: "Signs & Banners", href: "#" },
  { name: "Boxes & Packaging", href: "#" },
  { name: "Roll Labels & Stickers", href: "#" },
  { name: "Promo Products", href: "#" },
  { name: "Direct Mail Services", href: "#" },
  { name: "Marketplace", href: "#" },
]

export function Header() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-10 text-xs">
            <div className="flex gap-4">
              <Link href="#" className="hover:text-blue-600">
                Estimates
              </Link>
              <Link href="#" className="hover:text-blue-600">
                Price Match
              </Link>
              <Link href="#" className="hover:text-blue-600">
                Resources
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-xs h-auto p-0">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>My Account</DropdownMenuItem>
                    <DropdownMenuItem>Order History</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="flex items-center gap-1 hover:text-blue-600">
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </Link>
              )}
              <Link href="#" className="flex items-center gap-1 hover:text-blue-600">
                <ShoppingCart className="w-4 h-4" />
                <span>My Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            4over
          </Link>
          <nav className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-3 py-2 border rounded-md text-sm w-48" />
            </div>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              4over
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
