"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthPromptModal({ isOpen, onClose }: AuthPromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the Community</DialogTitle>
          <DialogDescription>
            You need to be logged in or registered to join communities.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
