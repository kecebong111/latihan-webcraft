'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import './account.css'

export default function AccountPage() {
  const { profilePic, setProfilePic } = useProfile()
  const [newProfilePic, setNewProfilePic] = useState(profilePic)

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setNewProfilePic(event.target.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSave = () => {
    setProfilePic(newProfilePic)
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <Link href="/settings">
          <ChevronLeft size={24} />
        </Link>
        <h1>Account</h1>
      </div>
      <div className="account-content">
        <div className="profile-pic-section">
          <div className="profile-pic-container">
            <Image src={newProfilePic} alt="Profile Picture" width={80} height={80} className="profile-pic" />
          </div>
          <div className="profile-info">
            <span className="account-name">Gamanitas</span>
            <span className="account-email">gamanitas@example.com</span>
          </div>
        </div>
        <div className="change-pic-section">
          <input type="file" id="profile-pic-input" accept="image/*" onChange={handleProfilePicChange} style={{ display: 'none' }} />
          <label htmlFor="profile-pic-input" className="change-pic-button">
            Change Profile Picture
          </label>
        </div>
        <div className="user-details-section">
          <div className="input-group">
            <label htmlFor="full-name">Full Name</label>
            <input type="text" id="full-name" placeholder="Enter your full name" />
          </div>
          <div className="input-group">
            <label htmlFor="gender">Gender</label>
            <input type="text" id="gender" placeholder="Enter your gender" />
          </div>
          <div className="input-group">
            <label htmlFor="nickname">Nickname</label>
            <input type="text" id="nickname" placeholder="Enter your nickname" />
          </div>
          <div className="input-group">
            <label htmlFor="faculty">Faculty</label>
            <input type="text" id="faculty" placeholder="Enter your faculty" />
          </div>
          <div className="input-group">
            <label htmlFor="batch">Batch</label>
            <input type="text" id="batch" placeholder="Enter your batch" />
          </div>
          <div className="input-group">
            <label htmlFor="major">Major</label>
            <input type="text" id="major" placeholder="Enter your major" />
          </div>
        </div>
        <div className="email-section">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value="gamanitas@example.com" disabled />
          </div>
          <button className="add-email-button">Add New Email</button>
        </div>
        <button onClick={handleSave} className="save-button">Save</button>
      </div>
    </div>
  )
}
