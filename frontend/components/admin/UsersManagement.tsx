"use client"

import React, { useState } from "react"
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

// Import mock data
import { mockUsers, AdminUser } from "@/data/mockDataAdmin"

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  // Filter users dựa trên search và filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    const matchesSport = sportFilter === 'all' ||
      user.favoriteSports.some(sport => sport.toLowerCase().includes(sportFilter.toLowerCase()))

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
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: 'banned' as const } : user
        ))
        break
      case 'activate':
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: 'active' as const } : user
        ))
        break
      case 'delete':
        setUsers(users.filter(user => user.id !== userId))
        break
      default:
        console.log(`${action} user ${userId}`)
    }
  }

  const handleCreateUser = (formData: any) => {
    const newUser: AdminUser = {
      id: (Math.max(...users.map(u => parseInt(u.id))) + 1).toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: "/placeholder-user.jpg",
      bio: formData.bio,
      location: formData.location,
      favoriteSports: formData.favoriteSports,
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
      status: formData.status
    }
    setUsers([...users, newUser])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateUser = (formData: any) => {
    if (!selectedUser) return

    setUsers(users.map(u => u.id === selectedUser.id ? {
      ...u,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location,
      favoriteSports: formData.favoriteSports,
      status: formData.status
    } : u))
    setIsEditDialogOpen(false)
    setSelectedUser(null)
  }

  // Filter options cho AdminFilters
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
      <UserStats users={users} />

      {/* Filters and Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Quản lý và theo dõi hoạt động của {filteredUsers.length} người dùng
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
        </CardContent>
      </Card>

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