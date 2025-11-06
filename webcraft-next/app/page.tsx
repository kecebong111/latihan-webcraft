'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
  LogOut,
  Calendar,
  Home as HomeIcon,
  UserPlus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from './context/ProfileContext'
import { umkm } from './data/umkm'
import { organizations } from './data/organizations'
import './homepage.css'
import './modal.css'

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
  const { profilePic } = useProfile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPopoutOpen, setIsPopoutOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<any>(null)

  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)

  // 🔹 Fetch dari backend untuk friends
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

  const featuredUmkm = umkm.find((item) => item.featured)
  const otherUmkm = umkm.filter((item) => !item.featured)

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans">
      {/* 🔹 NAVBAR */}
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
            placeholder="Search apa aja gapapa"
            className="bg-transparent outline-none text-sm w-full text-gray-300 placeholder-gray-500"
          />
        </div>

        {/* Right */}
        <div className="flex items-center space-x-5">
          <Link href="/settings">
            <Settings size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </Link>
          <Star size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Download size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          <Bell size={22} className="text-yellow-400 cursor-pointer" />

          <div className="relative">
            <Image
              src={profilePic}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-gray-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></span>
          </div>

          <button className="bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition">
            Share
          </button>
        </div>
      </nav>

      {/* 🔸 SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              key="sidebar-overlay"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              key="sidebar-menu"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] text-gray-200 p-6 z-50 shadow-xl"
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

                {/* Followed Community */}
                <div className="mt-8">
                  <p className="text-sm font-semibold text-zinc-400 mb-3">Followed Community</p>
                  <div className="space-y-3">
                    {[
                      { name: 'SMC', badge: 29, img: '/community/smc.jpg' },
                      { name: 'UKM Tennis UGM', badge: 0, img: '/community/tennis.jpg' },
                      { name: 'Rey’s books club', badge: 4, img: '/community/books.jpg' },
                      { name: 'Aspac Basketball', badge: 0, img: '/community/aspac.jpg' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image src={item.img} alt={item.name} width={32} height={32} className="rounded-full" />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Card */}
                <div className="mt-10 bg-zinc-800 rounded-xl p-3 flex items-center gap-3">
                  <Image src={profilePic} alt="User" width={48} height={48} className="rounded-full" />
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold">Adit Hama</span>
                    <span className="text-xs text-zinc-400">@Siganteng212</span>
                    <span className="text-xs text-green-400 font-semibold">Freshman</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">Basketball</span>
                      <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">Football</span>
                      <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">Book</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 🔹 POPOUT FRIENDS */}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-[#1a1a1a] text-white rounded-2xl shadow-2xl p-5 w-[400px] h-[600px] overflow-y-auto">
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

                {/* Filter Interests */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Filter by Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((item) => {
                      const isActive = selectedInterest === item
                      return (
                        <button
                          key={item}
                          onClick={() => setSelectedInterest(isActive ? null : item)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            isActive
                              ? 'bg-green-500 text-black'
                              : 'bg-gray-600 text-white hover:bg-gray-500'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <h2 className="text-lg font-semibold mb-3">Recents</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#2a2a2a] px-3 py-2 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/profile.jpg"
                          alt="Adit"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-sm font-medium">Adit</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Suggested Friends</h2>
                  <p className="text-sm text-gray-400 cursor-pointer hover:text-gray-200">
                    Filter by Interests →
                  </p>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                  {friends.map((f) => (
                    <motion.div
                      key={f.id}
                      className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-xl"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={f.image}
                          alt={f.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{f.name}</p>
                          <p className="text-xs text-gray-400">{f.mutual}+ Mutual Friends</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                          {f.interest}
                        </span>
                        <button className="flex items-center gap-2 bg-gray-100 text-black px-3 py-1.5 rounded-full hover:bg-gray-200 text-sm">
                          <UserPlus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🔹 MAIN CONTENT */}
      <main className="homepage-container">
        <div className="homepage-header">
          <h1>UMKM UGM</h1>
        </div>

        {featuredUmkm && (
          <div className="featured-section">
            <div className="featured-card">
              <Image src={featuredUmkm.image} alt={featuredUmkm.name} width={500} height={220} />
              <div className="featured-info">
                <h2>{featuredUmkm.name}</h2>
                <p>{featuredUmkm.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="umkm-grid">
          {otherUmkm.map((item) => (
            <div key={item.id} className="umkm-card">
              <Image src={item.image} alt={item.name} width={60} height={60} />
              <div className="umkm-info">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
              </div>
              <a href="#" className="get-button">GET</a>
            </div>
          ))}
        </div>

        <div className="homepage-header">
          <h1>Organisasi Mahasiswa</h1>
        </div>

        <div className="umkm-grid">
          {organizations.map((org) => (
            <div key={org.id} className="umkm-card" onClick={() => setSelectedOrg(org)}>
              <Image src={org.image} alt={org.name} width={60} height={60} />
              <div className="umkm-info">
                <h3>{org.name}</h3>
                <p>{org.category}</p>
              </div>
              <a href="#" className="get-button">VIEW</a>
            </div>
          ))}
        </div>
      </main>

      {/* 🔹 Modal Detail Organisasi */}
      {selectedOrg && (
        <div className="modal-overlay" onClick={() => setSelectedOrg(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedOrg.name}</h2>
              <button className="modal-close-button" onClick={() => setSelectedOrg(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <Image src={selectedOrg.image} alt={selectedOrg.name} width={500} height={200} />
              <p>{selectedOrg.description}</p>
              <a href={selectedOrg.instagram} target="_blank" rel="noopener noreferrer" className="instagram-link">
                Visit Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
