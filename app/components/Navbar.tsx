"use client"

import { useState } from "react" // Import useState
import { useRouter } from "next/navigation"
import {
  Search,
  Settings,
  Home,
  ChevronLeft,
  Image as ImageIcon,
  PanelLeft,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Community } from "@prisma/client"
import { UserDropdown } from "@/components/layout/user-dropdown" // ✅ import dropdown
import Link from "next/link" // Import Link from next/link

interface NavbarProps {
  followedCommunities: Community[]
}

export default function Navbar({ followedCommunities }: NavbarProps) {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      {/* 🔹 Navbar utama */}
      <nav className="bg-[#111] text-white px-6 py-3 flex items-center justify-between shadow-md">
        {/* Left section */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-semibold">Gamanitas</h1>

          {/* Tombol Explore */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1 text-gray-300 hover:text-white transition"
          >
            <PanelLeft size={24} />
          </button>
        </div>

        {/* Middle: Search */}
        <div className="flex items-center bg-[#1a1a1a] px-4 py-2 rounded-full w-80">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search apa aja gapapa"
            className="bg-transparent outline-none text-sm w-full text-gray-300 placeholder-gray-500"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-5">
          {session?.user?.role === "ADMIN" && (
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition"
            >
              Admin Dashboard
            </button>
          )}

          <Settings size={20} className="text-gray-400 hover:text-white cursor-pointer" />

          {/* ✅ Replaced old profile button + dropdown */}
          <UserDropdown />
        </div>
      </nav>

      {/* 🔹 Sidebar (slide from left) */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 90 }}
        className="fixed top-0 left-0 h-full w-72 bg-[#0f0f0f] text-white p-6 shadow-xl z-50 flex flex-col justify-between"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold">Gamanitas</h1>
            <button onClick={() => setIsSidebarOpen(false)}>
              <ChevronLeft size={22} className="text-gray-400 hover:text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]">
              <Home className="text-blue-400" /> Home
            </Link>

            <Link href="/post" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a]">
              <ImageIcon className="text-blue-400" /> Post
            </Link>
          </nav>

          {/* Followed Community */}
          <div className="mt-8">
            <p className="text-gray-400 mb-2 flex items-center gap-1">
              <ChevronDown size={16} /> Followed Community
            </p>
            <div className="space-y-3">
              {followedCommunities.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/c/${item.slug}`)}
                  className="flex items-center justify-between hover:bg-[#1a1a1a] p-2 rounded-lg w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.icon || "/photos/profile.jpg"}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{item.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>


      </motion.aside>
    </>
  )
}
