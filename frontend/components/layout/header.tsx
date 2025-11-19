"use client"


import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, User, LogOut, Settings, Users, History, MessageCircle } from "lucide-react"
import { logout } from "@/services/auth.service"

export default function Header() {
  // State để lưu trạng thái đăng nhập và thông tin user
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Giả sử token và user info lưu ở localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (token && userInfo) {
      try {
        setUser(JSON.parse(userInfo))
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  // Hàm đăng xuất
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      logout().then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        window.location.href = '/login'
      }).catch((error) => {
        console.error('Logout failed:', error);
      })
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ArenaAxis</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/list-store" className="text-gray-700 hover:text-green-600 transition-colors">
              Tìm kiếm
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-green-600 transition-colors">
              Cộng đồng
            </Link>
            <Link href="/tournaments" className="text-gray-700 hover:text-green-600 transition-colors">
              Tin tức thể thao
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Nếu chưa đăng nhập thì hiện nút đăng nhập/đăng ký */}
            {!user && (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Nếu đã đăng nhập thì hiện thông tin user */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {/* Nếu có avatar thì hiện, không thì hiện tên viết tắt */}
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name || "User"} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-green-500 text-white">
                          {user.name ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden md:inline">{user.name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Thông Tin Cá Nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/booking-history" className="flex items-center">
                      <History className="w-4 h-4 mr-2" />
                      Lịch Sử Đặt Chỗ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/chat" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Tin Nhắn
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/community" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Cộng Đồng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Cài Đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
