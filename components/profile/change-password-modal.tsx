"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateUserPassword } from "@/actions/user"
import { useSession } from "next-auth/react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { data: session } = useSession()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!session?.user?.id) {
      setError("User not authenticated.")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)
    const result = await updateUserPassword(session.user.id, currentPassword, newPassword)
    setIsLoading(false)

    if (result.success) {
      setSuccess(result.success)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      onClose() // Close modal on success
    } else if (result.error) {
      setError(result.error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPassword" className="text-right">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmNewPassword" className="text-right">
                Confirm New Password
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm col-span-4">{error}</p>}
            {success && <p className="text-green-500 text-sm col-span-4">{success}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}