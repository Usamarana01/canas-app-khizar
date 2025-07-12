"use client"

import { useRouter } from "next/navigation"
import { createContext, useState, useEffect, type ReactNode } from "react"

interface User {
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, pass: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // This could be replaced with a check to a secure cookie or localStorage
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (email: string, pass: string): boolean => {
    // Mock login credentials
    if (email === "shaibby@gmail.com" && pass === "1azalea@NANUET") {
      const userData = { email }
      setUser(userData)
      sessionStorage.setItem("user", JSON.stringify(userData))
      router.push("/")
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
