'use client'

import { Home, TrendingUp, Users, User, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function Sidebar() {
  const [openCommunity, setOpenCommunity] = useState(true)

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 shadow-lg">
      {/* 🔹 Header */}
      <div>
        <h1 className="text-3xl font-extrabold mb-8 text-white">Gamanitas</h1>

        {/* 🔸 Main Menu */}
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 bg-zinc-800 rounded-xl px-3 py-2 hover:bg-zinc-700 transition">
            <Home className="text-blue-400" size={20} />
            <span className="text-white font-medium">Home</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl transition">
            <TrendingUp className="text-red-400" size={20} />
            <span>Trending</span>
            <kbd className="ml-auto bg-zinc-700 px-1.5 py-0.5 text-xs rounded">ctrl + s</kbd>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl transition">
            <User className="text-purple-400" size={20} />
            <span>Following</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl transition">
            <Users className="text-green-400" size={20} />
            <span>Friend</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-xl transition">
            <Users className="text-blue-400" size={20} />
            <span>Your Community</span>
          </a>
        </nav>

        {/* 🔸 Followed Communities */}
        <div className="mt-8">
          <button
            onClick={() => setOpenCommunity(!openCommunity)}
            className="flex items-center justify-between w-full text-sm font-semibold text-zinc-300 hover:text-white transition"
          >
            <span>Followed Community</span>
            <span>{openCommunity ? '▾' : '▸'}</span>
          </button>

          {openCommunity && (
            <div className="mt-3 space-y-3">
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
          )}
        </div>

        {/* 🔸 Social */}
        <div className="mt-8 border-t border-zinc-800 pt-4">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">Social</h3>
          <a href="#" className="flex items-center gap-3 hover:bg-zinc-800 px-3 py-2 rounded-xl transition">
            <MessageSquare className="text-blue-400" size={20} />
            <span>Chat</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">4</span>
          </a>
        </div>
      </div>

      {/* 🔹 User Card */}
      <div className="bg-zinc-800 rounded-xl p-3 flex items-center gap-3 mt-4">
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
            <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">Basketball</span>
            <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">Football</span>
            <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">Book</span>
          </div>
        </div>
        <span className="bg-green-500 text-black text-xs font-semibold px-2 py-1 rounded">
          Freshman
        </span>
      </div>
    </aside>
  )
}
