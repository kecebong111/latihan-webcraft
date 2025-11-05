'use client'

import { useState } from 'react'
import {
  Search,
  Settings,
  Star,
  Download,
  Bell,
  ChevronDown,
  Home,
  TrendingUp,
  UserPlus,
  Users,
  MessageCircle,
  ChevronLeft,
} from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

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
            Explore <ChevronDown size={18} />
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
          <Settings size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Star size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Download size={20} className="text-gray-400 hover:text-white cursor-pointer" />

          {/* Bell */}
          <div className="relative">
            <Bell size={22} className="text-yellow-400 cursor-pointer" />
          </div>

          {/* Profile */}
          <div className="relative">
            <Image
              src="/profile.jpg"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-gray-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></span>
          </div>

          {/* Share button */}
          <button className="bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition">
            Share
          </button>
        </div>
      </nav>

      {/* 🔹 Sidebar (slide from left) */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 90 }}
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

          {/* Menu utama */}
          <nav className="space-y-2">
            <a className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]">
              <Home className="text-blue-400" /> Home
            </a>
            <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a]">
              <TrendingUp className="text-pink-400" /> Trending
            </a>
            <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a]">
              <UserPlus className="text-purple-400" /> Following
            </a>
            <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a]">
              <Users className="text-green-400" /> Friend
            </a>
            <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a]">
              <Users className="text-blue-400" /> Your Community
            </a>
          </nav>

          {/* Followed Community */}
          <div className="mt-8">
            <p className="text-gray-400 mb-2 flex items-center gap-1">
              <ChevronDown size={16} /> Followed Community
            </p>
            <div className="space-y-3">
              {[
                { name: 'SMC', img: '/smc.jpg', badge: 29 },
                { name: 'UKM Tennis UGM', img: '/tennis.jpg' },
                { name: 'Rey’s books club', img: '/books.jpg', badge: 4 },
                { name: 'Aspac Basketball', img: '/basket.jpg' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-[#1a1a1a] p-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-600 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="mt-8">
            <p className="text-gray-400 mb-2">Social</p>
            <div className="flex items-center justify-between hover:bg-[#1a1a1a] p-2 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-blue-400" /> Chat
              </div>
              <span className="bg-red-600 text-xs px-2 py-1 rounded-full">4</span>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mt-8 bg-[#1a1a1a] p-3 rounded-2xl flex items-center gap-3">
          <Image
            src="/profile.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col text-sm">
            <span className="font-semibold">Adit Hama</span>
            <span className="text-gray-400 text-xs">@Siganteng212</span>
            <div className="flex gap-2 mt-1 text-xs">
              <span className="bg-gray-700 px-2 py-1 rounded-lg">Basketball</span>
              <span className="bg-gray-700 px-2 py-1 rounded-lg">Football</span>
              <span className="bg-gray-700 px-2 py-1 rounded-lg">Book</span>
            </div>
          </div>
          <span className="ml-auto bg-green-500 text-black text-xs font-semibold px-2 py-1 rounded-full">
            Freshman
          </span>
        </div>
      </motion.aside>
    </>
  )
}
