'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Search,
  Settings,
  Star,
  Download,
  Bell,
  ChevronDown,
  Folder,
  Users,
  TrendingUp,
  User,
  X,
  Filter,
  Home as HomeIcon,
  UserPlus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Friend = {
  id: number
  name: string
  interest: string
  mutual: number
  image: string
}

const interests = [
  'Football',
  'Billiard',
  'Coding',
  'Movies',
  'Diving',
  'Golf',
  'Basketball',
  'Music',
  'Singing',
  'Guitar',
  'Taekwondo',
]

export default function GamanitasPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPopoutOpen, setIsPopoutOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)

  // Fetch dari backend
  useEffect(() => {
    async function fetchFriends() {
      try {
        const url = selectedInterest
          ? `/api/friends?interest=${selectedInterest}`
          : `/api/friends`
        const res = await fetch(url)
        const data = await res.json()
        setFriends(data)
      } catch (err) {
        console.error('Error fetching friends:', err)
      }
    }
    fetchFriends()
  }, [selectedInterest])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans">
      {/* 🔹 Navbar */}
      <nav className="bg-[#111] text-white px-6 py-3 flex items-center justify-between shadow-md z-50 relative">
        {/* Left */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-semibold">Gamanitas</h1>
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
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full text-gray-300 placeholder-gray-500"
          />
        </div>

        {/* Right */}
        <div className="flex items-center space-x-5">
          <Settings size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Star size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Download size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Bell size={22} className="text-yellow-400 cursor-pointer" />
          <div className="relative">
            <Image
              src="/profile/adit.jpg"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-gray-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></span>
          </div>
        </div>
      </nav>

      {/* 🔸 Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#1a1a1a]/95 backdrop-blur-xl text-gray-200 p-6 z-50 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold mb-8">Explorer</h2>
                <nav className="space-y-3">
                  <button className="flex items-center gap-3 bg-zinc-800 rounded-xl px-3 py-2 hover:bg-zinc-700 w-full text-left">
                    <HomeIcon className="text-blue-400" size={20} /> Home
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl w-full text-left">
                    <TrendingUp className="text-red-400" size={20} /> Trending
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl w-full text-left">
                    <User className="text-purple-400" size={20} /> Following
                  </button>
                  <button
                    onClick={() => setIsPopoutOpen(true)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl w-full text-left"
                  >
                    <Users className="text-green-400" size={20} /> Friends
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl w-full text-left">
                    <Folder className="text-blue-400" size={20} /> Your Community
                  </button>
                </nav>

                {/* Followed Communities */}
                <div className="mt-8">
                  <p className="text-sm font-semibold text-zinc-400 mb-3">
                    Followed Community
                  </p>
                  <div className="space-y-3">
                    {[
                      { name: 'SMC', badge: 29, img: '/community/smc.jpg' },
                      { name: 'UKM Tennis UGM', badge: 0, img: '/community/tennis.jpg' },
                      { name: 'Rey’s books club', badge: 4, img: '/community/books.jpg' },
                      { name: 'Aspac Basketball', badge: 0, img: '/community/aspac.jpg' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Card */}
                <div className="mt-10 bg-zinc-800 rounded-xl p-3 flex items-center gap-3">
                  <Image
                    src="/profile/adit.jpg"
                    alt="Adit Hama"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold">Adit Hama</span>
                    <span className="text-xs text-zinc-400">@Siganteng212</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">
                        Basketball
                      </span>
                      <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">
                        Football
                      </span>
                      <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">
                        Book
                      </span>
                    </div>
                  </div>
                  <span className="bg-green-500 text-black text-xs font-semibold px-2 py-1 rounded">
                    Freshman
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 🔹 Popout: Friends */}
      <AnimatePresence>
        {isPopoutOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopoutOpen(false)}
            />
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="fixed right-10 top-24 w-[400px] h-[600px] bg-[#1a1a1a] text-white rounded-2xl shadow-2xl z-50 p-5 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center bg-[#2a2a2a] px-4 py-2 rounded-full w-full mr-3">
                  <Filter className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="mau nyari siapa hayo"
                    className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
                  />
                </div>
                <button onClick={() => setIsPopoutOpen(false)}>
                  <X size={22} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Suggested Friends</h2>
                <p
                  onClick={() => setShowModal(true)}
                  className="text-sm text-gray-400 cursor-pointer hover:text-gray-200"
                >
                  Filter by Interests →
                </p>
              </div>

              {/* Friend list */}
              <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2">
                {friends.map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={f.image}
                        alt={f.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{f.name}</p>
                        <p className="text-xs text-gray-400">
                          {f.mutual}+ Mutual Friends
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 bg-gray-100 text-black px-3 py-1.5 rounded-full hover:bg-gray-200 text-sm">
                      <UserPlus size={14} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🧩 MODAL Filter Interests */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#2A2C2C] rounded-3xl p-8 w-[90%] max-w-md text-center"
            >
              <h3 className="text-2xl font-semibold mb-4">Filter Interests</h3>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {interests.map((item) => {
                  const active = selectedInterest === item
                  return (
                    <button
                      key={item}
                      onClick={() =>
                        setSelectedInterest(active ? null : item)
                      }
                      className={`px-4 py-2 rounded-full font-medium ${
                        active
                          ? 'bg-green-500 text-black'
                          : 'bg-gray-600 text-white hover:bg-gray-500'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-black font-medium px-6 py-2 rounded-full hover:bg-gray-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
