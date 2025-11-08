'use client';

import { useEffect } from 'react';
import { Community } from '@prisma/client';

interface JoinConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  community: (Community & { _count: { follows: number } }) | null;
  isJoining?: boolean;
}

export default function JoinConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  community,
  isJoining = false
}: JoinConfirmationModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !community) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
        {/* Community Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={community.icon || ""} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg truncate">{community.name}</h3>
            <p className="text-gray-400 text-sm">
              {(community._count?.follows ?? 0).toLocaleString()} members
            </p>
          </div>
        </div>

        {/* Bio Section */}
        {community.description && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-2">About this community</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {community.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isJoining}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? 'Joining...' : 'Join Community'}
          </button>
        </div>
      </div>
    </div>
  );
}