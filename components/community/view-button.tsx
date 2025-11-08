"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ViewButton({ 
  size = "sm" 
}: { 
  size?: "default" | "sm" | "lg" | "icon"
}) {
  return (
    <Button 
      variant="outline"
      size={size}
      className="hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors duration-200"
    >
      <ArrowRight className="h-4 w-4 mr-2" />
      {size !== "icon" && "View"}
    </Button>
  )
}