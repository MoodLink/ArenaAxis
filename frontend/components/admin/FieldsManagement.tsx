"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Import components đã tách
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import FieldStats from "./fields/FieldStats"
import FieldTable from "./fields/FieldTable"
import FieldForm from "./fields/FieldForm"
import FieldDetail from "./fields/FieldDetail"

// Import mock data
import { mockFields, AdminField } from "@/data/mockDataAdmin"

export default function FieldsManagement() {
  const [fields, setFields] = useState<AdminField[]>(mockFields)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<AdminField | null>(null)

  // Filter fields based on search and filters
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.ownerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || field.status === statusFilter

    const matchesSport = sportFilter === 'all' ||
      field.sport.toLowerCase().includes(sportFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesSport
  })

  const handleFieldAction = (fieldId: string, action: 'view' | 'edit' | 'activate' | 'deactivate' | 'verify' | 'delete') => {
    const field = fields.find(f => f.id === fieldId)

    switch (action) {
      case 'view':
        if (field) {
          setSelectedField(field)
          setIsViewDialogOpen(true)
        }
        break
      case 'edit':
        if (field) {
          setSelectedField(field)
          setIsEditDialogOpen(true)
        }
        break
      case 'activate':
        setFields(fields.map(field =>
          field.id === fieldId ? { ...field, status: 'available' as const } : field
        ))
        break
      case 'deactivate':
        setFields(fields.map(field =>
          field.id === fieldId ? { ...field, status: 'unavailable' as const } : field
        ))
        break
      case 'verify':
        setFields(fields.map(field =>
          field.id === fieldId ? { ...field, isVerified: true } : field
        ))
        break
      case 'delete':
        setFields(fields.filter(field => field.id !== fieldId))
        break
      default:
        console.log(`${action} field ${fieldId}`)
    }
  }

  const handleCreateField = (formData: any) => {
    const newField: AdminField = {
      id: (Math.max(...fields.map(f => parseInt(f.id))) + 1).toString(),
      name: formData.name,
      location: formData.location,
      price: formData.price,
      rating: 0,
      image: "/placeholder.svg",
      sport: formData.sport,
      amenities: formData.amenities,
      description: formData.description,
      status: formData.status,
      openingHours: formData.openingHours,
      closingHours: formData.closingHours,
      surfaceType: formData.surfaceType,
      capacity: formData.capacity,
      phone: formData.phone,
      email: formData.email,
      reviewCount: 0,
      isVerified: false,
      bookingsThisMonth: 0,
      revenueThisMonth: 0,
      lastBooking: new Date().toISOString().split('T')[0],
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone
    }
    setFields([...fields, newField])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateField = (formData: any) => {
    if (!selectedField) return

    setFields(fields.map(f => f.id === selectedField.id ? {
      ...f,
      name: formData.name,
      location: formData.location,
      price: formData.price,
      sport: formData.sport,
      description: formData.description,
      status: formData.status,
      openingHours: formData.openingHours,
      closingHours: formData.closingHours,
      surfaceType: formData.surfaceType,
      capacity: formData.capacity,
      phone: formData.phone,
      email: formData.email,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      amenities: formData.amenities
    } : f))
    setIsEditDialogOpen(false)
    setSelectedField(null)
  }

  // Filter options
  const filterOptions = [
    {
      key: 'status',
      placeholder: 'Trạng thái',
      value: statusFilter,
      onValueChange: setStatusFilter,
      options: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'available', label: 'Hoạt động' },
        { value: 'unavailable', label: 'Không khả dụng' },
        { value: 'maintenance', label: 'Bảo trì' }
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
        { value: 'bóng rổ', label: 'Bóng rổ' },
        { value: 'bơi lội', label: 'Bơi lội' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Quản lý sân thể thao"
        description="Quản lý thông tin và hoạt động của các sân thể thao"
        actionButton={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Thêm sân mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm sân thể thao mới</DialogTitle>
                <DialogDescription>
                  Tạo thông tin sân thể thao mới trong hệ thống
                </DialogDescription>
              </DialogHeader>
              <FieldForm
                onSubmit={handleCreateField}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats Cards */}
      <FieldStats fields={fields} />

      {/* Filters and Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sân thể thao</CardTitle>
          <CardDescription>
            Quản lý {filteredFields.length} sân thể thao trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminFilters
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterOptions}
          />

          <FieldTable
            fields={filteredFields}
            onFieldAction={handleFieldAction}
          />

          {filteredFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy sân thể thao nào phù hợp
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Field Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sân thể thao</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin sân thể thao
            </DialogDescription>
          </DialogHeader>
          {selectedField && (
            <FieldForm
              initialData={{
                name: selectedField.name,
                location: selectedField.location,
                price: selectedField.price,
                sport: selectedField.sport,
                description: selectedField.description,
                status: selectedField.status,
                openingHours: selectedField.openingHours,
                closingHours: selectedField.closingHours,
                surfaceType: selectedField.surfaceType,
                capacity: selectedField.capacity,
                phone: selectedField.phone,
                email: selectedField.email,
                ownerName: selectedField.ownerName,
                ownerPhone: selectedField.ownerPhone,
                amenities: selectedField.amenities
              }}
              onSubmit={handleUpdateField}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedField(null)
              }}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Field Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sân thể thao</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết sân thể thao
            </DialogDescription>
          </DialogHeader>
          {selectedField && <FieldDetail field={selectedField} />}
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