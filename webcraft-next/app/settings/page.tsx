'use client'

import Link from 'next/link'
import { ChevronLeft, User, Lock, Bell, HelpCircle, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import './settings.css'

export default function SettingsPage() {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <Link href="/">
          <ChevronLeft size={24} />
        </Link>
        <h1>Settings</h1>
      </div>
      <div className="settings-content">
        <div className="search-bar">
          <input type="text" placeholder="Search settings..." />
        </div>
        <ul className="settings-list">
          <motion.li whileHover={{ scale: 1.02, x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/settings/account">
              <div className="icon-container account">
                <User size={24} />
              </div>
              <div className="text-container">
                <span>Account</span>
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  Manage your account settings
                </motion.span>
              </div>
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.02, x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/settings/privacy">
              <div className="icon-container privacy">
                <Lock size={24} />
              </div>
              <div className="text-container">
                <span>Privacy</span>
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  Control your privacy settings
                </motion.span>
              </div>
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.02, x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/notifications">
              <div className="icon-container notifications">
                <Bell size={24} />
              </div>
              <div className="text-container">
                <span>Notifications</span>
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  Manage your notification preferences
                </motion.span>
              </div>
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.02, x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/settings/help">
              <div className="icon-container help">
                <HelpCircle size={24} />
              </div>
              <div className="text-container">
                <span>Help</span>
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  Get help and support
                </motion.span>
              </div>
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.02, x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="#">
              <div className="icon-container logout">
                <LogOut size={24} />
              </div>
              <div className="text-container">
                <span>Log Out</span>
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  Log out of your account
                </motion.span>
              </div>
            </Link>
          </motion.li>
        </ul>
      </div>
    </div>
  )
}
