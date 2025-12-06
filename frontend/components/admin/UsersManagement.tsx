"use client"

import React, { useState, useMemo } from "react"
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
import { useAdminUsers, useAllAdminUsers, adminQueryKeys } from "@/hooks/admin-queries"
import { useQueryClient } from "@tanstack/react-query"

export default function UsersManagement() {
  const queryClient = useQueryClient()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
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

  // Use React Query for paginated users
  const {
    data: usersData = [],
    isLoading,
    error: fetchError
  } = useAdminUsers(currentPage, pageSize)

  // Use React Query for all users (stats)
  const {
    data: allUsersData = [],
    isLoading: allUsersLoading
  } = useAllAdminUsers()

  const users = useMemo(() => {
    if (Array.isArray(usersData)) {
      return usersData.map((user: any) => ({
        ...user,
        id: user.id?.toString() || user._id?.toString() || '',
        name: user.name || user.fullname || 'Unknown',
        email: user.email || 'N/A',
        phone: user.phone || user.phoneNumber || 'N/A',
        avatar: user.avatarUrl || user.avatar || "/placeholder-user.jpg",
        bio: user.bio || '',
        location: user.location || user.address || 'Chưa cập nhật',
        favoriteSports: user.favoriteSports || [],
        notifications: user.notifications || { booking: true, tournament: true, community: true, email: true, push: true },
        stats: user.stats || { totalBookings: 0, totalTournaments: 0, totalPosts: 0 },
        createdAt: user.createdAt || new Date().toISOString(),
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        lastActive: user.lastActive || new Date().toISOString().split('T')[0],
        status: user.active !== false ? 'active' : 'inactive'
      })) as AdminUser[]
    }
    return []
  }, [usersData])

  const allUsers = useMemo(() => {
    if (Array.isArray(allUsersData)) {
      return allUsersData.map((user: any) => ({
        ...user,
        id: user.id?.toString() || user._id?.toString() || '',
        name: user.name || user.fullname || 'Unknown',
        email: user.email || 'N/A',
        phone: user.phone || user.phoneNumber || 'N/A',
        avatar: user.avatarUrl || user.avatar || "/placeholder-user.jpg",
        bio: user.bio || '',
        location: user.location || user.address || 'Chưa cập nhật',
        favoriteSports: user.favoriteSports || [],
        notifications: user.notifications || { booking: true, tournament: true, community: true, email: true, push: true },
        stats: user.stats || { totalBookings: 0, totalTournaments: 0, totalPosts: 0 },
        createdAt: user.createdAt || new Date().toISOString(),
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        lastActive: user.lastActive || new Date().toISOString().split('T')[0],
        status: user.active !== false ? 'active' : 'inactive'
      })) as AdminUser[]
    }
    return []
  }, [allUsersData])

  const totalUsers = allUsers.length

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

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
      queryClient.invalidateQueries({ queryKey: [adminQueryKeys.users.list] as any })

      // Show success message
      setActionSuccess(
        action === 'ban'
          ? 'Đã khóa tài khoản người dùng'
          : 'Đã kích hoạt tài khoản người dùng'
      )

      // Auto-clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error(` Error toggling user status:`, err)
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

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
      queryClient.invalidateQueries({ queryKey: [adminQueryKeys.users.list] as any })

      // Show success message
      setActionSuccess('Đã xóa người dùng thành công')

      // Auto-clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error(' Error deleting user:', err)
      setActionError('Lỗi khi xóa người dùng')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCreateUser = async (formData: any) => {
    try {
      setIsActionLoading(true)
      setActionError(null)
      setActionSuccess(null)

      // TODO: Call API to create user
      // await createUserAPI(formData)

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
      queryClient.invalidateQueries({ queryKey: [adminQueryKeys.users.list] as any })

      setIsCreateDialogOpen(false)
      setActionSuccess('Đã tạo người dùng thành công')
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error('Error creating user:', err)
      setActionError('Lỗi khi tạo người dùng')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUpdateUser = async (formData: any) => {
    if (!selectedUser) return

    try {
      setIsActionLoading(true)
      setActionError(null)
      setActionSuccess(null)

      // TODO: Call API to update user
      // await updateUserAPI(selectedUser.id, formData)

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
      queryClient.invalidateQueries({ queryKey: [adminQueryKeys.users.list] as any })

      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setActionSuccess('Đã cập nhật người dùng thành công')
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error('Error updating user:', err)
      setActionError('Lỗi khi cập nhật người dùng')
    } finally {
      setIsActionLoading(false)
    }
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
      {!isLoading && <UserStats users={allUsers} />}

      {/* Loading State */}
      {isLoading && (
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
      {fetchError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{fetchError instanceof Error ? fetchError.message : 'Lỗi khi tải dữ liệu'}</p>
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
      {!isLoading && (
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