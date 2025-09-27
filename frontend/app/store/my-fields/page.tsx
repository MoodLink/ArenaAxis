"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  Clock,
  Users,
  Camera,
  Wifi,
  Car,
  Coffee,
  WashingMachine,
  Lightbulb,
  Shield,
  Activity
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ViewFieldDialog, EditFieldDialog, DeleteFieldDialog } from '@/components/store/fields/FieldDialogs'

// Types
type FieldType = 'football' | 'tennis' | 'badminton' | 'basketball' | 'volleyball'
type FieldStatus = 'active' | 'inactive' | 'maintenance'

interface Field {
  id: number
  name: string
  type: FieldType
  size: string
  status: FieldStatus
  location: string
  pricePerHour: number
  rating: number
  totalBookings: number
  revenueThisMonth: number
  images: string[]
  amenities: string[]
  description: string
  availableHours: string
  lastMaintenance: string
}

// Mock data
const myFields: Field[] = [
  {
    id: 1,
    name: 'Sân bóng đá 1',
    type: 'football',
    size: '11 người',
    status: 'active',
    location: 'Khu A - Tầng 1',
    pricePerHour: 200000,
    rating: 4.8,
    totalBookings: 156,
    revenueThisMonth: 8500000,
    images: ['/green-football-field.png', '/professional-football-field.png'],
    amenities: ['wifi', 'parking', 'shower', 'lighting'],
    description: 'Sân bóng đá cỏ nhân tạo chất lượng cao, đầy đủ tiện nghi',
    availableHours: '06:00-22:00',
    lastMaintenance: '2024-12-15'
  },
  {
    id: 2,
    name: 'Sân bóng đá 2',
    type: 'football',
    size: '7 người',
    status: 'active',
    location: 'Khu A - Tầng 1',
    pricePerHour: 150000,
    rating: 4.6,
    totalBookings: 142,
    revenueThisMonth: 7200000,
    images: ['/modern-football-turf-field.png'],
    amenities: ['wifi', 'parking', 'lighting'],
    description: 'Sân bóng đá mini phù hợp cho các trận đấu nhỏ',
    availableHours: '06:00-22:00',
    lastMaintenance: '2024-12-10'
  },
  {
    id: 3,
    name: 'Sân tennis 1',
    type: 'tennis',
    size: 'Đơn/Đôi',
    status: 'maintenance',
    location: 'Khu B - Tầng 2',
    pricePerHour: 120000,
    rating: 4.5,
    totalBookings: 98,
    revenueThisMonth: 5400000,
    images: ['/outdoor-tennis-court.png'],
    amenities: ['lighting', 'seating'],
    description: 'Sân tennis chuyên nghiệp với mặt sân cao su',
    availableHours: '06:00-21:00',
    lastMaintenance: '2024-12-25'
  },
  {
    id: 4,
    name: 'Sân cầu lông 1',
    type: 'badminton',
    size: '4 người',
    status: 'active',
    location: 'Khu C - Tầng 3',
    pricePerHour: 80000,
    rating: 4.9,
    totalBookings: 203,
    revenueThisMonth: 9800000,
    images: ['/badminton-court.png'],
    amenities: ['wifi', 'air-conditioning', 'seating'],
    description: 'Sân cầu lông trong nhà, điều hòa mát mẻ',
    availableHours: '06:00-23:00',
    lastMaintenance: '2024-12-20'
  },
  {
    id: 5,
    name: 'Sân bóng rổ 1',
    type: 'basketball',
    size: '10 người',
    status: 'inactive',
    location: 'Khu D - Tầng 1',
    pricePerHour: 100000,
    rating: 4.3,
    totalBookings: 76,
    revenueThisMonth: 3200000,
    images: ['/outdoor-basketball-court.png'],
    amenities: ['lighting', 'seating'],
    description: 'Sân bóng rổ ngoài trời với vành bóng chuyên nghiệp',
    availableHours: '06:00-20:00',
    lastMaintenance: '2024-12-05'
  }
]

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  shower: WashingMachine,
  lighting: Lightbulb,
  'air-conditioning': Coffee,
  seating: Users,
  security: Shield
}

const amenityLabels = {
  wifi: 'WiFi',
  parking: 'Bãi đỗ xe',
  shower: 'Phòng tắm',
  lighting: 'Đèn chiếu sáng',
  'air-conditioning': 'Điều hòa',
  seating: 'Khu vực nghỉ ngơi',
  security: 'An ninh 24/7'
}

const fieldTypes: Record<FieldType, string> = {
  football: 'Bóng đá',
  tennis: 'Tennis',
  badminton: 'Cầu lông',
  basketball: 'Bóng rổ',
  volleyball: 'Bóng chuyền'
}

function FieldCard({ field }: { field: Field }) {
  const statusColors: Record<FieldStatus, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-orange-100 text-orange-800'
  }

  const statusLabels: Record<FieldStatus, string> = {
    active: 'Hoạt động',
    inactive: 'Tạm ngừng',
    maintenance: 'Bảo trì'
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-gray-200">
        {field.images[0] && (
          <img
            src={field.images[0]}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2">
          <Badge className={statusColors[field.status]}>
            {statusLabels[field.status]}
          </Badge>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {fieldTypes[field.type]}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{field.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{field.location}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ViewFieldDialog
                field={field}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </DropdownMenuItem>
                }
              />
              <EditFieldDialog
                field={field}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                }
              />
              <DeleteFieldDialog
                field={field}
                trigger={
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{field.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({field.totalBookings} đánh giá)</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{field.pricePerHour.toLocaleString()}đ/giờ</p>
            <p className="text-xs text-gray-500">{field.size}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Doanh thu tháng này</span>
            <span className="font-medium text-blue-900">{field.revenueThisMonth.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-3">
          {field.amenities.slice(0, 3).map((amenity: string) => {
            const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
            return (
              <div key={amenity} className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                {Icon && <Icon className="h-3 w-3 mr-1 text-gray-600" />}
                <span className="text-xs text-gray-600">{amenityLabels[amenity as keyof typeof amenityLabels]}</span>
              </div>
            )
          })}
          {field.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{field.amenities.length - 3} khác
            </Badge>
          )}
        </div>

        {/* Hours and Maintenance */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{field.availableHours}</span>
          </div>
          <span>Bảo trì: {field.lastMaintenance}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function AddFieldDialog() {
  const [open, setOpen] = useState(false)
  const [fieldType, setFieldType] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sân mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sân thể thao mới</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết về sân thể thao mới của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Tên sân</Label>
              <Input id="field-name" placeholder="Nhập tên sân" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-type">Loại sân</Label>
              <Select value={fieldType} onValueChange={setFieldType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sân" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="football">Bóng đá</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
                  <SelectItem value="badminton">Cầu lông</SelectItem>
                  <SelectItem value="basketball">Bóng rổ</SelectItem>
                  <SelectItem value="volleyball">Bóng chuyền</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field-size">Kích thước/Số người</Label>
              <Input id="field-size" placeholder="VD: 11 người, Đơn/Đôi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-location">Vị trí</Label>
              <Input id="field-location" placeholder="VD: Khu A - Tầng 1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price-per-hour">Giá thuê/giờ (VNĐ)</Label>
              <Input id="price-per-hour" type="number" placeholder="200000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available-hours">Giờ hoạt động</Label>
              <Input id="available-hours" placeholder="06:00-22:00" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về sân thể thao..."
              rows={3}
            />
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Tiện nghi</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(amenityLabels).map(([key, label]) => {
                const Icon = amenityIcons[key as keyof typeof amenityIcons]
                const isSelected = selectedAmenities.includes(key)

                return (
                  <div key={key} className="flex items-center space-x-3">
                    <Switch
                      id={key}
                      checked={isSelected}
                      onCheckedChange={() => toggleAmenity(key)}
                    />
                    <Label htmlFor={key} className="flex items-center cursor-pointer">
                      {Icon && <Icon className="h-4 w-4 mr-2 text-gray-600" />}
                      {label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Hình ảnh sân</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Kéo thả hoặc click để tải lên hình ảnh</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 5MB</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3">
            <Switch id="active-status" defaultChecked />
            <Label htmlFor="active-status">Kích hoạt sân ngay sau khi tạo</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => setOpen(false)}>
              Tạo sân
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MyFields() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredFields = myFields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || field.status === statusFilter
    const matchesType = typeFilter === 'all' || field.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: myFields.length,
    active: myFields.filter(f => f.status === 'active').length,
    inactive: myFields.filter(f => f.status === 'inactive').length,
    maintenance: myFields.filter(f => f.status === 'maintenance').length,
    totalRevenue: myFields.reduce((sum, field) => sum + field.revenueThisMonth, 0)
  }

  return (
    <StoreLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sân của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả sân thể thao</p>
          </div>
          <AddFieldDialog />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Tổng số sân</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-gray-600">Hoạt động</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                <p className="text-sm text-gray-600">Tạm ngừng</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
                <p className="text-sm text-gray-600">Bảo trì</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{stats.totalRevenue.toLocaleString()}đ</p>
                <p className="text-sm text-gray-600">Doanh thu tháng</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Tìm kiếm sân..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm ngừng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Loại sân" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="football">Bóng đá</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="badminton">Cầu lông</SelectItem>
                    <SelectItem value="basketball">Bóng rổ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>

        {filteredFields.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân nào</h3>
              <p className="text-gray-600 mb-6">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setTypeFilter('all')
              }}>
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </StoreLayout>
  )
}