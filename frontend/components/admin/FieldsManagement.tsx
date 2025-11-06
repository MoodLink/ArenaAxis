"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import FieldCard from "./fields/FieldCard"
import FieldForm from "./fields/FieldForm"
import { FieldService, Field } from "@/services/field.service"

export default function FieldsManagement() {
  const [fields, setFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<Field | null>(null)

  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await FieldService.getFields()
      setFields(response.data || [])
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
      } catch (err) {
        alert("Lỗi khi xóa sân: " + (err instanceof Error ? err.message : "Unknown error"))
      }
    }
  }

  const handleToggleStatus = async (fieldId: string, currentStatus: boolean) => {
    try {
      const updatedField = await FieldService.toggleFieldStatus(fieldId, currentStatus)
      setFields(fields.map(f => (f._id === fieldId ? updatedField.data : f)))
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái: " + (err instanceof Error ? err.message : "Unknown error"))
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
        { value: "unavailable", label: "Không khả dụng" }
      ]
    }
  ]

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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sân thể thao</CardTitle>
          <CardDescription>
            {isLoading ? "Đang tải..." : `Quản lý ${filteredFields.length} sân thể thao trong hệ thống`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminFilters
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterOptions}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredFields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy sân thể thao nào phù hợp
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFields.map(field => (
                <FieldCard
                  key={field._id}
                  field={field}
                  onView={() => { }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  )
}
