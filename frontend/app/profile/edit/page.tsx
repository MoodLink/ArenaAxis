"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, ArrowLeft, Save, User, Bell, Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { updateMyProfile, changeMyPassword } from "@/services/api-new"
import { getMyProfile } from "@/services/get-my-profile"
import { User as UserType, UpdateUserData, UserResponse } from "@/types"
import { useRouter } from "next/navigation"

export default function EditProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [activeSection, setActiveSection] = useState<string>("profile")
  const router = useRouter()

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    favoriteSports: [] as string[]
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [notifications, setNotifications] = useState({
    booking: true,
    tournament: false,
    community: true,
    email: true,
    push: false
  })

  //  Lấy dữ liệu user từ API thật - SỬ DỤNG ĐÚNG ENDPOINT
  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = getMyProfile()
        console.log(" User data from API:", userData)

        if (!userData) {
          console.error(" API trả về null, không có dữ liệu user")
          router.push("/login")
          return
        }

        const mappedUser: UserType = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          avatarUrl: userData.avatarUrl,
          bankAccount: userData.bankAccount,
          avatar: userData.avatarUrl,
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
        if (mappedUser) updateFormData(mappedUser)
      } catch (error) {
        console.error(" Error fetching user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const updateFormData = (userData: UserType) => {
    setProfile({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      bio: userData.bio || "",
      location: userData.location || "",
      favoriteSports: userData.favoriteSports || []
    })
    setNotifications(userData.notifications || {
      booking: true,
      tournament: true,
      community: true,
      email: true,
      push: false
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    setSaving(true)
    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        location: profile.location,
        favoriteSports: profile.favoriteSports
      }

      const result = await updateMyProfile(updateData)
      if (result) {
        setUser(prevUser => prevUser ? {
          ...prevUser,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          bio: profile.bio,
          location: profile.location,
          favoriteSports: profile.favoriteSports,
          notifications: notifications
        } : null)

        alert("Cập nhật thông tin thành công!")
      } else {
        alert("Có lỗi xảy ra khi cập nhật thông tin")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới không khớp")
      return
    }

    if (passwords.new.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    setSaving(true)
    try {
      const result = await changeMyPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      })

      if (result.success) {
        setPasswords({ current: "", new: "", confirm: "" })
        alert("Đổi mật khẩu thành công!")
      } else {
        alert(result.message || "Có lỗi xảy ra khi đổi mật khẩu")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Có lỗi xảy ra khi đổi mật khẩu")
    } finally {
      setSaving(false)
    }
  }

  const handleAddSport = (sport: string) => {
    if (sport && !profile.favoriteSports.includes(sport)) {
      setProfile({ ...profile, favoriteSports: [...profile.favoriteSports, sport] })
    }
  }

  const handleRemoveSport = (sportToRemove: string) => {
    setProfile({
      ...profile,
      favoriteSports: profile.favoriteSports.filter(sport => sport !== sportToRemove)
    })
  }

  const sections = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "password", label: "Đổi mật khẩu", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell }
  ]

  const popularSports = ["Bóng đá", "Tennis", "Cầu lông", "Bóng rổ", "Bơi lội", "Chạy bộ", "Yoga", "Gym"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div>

                <h1 className="text-2xl font-bold text-gray-900">Cập nhật thông tin</h1>
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Profile Preview */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                      {user && user.avatar ? (
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        getInitials(profile.name || "U")
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900">{profile.name || "Người dùng"}</h3>
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                </div>

                {/* Navigation Menu */}
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeSection === section.id
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "profile" && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông tin cơ bản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Họ và tên *
                        </Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          placeholder="Nhập họ và tên"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="Nhập địa chỉ email"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Số điện thoại
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="Nhập số điện thoại"
                          className="mt-1"
                        />
                      </div>
                      {/* <div>
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                          Địa chỉ
                        </Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          placeholder="Nhập địa chỉ"
                          className="mt-1"
                        />
                      </div> */}
                    </div>

                    {/* <div>
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                        Giới thiệu bản thân
                      </Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Giới thiệu về bản thân, sở thích thể thao..."
                        rows={4}
                        className="mt-1"
                      />
                    </div> */}
                  </CardContent>
                </Card>

                {/* Sports Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Môn thể thao yêu thích</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.favoriteSports.map((sport, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {sport}
                          <button
                            onClick={() => handleRemoveSport(sport)}
                            className="ml-1 hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Thêm môn thể thao
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {popularSports.map((sport) => (
                          <button
                            key={sport}
                            onClick={() => handleAddSport(sport)}
                            disabled={profile.favoriteSports.includes(sport)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${profile.favoriteSports.includes(sport)
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {sport}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "password" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Đổi mật khẩu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Yêu cầu mật khẩu mới:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ít nhất 6 ký tự</li>
                      <li>• Nên bao gồm chữ hoa, chữ thường và số</li>
                      <li>• Không nên sử dụng thông tin cá nhân</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                        Mật khẩu hiện tại *
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="current-password"
                          type={showPassword.current ? "text" : "password"}
                          placeholder="Nhập mật khẩu hiện tại"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                        Mật khẩu mới *
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="new-password"
                          type={showPassword.new ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                        Nhập lại mật khẩu mới *
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirm-password"
                          type={showPassword.confirm ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu mới"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                        <p className="text-red-600 text-sm mt-1">Mật khẩu không khớp</p>
                      )}
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={saving || !passwords.current || !passwords.new || !passwords.confirm || passwords.new !== passwords.confirm}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving ? "Đang đổi..." : "Đổi mật khẩu"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Quản lý thông báo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Nhắc nhở đặt sân</h4>
                        <p className="text-sm text-gray-600">
                          Nhận thông báo nhắc nhở về lịch đặt sân của bạn
                        </p>
                      </div>
                      <Switch
                        checked={notifications.booking}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, booking: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Cập nhật giải đấu</h4>
                        <p className="text-sm text-gray-600">
                          Nhận thông báo về các giải đấu và sự kiện mới
                        </p>
                      </div>
                      <Switch
                        checked={notifications.tournament}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, tournament: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Tin nhắn cộng đồng</h4>
                        <p className="text-sm text-gray-600">
                          Nhận thông báo về tin nhắn từ cộng đồng thể thao
                        </p>
                      </div>
                      <Switch
                        checked={notifications.community}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, community: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Email thông báo</h4>
                        <p className="text-sm text-gray-600">
                          Nhận thông báo qua email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Thông báo đẩy</h4>
                        <p className="text-sm text-gray-600">
                          Nhận thông báo đẩy trên thiết bị di động
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
