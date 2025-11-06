'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AccountPage() {
  // Initial user data (could come from context or props)
  const [profilePic, setProfilePic] = useState('/default-profile.jpg')
  const [fullName, setFullName] = useState('')
  const [nickName, setNickName] = useState('')
  const [gender, setGender] = useState('')
  const [faculty, setFaculty] = useState('')
  const [batch, setBatch] = useState('')
  const [major, setMajor] = useState('')
  const [email] = useState('musangsagapung@gmail.com') // fixed email as example

  // Handle profile picture change
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setProfilePic(event.target.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Save handler
  const handleSave = () => {
    // Simulate save action
    console.log({
      profilePic,
      fullName,
      nickName,
      gender,
      faculty,
      batch,
      major,
      email,
    })
    alert('Profile saved!')
  }

  return (
    <div className="account-wrapper" style={{ maxWidth: 800, margin: '40px auto', padding: 24, background: '#121212', borderRadius: 8, color: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* Header with profile pic and name/email */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', marginRight: 16 }}>
          <Image src={profilePic} alt="Profile Picture" width={64} height={64} style={{ objectFit: 'cover' }} />
          <input
            id="profile-pic-input"
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="profile-pic-input" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#222', color: 'white', fontSize: 12, padding: '2px 6px', borderRadius: '0 0 4px 4px', cursor: 'pointer' }}>
            Change
          </label>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>Johny Sins</div>
          <div style={{ fontSize: 14, color: '#ccc' }}>{email}</div>
        </div>
      </div>

      {/* Form Inputs in two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: 6 }}>Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Your First Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: 'none', fontSize: 14 }}
          />
        </div>

        <div>
          <label htmlFor="nickName" style={{ display: 'block', marginBottom: 6 }}>Nick Name</label>
          <input
            id="nickName"
            type="text"
            placeholder="Your First Name"
            value={nickName}
            onChange={e => setNickName(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: 'none', fontSize: 14 }}
          />
        </div>

        <div>
          <label htmlFor="gender" style={{ display: 'block', marginBottom: 6 }}>Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: 'none', fontSize: 14 }}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="faculty" style={{ display: 'block', marginBottom: 6 }}>Faculty</label>
          <input
            id="faculty"
            type="text"
            placeholder="Your First Name"
            value={faculty}
            onChange={e => setFaculty(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: 'none', fontSize: 14 }}
          />
        </div>

        <div>
          <label htmlFor="batch" style={{ display: 'block', marginBottom: 6 }}>Batch</label>
          <select
            id="batch"
            value={batch}
            onChange={e => setBatch(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: 'none', fontSize: 14 }}
          >
            <option value="" disabled>Select Batch</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
          </select>
        </div>

        <div>
          <label htmlFor="major" style={{ display: 'block', marginBottom: 6 }}>Major</label>
          <input
            id="major"
            type="text"
            placeholder="Your First Name"
            value={major}
            onChange={e => setMajor(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: 'none', fontSize: 14 }}
          />
        </div>
      </div>

      {/* Email section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold' }}>My email Address</div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', padding: 12, borderRadius: 6, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginRight: 12 }}>
            @
          </div>
          <div>
            <div>{email}</div>
            <div style={{ fontSize: 12, color: '#888' }}>4 month ago</div>
          </div>
        </div>
        <button
          type="button"
          style={{ backgroundColor: '#3b82f6', border: 'none', padding: '8px 12px', borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 14 }}
          onClick={() => alert('Add new email feature coming soon!')}
        >
          + Tambahin Email Baru
        </button>
      </div>

      {/* Save button */}
      <div>
        <button
          type="button"
          onClick={handleSave}
          style={{ backgroundColor: '#3b82f6', border: 'none', padding: '12px 24px', borderRadius: 8, color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
