"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs from "@/components/profile/ProfileTabs"
import ProfileOverview from "@/components/profile/ProfileOverview"
import ProfileActivities from "@/components/profile/ProfileActivities"
import ProfileStores from "@/components/profile/ProfileStores"
import ProfileAchievements from "@/components/profile/ProfileAchievements"
import ProfileSettings from "@/components/profile/ProfileSettings"
import { getMyProfile } from "@/services/get-my-profile"
import { User as UserType } from "@/types"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        // Kiểm tra token trước
        const token = localStorage.getItem('token');
        if (!token) {
          router.push("/login")
          return
        }

        // Lấy user từ localStorage (đã lưu từ login)
        const userData = getMyProfile()

        if (!userData) {
          router.push("/login")
          return
        }

        const mappedUser: UserType = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          avatarUrl: localStorage.getItem('userAvatar') || userData.avatarUrl,
          bankAccount: userData.bankAccount,
          avatar: localStorage.getItem('userAvatar') || userData.avatarUrl,
          bio: undefined,
          location: undefined,
          favoriteSports: [],
          notifications: {
            booking: true,
            tournament: true,
            community: true,
            email: true,
            push: false
          },
          stats: {
            totalBookings: 0,
            totalTournaments: 0,
            totalPosts: 0
          }
        }

        setUser(mappedUser)
      } catch (error) {
        console.error("❌ Error fetching user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

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

          <TabsContent value="stores" className="space-y-6">
            <ProfileStores userId={user?.id} />
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