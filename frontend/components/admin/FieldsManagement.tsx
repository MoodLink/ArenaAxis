"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import FieldTable from "./fields/FieldTable"
import FieldStats from "./fields/FieldStats"
import FieldForm from "./fields/FieldForm"
import FieldDetail from "./fields/FieldDetail"
import { FieldService, Field } from "@/services/field.service"
import { AdminField } from "@/data/mockDataAdmin"

// Helper function để fetch store name từ storeId
const fetchStoreName = async (storeId: string): Promise<string> => {
  try {
    // Thử API: /api/stores/{storeId} hoặc /api/v1/stores/{storeId}
    const response = await fetch(`/api/v1/stores/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data?.data?.name || data?.name || storeId
    }

    // Fallback: thử API route khác
    return storeId
  } catch (error) {
    console.error('Error fetching store name:', error)
    return storeId
  }
}

export default function FieldsManagement() {
  const [fields, setFields] = useState<Field[]>([])
  const [stores, setStores] = useState<Map<string, string>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await FieldService.getFields()
      setFields(response.data || [])

      // Fetch store names từ storeId
      const storeMap = new Map<string, string>()
      if (response.data) {
        // Collect unique storeIds
        const uniqueStoreIds = [...new Set(response.data.map(f => f.storeId))]

        // Fetch store names in parallel
        const storePromises = uniqueStoreIds.map(async (storeId) => {
          const storeName = await fetchStoreName(storeId)
          return { storeId, storeName }
        })

        const storeResults = await Promise.all(storePromises)

        // Build map
        storeResults.forEach(({ storeId, storeName }) => {
          storeMap.set(storeId, storeName)
        })
      }
      setStores(storeMap)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Lỗi khi tải dữ liệu sân"
      setError(errorMessage)
      console.error("Error fetching fields:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFields = fields.filter(field => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      (field.name?.toLowerCase().includes(searchLower) ?? false) ||
      (field.address?.toLowerCase().includes(searchLower) ?? false) ||
      (field.sport_name?.toLowerCase().includes(searchLower) ?? false)

    const isActive = field.activeStatus ?? false
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && isActive) ||
      (statusFilter === "unavailable" && !isActive)

    return matchesSearch && matchesStatus
  })

  const handleEdit = (fieldId: string) => {
    const field = fields.find(f => f._id === fieldId)
    if (field) {
      setSelectedField(field)
      setIsEditDialogOpen(true)
    }
  }

  const handleDelete = async (fieldId: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sân này?")) {
      try {
        await FieldService.deleteField(fieldId)
        setFields(fields.filter(f => f._id !== fieldId))
        setActionSuccess("Đã xóa sân thành công")
        setTimeout(() => setActionSuccess(null), 3000)
      } catch (err) {
        setActionError("Lỗi khi xóa sân: " + (err instanceof Error ? err.message : "Unknown error"))
      }
    }
  }

  const handleToggleStatus = async (fieldId: string, currentStatus: boolean) => {
    try {
      const updatedField = await FieldService.toggleFieldStatus(fieldId, currentStatus)
      setFields(fields.map(f => (f._id === fieldId ? updatedField.data : f)))
      setActionSuccess("Đã cập nhật trạng thái sân thành công")
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      setActionError("Lỗi khi cập nhật trạng thái: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const handleFieldAction = (fieldId: string, action: 'view' | 'edit' | 'activate' | 'deactivate' | 'delete') => {
    const field = fields.find(f => f._id === fieldId)

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
        handleToggleStatus(fieldId, false)
        break
      case 'deactivate':
        handleToggleStatus(fieldId, true)
        break
      case 'delete':
        handleDelete(fieldId)
        break
      default:
        console.log(`${action} field ${fieldId}`)
    }
  }

  const handleCreateField = async (formData: any) => {
    try {
      const newFieldData = {
        sport_id: formData.sport || "badminton",
        store_id: formData.storeId || "default-store",
        default_price: String(formData.price || "0"),
        name: formData.name || "Tên sân",
        sport_name: formData.sport || "Badminton",
        address: formData.location || "Địa chỉ sân",
        avatar: formData.image || "/placeholder.svg",
        cover_image: "/placeholder.svg",
        rating: 0
      }

      const response = await FieldService.createField(newFieldData)
      setFields([...fields, response.data])
      setIsCreateDialogOpen(false)
      alert("✅ Tạo sân thành công!")
    } catch (err) {
      alert("❌ Lỗi khi tạo sân: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const handleUpdateField = async (formData: any) => {
    if (!selectedField) return

    try {
      const updateData = {
        sport_id: formData.sport || selectedField.sportId,
        store_id: selectedField.storeId,
        default_price: String(formData.price || selectedField.defaultPrice),
        name: formData.name || selectedField.name,
        sport_name: formData.sport || selectedField.sport_name,
        address: formData.location || selectedField.address
      }

      const response = await FieldService.updateField(selectedField._id, updateData)
      setFields(fields.map(f => (f._id === selectedField._id ? response.data : f)))
      setIsEditDialogOpen(false)
      setSelectedField(null)
      alert("✅ Cập nhật sân thành công!")
    } catch (err) {
      alert("❌ Lỗi khi cập nhật sân: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const filterOptions = [
    {
      key: "status",
      placeholder: "Trạng thái",
      value: statusFilter,
      onValueChange: setStatusFilter,
      options: [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "available", label: "Hoạt động" },
        { value: "unavailable", label: "Tạm ngưng" }
      ]
    }
  ]

  // Map fields to AdminField format - chỉ lấy dữ liệu thực từ server
  const mapFieldToAdminField = (field: Field): AdminField => {
    return {
      ...field,
      id: field._id,
      name: field.name || "",
      sport_name: field.sport_name || "",
      price: Number(field.defaultPrice) || 0,
      rating: field.rating || 0,
      status: field.activeStatus ? 'available' : 'unavailable',
      createdAt: field.createdAt,
      // Lấy tên chủ sân từ stores map (store name, không phải ID)
      ownerName: stores.get(field.storeId) || field.storeId || "Chưa cập nhật",
      // Bỏ các dữ liệu không cần thiết từ server
      bookingsThisMonth: 0,
      revenueThisMonth: 0,
      lastBooking: "",
      ownerPhone: ""
    } as unknown as AdminField
  }

  const fieldsForTable = fields.map(mapFieldToAdminField)
  const filteredFieldsForTable = filteredFields.map(mapFieldToAdminField)

  return (
    <div className="space-y-6">
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
                <DialogDescription>Tạo thông tin sân thể thao mới trong hệ thống</DialogDescription>
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
      {!isLoading && <FieldStats fields={fieldsForTable} />}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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

      {/* Filters and Table */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sân thể thao</CardTitle>
            <CardDescription>
              {`Quản lý ${filteredFields.length} sân thể thao trong hệ thống`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdminFilters
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filterOptions}
            />

            <FieldTable
              fields={filteredFieldsForTable}
              onFieldAction={handleFieldAction}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Field Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sân thể thao</DialogTitle>
            <DialogDescription>Cập nhật thông tin sân thể thao</DialogDescription>
          </DialogHeader>
          {selectedField && (
            <FieldForm
              initialData={{
                name: selectedField.name ?? "",
                location: selectedField.address ?? "",
                price: Number(selectedField.defaultPrice) || 0,
                sport: selectedField.sport_name ?? "",
                description: "",
                status: "available",
                openingHours: "",
                closingHours: "",
                surfaceType: "",
                capacity: "",
                phone: "",
                email: "",
                ownerName: "",
                ownerPhone: "",
                amenities: []
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thông tin chi tiết sân thể thao</DialogTitle>
            <DialogDescription>Xem chi tiết thông tin sân</DialogDescription>
          </DialogHeader>
          {selectedField && (
            <FieldDetail field={mapFieldToAdminField(selectedField)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
