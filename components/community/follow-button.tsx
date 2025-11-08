"use client"

import { useSession } from "next-auth/react"
import { followCommunity } from "@/actions/community"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, UserMinus } from "lucide-react"
import AuthPromptModal from "@/components/modals/auth-prompt-modal" // Import AuthPromptModal

export default function FollowButton({ 
  communityId, 
  isFollowing: initialIsFollowing, 
  size = "default" 
}: { 
  communityId: string
  isFollowing: boolean 
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false) // State for auth prompt
  
  const handleFollow = async () => {
    if (!session?.user?.id) {
      setIsAuthPromptOpen(true) // Open auth prompt if not logged in
      return
    }
    
    setLoading(true)
    try {
      await followCommunity(session.user.id, communityId)
      setIsFollowing(!isFollowing)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        variant={isFollowing ? "outline" : "default"}
        onClick={handleFollow}
        disabled={loading}
        size={size}
        className={size === "sm" ? "" : "w-full"}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserMinus className="h-4 w-4 mr-2" />
            {size !== "icon" && "Unfollow"}
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            {size !== "icon" && "Follow"}
          </>
        )}
      </Button>

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
      />
    </>
  )
}