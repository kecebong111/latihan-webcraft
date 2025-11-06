'use client'

import Image from 'next/image'
import Link from 'next/link'

const images = [
  { src: '/images/image1.jpg', name: 'Image 1' },
  { src: '/images/image2.jpg', name: 'Image 2' },
  { src: '/images/image3.jpg', name: 'Image 3' },
  { src: '/images/image4.jpg', name: 'Image 4' },
]

export default function DownloadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans p-8">
      <h1 className="text-3xl font-semibold mb-8">Download Images</h1>
      <Link href="/">
        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition mb-8">
          ← Back to Homepage
        </button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {images.map((image) => (
          <div key={image.src} className="bg-[#1a1a1a] rounded-lg p-4 flex flex-col items-center">
            <Image src={image.src} alt={image.name} width={300} height={200} className="rounded-md mb-4" />
            <a
              href={image.src}
              download
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
