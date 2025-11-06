'use client'; // Add this line

interface CommunityCardProps {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  memberCount: number;
  onJoin: () => void;
}

export default function CommunityCard({ 
  imageUrl, 
  imageAlt = "Community image", 
  title, 
  memberCount, 
  onJoin 
}: CommunityCardProps) {
  return (
    <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
      {/* Photo Section */}
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={imageAlt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">{imageAlt}</span>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="font-bold text-white mb-2">{title}</div>
      </div>
      
      {/* Footer with Join Button and Member Count */}
      <div className="px-4 py-3 bg-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-300">{memberCount} people</span>
        <button 
          onClick={onJoin}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
}