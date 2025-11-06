"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"

// Import các components đã tách
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import UserStats from "./users/UserStats"
import UserTable from "./users/UserTable"
import UserForm from "./users/UserForm"
import UserDetail from "./users/UserDetail"

// Import mock data for fallback
import { mockUsers, AdminUser } from "@/data/mockDataAdmin"

// Import API service từ api-new (có xử lý token đúng)
import { getUsers, toggleUserActive, deleteUser as deleteUserAPI } from "@/services/api-new"

export default function UsersManagement() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)

  const [allUsers, setAllUsers] = useState<AdminUser[]>([])  // ✅ Tất cả users (cho stats)
  const [users, setUsers] = useState<AdminUser[]>([])        // ✅ Users trang hiện tại (cho table)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Fetch tất cả users (lần đầu) cho stats
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch tất cả users từ API (lấy từ page 0 với size lớn)
        const allApiUsers = await getUsers(0, 1000)
        console.log('🔍 DEBUG: API Response for all users:', allApiUsers) // DEBUG

        if (allApiUsers && allApiUsers.length > 0) {
          // Log từng user để xem structure
          console.log('🔍 DEBUG: First user:', allApiUsers[0]) // DEBUG

          const mappedAllUsers: AdminUser[] = allApiUsers.map((user: any, index: number) => ({
            id: user.id?.toString() || (index + 1).toString(),
            name: user.name || 'Unknown',
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            avatar: user.avatarUrl || "/placeholder-user.jpg",
            bio: user.bio || 'Không có mô tả',
            location: user.location || 'Chưa cập nhật',
            favoriteSports: user.favoriteSports || [],
            notifications: user.notifications || {
              booking: true,
              tournament: true,
              community: true,
              email: true,
              push: true
            },
            stats: user.stats || {
              totalBookings: 0,
              totalTournaments: 0,
              totalPosts: 0
            },
            createdAt: user.createdAt || new Date().toISOString(),
            joinDate: user.joinDate || new Date().toISOString().split('T')[0],
            lastActive: user.lastActive || new Date().toISOString().split('T')[0],
            // Convert boolean từ API (true=active, false=inactive) thành string
            status: user.active ? 'active' : 'inactive'
          }))

          console.log('🔍 DEBUG: First mapped user:', mappedAllUsers[0]) // DEBUG

          setAllUsers(mappedAllUsers)
          setTotalUsers(mappedAllUsers.length)
        } else {
          setAllUsers(mockUsers)
          setTotalUsers(mockUsers.length)
        }
      } catch (err) {
        console.error('Error fetching all users:', err)
        setAllUsers(mockUsers)
        setTotalUsers(mockUsers.length)
      }
    }

    fetchAllUsers()
  }, [])

  // Fetch users cho trang hiện tại
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch với page và pageSize
        const apiUsers = await getUsers(currentPage, pageSize)
        console.log('🔍 DEBUG: API Response for page users:', apiUsers) // DEBUG
        console.log('🔍 DEBUG: First page user:', apiUsers[0]) // DEBUG

        if (apiUsers && apiUsers.length > 0) {
          // Map API users (UserResponse) to AdminUser format
          const mappedUsers: AdminUser[] = apiUsers.map((user: any, index: number) => ({
            id: user.id?.toString() || (index + 1).toString(),
            name: user.name || 'Unknown',
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            avatar: user.avatarUrl || "/placeholder-user.jpg",
            bio: user.bio || 'Không có mô tả',
            location: user.location || 'Chưa cập nhật',
            favoriteSports: user.favoriteSports || [],
            notifications: user.notifications || {
              booking: true,
              tournament: true,
              community: true,
              email: true,
              push: true
            },
            stats: user.stats || {
              totalBookings: 0,
              totalTournaments: 0,
              totalPosts: 0
            },
            createdAt: user.createdAt || new Date().toISOString(),
            joinDate: user.joinDate || new Date().toISOString().split('T')[0],
            lastActive: user.lastActive || new Date().toISOString().split('T')[0],
            // Convert boolean từ API (true=active, false=inactive) thành string
            status: user.active ? 'active' : 'inactive'
          }))

          console.log('🔍 DEBUG: First mapped page user:', mappedUsers[0]) // DEBUG
          setUsers(mappedUsers)
        } else {
          // Fallback to mock data if API returns empty
          setUsers(mockUsers.slice(currentPage * pageSize, (currentPage + 1) * pageSize))
        }
      } catch (err) {
        console.error('Error fetching users:', err)
        // Use mock data as fallback
        setUsers(mockUsers.slice(currentPage * pageSize, (currentPage + 1) * pageSize))
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, pageSize])

  // Filter users dựa trên search và filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    const matchesSport = sportFilter === 'all' ||
      (user.favoriteSports && user.favoriteSports.length > 0 &&
        user.favoriteSports.some(sport => sport.toLowerCase().includes(sportFilter.toLowerCase())))

    return matchesSearch && matchesStatus && matchesSport
  })

  const handleUserAction = (userId: string, action: 'view' | 'edit' | 'ban' | 'activate' | 'delete') => {
    const user = users.find(u => u.id === userId)

    switch (action) {
      case 'view':
        if (user) {
          setSelectedUser(user)
          setIsViewDialogOpen(true)
        }
        break
      case 'edit':
        if (user) {
          setSelectedUser(user)
          setIsEditDialogOpen(true)
        }
        break
      case 'ban':
        handleToggleUserStatus(userId, 'ban')
        break
      case 'activate':
        handleToggleUserStatus(userId, 'activate')
        break
      case 'delete':
        handleDeleteUser(userId)
        break
      default:
        console.log(`${action} user ${userId}`)
    }
  }

  // Toggle user active/inactive status
  const handleToggleUserStatus = async (userId: string, action: 'ban' | 'activate') => {
    try {
      setIsActionLoading(true)
      setActionError(null)
      setActionSuccess(null)

      // Call API to toggle active status
      const updatedUser = await toggleUserActive(userId)
      console.log('✅ User status toggled:', updatedUser)

      // Update local state
      setUsers(users.map(user =>
        user.id === userId
          ? {
            ...user,
            status: updatedUser.active ? 'active' : 'inactive'
          }
          : user
      ))

      // Update allUsers for stats
      setAllUsers(allUsers.map(user =>
        user.id === userId
          ? {
            ...user,
            status: updatedUser.active ? 'active' : 'inactive'
          }
          : user
      ))

      // Show success message
      setActionSuccess(
        action === 'ban'
          ? 'Đã khóa tài khoản người dùng'
          : 'Đã kích hoạt tài khoản người dùng'
      )

      // Auto-clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error(`❌ Error toggling user status:`, err)
      setActionError(
        action === 'ban'
          ? 'Lỗi khi khóa người dùng'
          : 'Lỗi khi kích hoạt người dùng'
      )
    } finally {
      setIsActionLoading(false)
    }
  }

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
      return
    }

    try {
      setIsActionLoading(true)
      setActionError(null)
      setActionSuccess(null)

      // Call API to delete user
      await deleteUserAPI(userId)
      console.log('✅ User deleted:', userId)

      // Update local state
      setUsers(users.filter(user => user.id !== userId))
      setAllUsers(allUsers.filter(user => user.id !== userId))
      setTotalUsers(totalUsers - 1)

      // Show success message
      setActionSuccess('Đã xóa người dùng thành công')

      // Auto-clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error('❌ Error deleting user:', err)
      setActionError('Lỗi khi xóa người dùng')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCreateUser = (formData: any) => {
    // Generate a random ID using timestamp and random number
    const newId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newUser: AdminUser = {
      id: newId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: "/placeholder-user.jpg",
      bio: formData.bio || '',
      location: formData.location || '',
      favoriteSports: formData.favoriteSports || [],
      notifications: {
        booking: true,
        tournament: true,
        community: true,
        email: true,
        push: true
      },
      stats: {
        totalBookings: 0,
        totalTournaments: 0,
        totalPosts: 0
      },
      createdAt: new Date().toISOString(),
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      status: formData.status || 'active'
    }

    setUsers([...users, newUser])
    setAllUsers([...allUsers, newUser])
    setTotalUsers(totalUsers + 1)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateUser = (formData: any) => {
    if (!selectedUser) return

    const updatedUserData = {
      ...selectedUser,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio || '',
      location: formData.location || '',
      favoriteSports: formData.favoriteSports || [],
      status: formData.status
    }

    setUsers(users.map(u => u.id === selectedUser.id ? updatedUserData : u))
    setAllUsers(allUsers.map(u => u.id === selectedUser.id ? updatedUserData : u))
    setIsEditDialogOpen(false)
    setSelectedUser(null)
  }
  const filterOptions = [
    {
      key: 'status',
      placeholder: 'Trạng thái',
      value: statusFilter,
      onValueChange: setStatusFilter,
      options: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'banned', label: 'Bị khóa' }
      ]
    },
    {
      key: 'sport',
      placeholder: 'Môn thể thao',
      value: sportFilter,
      onValueChange: setSportFilter,
      options: [
        { value: 'all', label: 'Tất cả môn thể thao' },
        { value: 'bóng đá', label: 'Bóng đá' },
        { value: 'tennis', label: 'Tennis' },
        { value: 'cầu lông', label: 'Cầu lông' },
        { value: 'bóng rổ', label: 'Bóng rổ' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản và hoạt động của người dùng"
        actionButton={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo người dùng mới</DialogTitle>
                <DialogDescription>
                  Thêm người dùng mới vào hệ thống
                </DialogDescription>
              </DialogHeader>
              <UserForm
                onSubmit={handleCreateUser}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats Cards */}
      {!loading && <UserStats users={allUsers} />}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block">
                  <div className="h-8 w-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Error State */}
      {actionError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center justify-between">
            <p className="text-red-600">{actionError}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActionError(null)}
            >
              ✕
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Success State */}
      {actionSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-center justify-between">
            <p className="text-green-600">✓ {actionSuccess}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActionSuccess(null)}
            >
              ✕
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters and Content */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>
              Trang {currentPage + 1} - Hiển thị {users.length} / {totalUsers} người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminFilters
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filterOptions}
            />

            <UserTable
              users={filteredUsers}
              onUserAction={handleUserAction}
            />

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {currentPage * pageSize + 1} đến {Math.min((currentPage + 1) * pageSize, totalUsers)} trong {totalUsers} người dùng
              </div>

              <div className="flex items-center gap-4">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setCurrentPage(0)
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </select>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    ← Trước
                  </Button>

                  <span className="text-sm text-gray-600 px-3">
                    {currentPage + 1} / {Math.ceil(totalUsers / pageSize)}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={(currentPage + 1) * pageSize >= totalUsers}
                  >
                    Sau →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              initialData={{
                name: selectedUser.name,
                email: selectedUser.email,
                phone: selectedUser.phone,
                bio: selectedUser.bio || '',
                location: selectedUser.location || '',
                favoriteSports: selectedUser.favoriteSports || [],
                status: selectedUser.status
              }}
              onSubmit={handleUpdateUser}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
              }}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết người dùng
            </DialogDescription>
          </DialogHeader>
          {selectedUser && <UserDetail user={selectedUser} />}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}