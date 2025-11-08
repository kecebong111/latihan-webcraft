"use client"

import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { User, LogOut } from "lucide-react"
import { MonogramAvatar } from "@/components/ui/monogram-avatar"

export function UserDropdown() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const name = session?.user?.name || "Anonymous"
  const email = session?.user?.email || "No email"
  


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => window.location.href = "/login"}
          className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
        >
          Login
        </button>
        <button
          onClick={() => window.location.href = "/register"}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none"
      >
        {session?.user?.avatar ? (
          <Image
            src={session.user.avatar}
            alt={name}
            width={32}
            height={32}
            className="rounded-full border-2 border-gray-700 hover:border-gray-500 transition"
            onError={(e) => {
              console.error('Image failed to load:', session.user.avatar)
              // Fallback to monogram if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              // Show monogram fallback
              const parent = target.parentElement
              if (parent) {
                const monogram = document.createElement('div')
                monogram.className = 'w-8 h-8 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center text-sm'
                monogram.textContent = name.substring(0, 2).toUpperCase()
                parent.appendChild(monogram)
              }
            }}
          />
        ) : (
          <MonogramAvatar name={name} size="sm" />
        )}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-52 bg-[#1a1a1a] rounded-lg shadow-xl py-2 z-50 border border-[#2a2a2a]"
          >
            {/* Header */}
            <div className="px-4 py-2">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>

            <div className="border-t border-gray-700 my-1"></div>

            {/* Profile Link */}
            <button
              onClick={() => {
                setOpen(false)
                window.location.href = "/profile"
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333] flex items-center gap-2 transition"
            >
              <User size={16} className="text-gray-400" />
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#333] flex items-center gap-2 transition"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
