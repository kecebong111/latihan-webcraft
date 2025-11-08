"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MonogramAvatarProps {
  name?: string | null
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function MonogramAvatar({ name, className = "", size = "md" }: MonogramAvatarProps) {
  // Generate monogram from name
  const getMonogram = (name: string | null | undefined) => {
    if (!name) return "U"
    
    const cleanName = name.trim()
    const words = cleanName.split(" ")
    
    if (words.length >= 2) {
      // Take first letter of first two words
      return (words[0][0] + words[1][0]).toUpperCase()
    } else {
      // Take first two letters of single word
      const word = words[0]
      return word.length >= 2 
        ? word.substring(0, 2).toUpperCase()
        : word.toUpperCase()
    }
  }

  const monogram = getMonogram(name)
  
  // Generate consistent background color based on name
  const getBackgroundColor = (name: string | null | undefined) => {
    if (!name) return "bg-gray-500"
    
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500", "bg-emerald-500", "bg-rose-500",
      "bg-violet-500", "bg-amber-500", "bg-lime-500", "bg-sky-500"
    ]
    
    // Use name to generate consistent color
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colorIndex = Math.abs(hash) % colors.length
    return colors[colorIndex]
  }

  const backgroundColor = getBackgroundColor(name)
  
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl"
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className={`${backgroundColor} text-white font-semibold flex items-center justify-center`}>
        {monogram}
      </AvatarFallback>
    </Avatar>
  )
}