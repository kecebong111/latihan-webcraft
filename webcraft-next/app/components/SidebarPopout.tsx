'use client'

import { Filter, X } from 'lucide-react'
import Image from 'next/image'

export default function SidebarPopout({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose} // Close popout when clicking outside
    >
      <div
        className="bg-[#1a1a1a] text-white rounded-2xl shadow-2xl p-6 w-[400px] max-w-[90%] max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popout
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Header Search */}
        <div className="flex items-center bg-[#2a2a2a] px-4 py-2 rounded-full mb-5">
          <Filter className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="mau nyari siapa hayo"
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
          />
        </div>

        {/* Recents */}
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

        {/* Suggested Friends */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Suggested Friends</h2>
          <p className="text-sm text-gray-400 cursor-pointer hover:text-gray-200">
            Filter by Interests →
          </p>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/profile.jpg"
                  alt="Adit"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">Adit</p>
                  <p className="text-xs text-gray-400">12+ Mutual Friends</p>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-gray-100 text-black px-3 py-1.5 rounded-full hover:bg-gray-200 text-sm">
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
