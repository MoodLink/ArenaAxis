"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs from "@/components/profile/ProfileTabs"
import ProfileOverview from "@/components/profile/ProfileOverview"
import ProfileActivities from "@/components/profile/ProfileActivities"
import ProfileAchievements from "@/components/profile/ProfileAchievements"
import ProfileSettings from "@/components/profile/ProfileSettings"
import { getCurrentUser } from "@/services/api"
import { User as UserType } from "@/types"
import { currentUser } from "@/data/mockData"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Lấy dữ liệu user từ API hoặc mockData
  useEffect(() => {
    async function fetchUser() {
      try {
        // Thử lấy từ API trước, nếu lỗi thì dùng mockData
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch {
          // Fallback to mockData if API fails
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(currentUser) // Fallback to mockData
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Profile Section */}
        <ProfileHeader user={user} />

        {/* Profile Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="overview" className="space-y-6">
            <ProfileOverview user={user} />
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <ProfileActivities />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <ProfileAchievements />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}