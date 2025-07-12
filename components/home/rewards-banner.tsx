"use client"

import { useAuth } from "@/hooks/use-auth"
import { Star } from "lucide-react"

export function RewardsBanner() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center gap-4">
        <Star className="w-8 h-8 text-yellow-400" />
        <p className="text-lg">
          You have <span className="font-bold text-xl">2,915</span> Rewards Points
        </p>
      </div>
    </div>
  )
}
