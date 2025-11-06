'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Heart, MessageCircle, Repeat } from 'lucide-react'
import './notifications.css'

const notifications = [
  {
    type: 'like',
    user: 'John Doe',
    post: 'your post',
    time: '2h',
    image: '/photos/community/smc.jpg',
  },
  {
    type: 'comment',
    user: 'Jane Smith',
    comment: 'Nice one!',
    time: '3h',
    image: '/photos/community/tennis.jpg',
  },
  {
    type: 'repost',
    user: 'Peter Jones',
    post: 'your post',
    time: '5h',
    image: '/photos/community/books.jpg',
  },
]

export default function NotificationsPage() {
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <Link href="/">
          <ChevronLeft size={24} />
        </Link>
        <h1>Notifications</h1>
      </div>
      <div className="notifications-content">
        <ul className="notifications-list">
          {notifications.map((notification, index) => (
            <li key={index} className={`notification-item ${notification.type}`}>
              <div className="notification-content-left">
                <div className="notification-icon">
                  {notification.type === 'like' && <Heart size={24} />}
                  {notification.type === 'comment' && <MessageCircle size={24} />}
                  {notification.type === 'repost' && <Repeat size={24} />}
                </div>
                <div className="notification-text">
                  <p>
                    <strong>{notification.user}</strong>
                    {notification.type === 'like' && ` liked ${notification.post}`}
                    {notification.type === 'comment' && ` commented: "${notification.comment}"`}
                    {notification.type === 'repost' && ` reposted ${notification.post}`}
                  </p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
              <div className="notification-image">
                <Image src={notification.image} alt="Post image" width={40} height={40} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
