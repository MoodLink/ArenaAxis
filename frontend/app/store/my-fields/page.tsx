"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  Activity,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Power,
  PowerOff
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ViewFieldDialog } from '@/components/store/fields/FieldDialogs'
import { FieldService, Field as APIField } from '@/services/field.service'
import { StoreService } from '@/services/store.service'
import { getStoresByOwnerId, getMyProfile, getSports } from '@/services/api-new'
import { StoreAdminDetailResponse, Sport } from '@/types'

type FieldStatus = 'available' | 'unavailable' | 'maintenance'

const statusColors: Record<FieldStatus, string> = {
  available: 'bg-green-100 text-green-800',
  unavailable: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-orange-100 text-orange-800'
}

const statusLabels: Record<FieldStatus, string> = {
  available: 'Hoạt động',
  unavailable: 'Tạm ngừng',
  maintenance: 'Bảo trì'
}

export default function MyFields() {
  const [fields, setFields] = useState<APIField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sportFilter, setSportFilter] = useState('all')
  const [storeFilter, setStoreFilter] = useState('all')

  const [myStores, setMyStores] = useState<StoreAdminDetailResponse[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const { toast } = useToast()

  // Create Dialog State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    sport_id: '',
    store_id: '',
    default_price: '',
    name: '',
    sport_name: '',
    address: '',
  })

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<APIField | null>(null)
  const [editForm, setEditForm] = useState({
    sport_id: '',
    store_id: '',
    default_price: '',
    name: '',
    sport_name: '',
    address: '',
  })

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Lấy danh sách tất cả sports
      const sportsData = await getSports()
      setSports(sportsData)

      const authToken = StoreService.getAuthToken()
      if (!authToken) {
        setError('Vui lòng đăng nhập để xem danh sách sân.')
        setLoading(false)
        return
      }

      // Lấy owner ID từ profile
      const currentUser = await getMyProfile()
      if (!currentUser?.id) {
        setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.')
        setLoading(false)
        return
      }

      // Lấy danh sách tất cả stores của owner
      const storesData = await getStoresByOwnerId(currentUser.id)

      if (!storesData || storesData.length === 0) {
        setError('Bạn chưa có cửa hàng nào. Hãy tạo cửa hàng để quản lý sân.')
        setLoading(false)
        return
      }

      setMyStores(storesData)

      // Lấy fields của TẤT CẢ stores
      const allFieldsPromises = storesData.map((store: StoreAdminDetailResponse) =>
        FieldService.getFieldsByStore(store.id)
      )

      const allFieldsResponses = await Promise.all(allFieldsPromises)
      const allFields = allFieldsResponses.flatMap((response: any) => response.data || [])

      setFields(allFields)
    } catch (err) {
      console.error('❌ Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // CREATE FIELD
  const handleCreateField = async () => {
    if (!createForm.sport_id || !createForm.store_id || !createForm.default_price) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ: Môn thể thao, Cửa hàng, Giá tiền',
        variant: 'destructive',
      })
      return
    }

    try {
      await FieldService.createField({
        sport_id: createForm.sport_id,
        store_id: createForm.store_id,
        default_price: createForm.default_price,
        name: createForm.name || undefined,
        sport_name: createForm.sport_name || undefined,
        address: createForm.address || undefined,
      })

      toast({
        title: 'Thành công ✅',
        description: 'Sân mới đã được tạo',
      })

      setIsCreateDialogOpen(false)
      setCreateForm({ sport_id: '', store_id: '', default_price: '', name: '', sport_name: '', address: '' })
      fetchData()
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể tạo sân',
        variant: 'destructive',
      })
    }
  }

  // UPDATE FIELD
  const handleUpdateField = async () => {
    if (!selectedField) return

    try {
      await FieldService.updateField(selectedField._id, {
        sport_id: editForm.sport_id || undefined,
        store_id: editForm.store_id || undefined,
        default_price: editForm.default_price || undefined,
        name: editForm.name || undefined,
        sport_name: editForm.sport_name || undefined,
        address: editForm.address || undefined,
      })

      toast({
        title: 'Thành công ✅',
        description: 'Sân đã được cập nhật',
      })

      setIsEditDialogOpen(false)
      setSelectedField(null)
      fetchData()
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật sân',
        variant: 'destructive',
      })
    }
  }

  // DELETE FIELD
  const handleDeleteField = async () => {
    if (!deleteFieldId) return

    try {
      await FieldService.deleteField(deleteFieldId)

      toast({
        title: 'Thành công ✅',
        description: 'Sân đã được xóa',
      })

      setIsDeleteDialogOpen(false)
      setDeleteFieldId(null)
      fetchData()
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể xóa sân',
        variant: 'destructive',
      })
    }
  }

  // TOGGLE STATUS
  const handleToggleStatus = async (field: APIField) => {
    try {
      await FieldService.toggleFieldStatus(field._id, field.activeStatus)

      toast({
        title: 'Thành công ✅',
        description: `Sân đã được ${field.activeStatus ? 'tắt' : 'bật'}`,
      })

      fetchData()
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật trạng thái',
        variant: 'destructive',
      })
    }
  }

  // OPEN EDIT DIALOG
  const openEditDialog = (field: APIField) => {
    setSelectedField(field)
    setEditForm({
      sport_id: field.sportId,
      store_id: field.storeId,
      default_price: field.defaultPrice,
      name: field.name || '',
      sport_name: field.sport_name || '',
      address: field.address || '',
    })
    setIsEditDialogOpen(true)
  }

  // NESTED FIELD CARD COMPONENT
  const FieldCard = ({ field, stores }: { field: APIField; stores: StoreAdminDetailResponse[] }) => {
    const status: FieldStatus = field.activeStatus ? 'available' : 'unavailable'
    const fieldStore = stores.find(s => s.id === field.storeId)

    return (
      <Link href={`/store/my-fields/${field._id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
          <div className="aspect-square relative bg-gray-200">
            {field.avatar && (
              <img src={field.avatar} alt={field.name || 'Field'} className="w-full h-full object-cover" />
            )}
            {!field.avatar && field.cover_image && (
              <img src={field.cover_image} alt={field.name || 'Field'} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-1 right-1">
              <Badge className={`${statusColors[status]} text-xs`}>{statusLabels[status]}</Badge>
            </div>
            <div className="absolute top-1 left-1 bg-black/50 text-white px-1.5 py-0.5 rounded text-xs">
              {field.sport_name || 'Thể thao'}
            </div>
          </div>

          <CardContent className="p-2">
            <div className="flex items-start justify-between gap-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-gray-900 line-clamp-2">{field.name || 'Sân'}</h3>
                {fieldStore && (
                  <div className="flex items-center text-xs text-blue-600 mt-0.5 line-clamp-1">
                    <ShoppingCart className="h-2.5 w-2.5 mr-0.5 flex-shrink-0" />
                    <span className="truncate font-medium">{fieldStore.name}</span>
                  </div>
                )}
                <div className="flex items-center text-xs text-gray-500 mt-0.5 line-clamp-1">
                  <MapPin className="h-2.5 w-2.5 mr-0.5 flex-shrink-0" />
                  <span className="truncate">{field.address || 'Chưa có địa chỉ'}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <ViewFieldDialog
                    field={field}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye className="h-3 w-3 mr-2" />
                        <span className="text-xs">Xem chi tiết</span>
                      </DropdownMenuItem>
                    }
                  />
                  <DropdownMenuItem onClick={() => openEditDialog(field)}>
                    <Edit className="h-3 w-3 mr-2" />
                    <span className="text-xs">Chỉnh sửa</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleStatus(field)}>
                    {field.activeStatus ? (
                      <>
                        <PowerOff className="h-3 w-3 mr-2" />
                        <span className="text-xs">Tắt</span>
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3 mr-2" />
                        <span className="text-xs">Bật</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      setDeleteFieldId(field._id)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    <span className="text-xs">Xóa</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between mt-1 pt-1 border-t">
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 text-yellow-400" />
                <span className="text-xs font-medium">{field.rating || 0}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-900">{parseFloat(field.defaultPrice || '0').toLocaleString()}đ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  const filteredFields = fields.filter(field => {
    const matchesSearch = !searchQuery ||
      field.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.address?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'available' && field.activeStatus) ||
      (statusFilter === 'unavailable' && !field.activeStatus)

    const matchesSport = sportFilter === 'all' ||
      field.sport_name?.toLowerCase() === sportFilter.toLowerCase()

    const matchesStore = storeFilter === 'all' ||
      field.storeId === storeFilter

    return matchesSearch && matchesStatus && matchesSport && matchesStore
  })

  const stats = {
    total: fields.length,
    active: fields.filter(f => f.activeStatus).length,
    inactive: fields.filter(f => !f.activeStatus).length,
  }

  if (loading) {
    return (
      <StoreLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu sân...</p>
          </div>
        </div>
      </StoreLayout>
    )
  }

  if (error) {
    return (
      <StoreLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchData}>Thử lại</Button>
            </CardContent>
          </Card>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sân</h1>
            <p className="text-gray-600 mt-1">
              {myStores.length > 0
                ? `Quản lý ${fields.length} sân từ ${myStores.length} cửa hàng`
                : 'Quản lý tất cả sân thể thao'}
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Thêm sân mới</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo sân mới</DialogTitle>
                <DialogDescription>Thêm một sân thể thao mới vào hệ thống</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Môn thể thao *</Label>
                    <Select value={createForm.sport_id} onValueChange={(value) => setCreateForm({ ...createForm, sport_id: value })}>
                      <SelectTrigger><SelectValue placeholder="Chọn môn thể thao" /></SelectTrigger>
                      <SelectContent>{sports.map((sport) => (<SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cửa hàng *</Label>
                    <Select value={createForm.store_id} onValueChange={(value) => setCreateForm({ ...createForm, store_id: value })}>
                      <SelectTrigger><SelectValue placeholder="Chọn cửa hàng" /></SelectTrigger>
                      <SelectContent>{myStores.map((store) => (<SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Giá tiền (VNĐ) *</Label>
                  <Input type="number" value={createForm.default_price} onChange={(e) => setCreateForm({ ...createForm, default_price: e.target.value })} placeholder="100000" />
                </div>
                <div>
                  <Label>Tên sân</Label>
                  <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Sân A, Sân B, ..." />
                </div>
                <div>
                  <Label>Tên môn thể thao</Label>
                  <Input value={createForm.sport_name} onChange={(e) => setCreateForm({ ...createForm, sport_name: e.target.value })} placeholder="Cầu lông, Bóng chuyền, ..." />
                </div>
                <div>
                  <Label>Địa chỉ</Label>
                  <Input value={createForm.address} onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })} placeholder="123 Đường ABC, Quận XYZ" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleCreateField} className="bg-green-600 hover:bg-green-700"><Plus className="h-4 w-4 mr-2" />Tạo sân</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><div className="text-center"><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-sm text-gray-600">Tổng số sân</p></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-center"><p className="text-2xl font-bold text-green-600">{stats.active}</p><p className="text-sm text-gray-600">Đang hoạt động</p></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-center"><p className="text-2xl font-bold text-gray-600">{stats.inactive}</p><p className="text-sm text-gray-600">Tạm ngừng</p></div></CardContent></Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input placeholder="Tìm kiếm sân theo tên hoặc địa chỉ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Hoạt động</SelectItem>
                    <SelectItem value="unavailable">Tạm ngừng</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sportFilter} onValueChange={setSportFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Môn thể thao" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả môn</SelectItem>
                    {sports.map((sport) => (<SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Cửa hàng" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cửa hàng</SelectItem>
                    {myStores.map((store) => (<SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fields Grid */}
        {filteredFields.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredFields.map((field) => (<FieldCard key={field._id} field={field} stores={myStores} />))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân nào</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' || sportFilter !== 'all' || storeFilter !== 'all'
                  ? 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác'
                  : 'Chưa có sân nào được tạo. Hãy thêm sân mới để bắt đầu!'}
              </p>
              {(searchQuery || statusFilter !== 'all' || sportFilter !== 'all' || storeFilter !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSportFilter('all'); setStoreFilter('all') }}>Xóa bộ lọc</Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sân</DialogTitle>
              <DialogDescription>Cập nhật thông tin sân thể thao</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Môn thể thao</Label>
                  <Select value={editForm.sport_id} onValueChange={(value) => setEditForm({ ...editForm, sport_id: value })}>
                    <SelectTrigger><SelectValue placeholder="Chọn môn thể thao" /></SelectTrigger>
                    <SelectContent>{sports.map((sport) => (<SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cửa hàng</Label>
                  <Select value={editForm.store_id} onValueChange={(value) => setEditForm({ ...editForm, store_id: value })}>
                    <SelectTrigger><SelectValue placeholder="Chọn cửa hàng" /></SelectTrigger>
                    <SelectContent>{myStores.map((store) => (<SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Giá tiền (VNĐ)</Label>
                <Input type="number" value={editForm.default_price} onChange={(e) => setEditForm({ ...editForm, default_price: e.target.value })} placeholder="100000" />
              </div>
              <div>
                <Label>Tên sân</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Sân A, Sân B, ..." />
              </div>
              <div>
                <Label>Tên môn thể thao</Label>
                <Input value={editForm.sport_name} onChange={(e) => setEditForm({ ...editForm, sport_name: e.target.value })} placeholder="Cầu lông, Bóng chuyền, ..." />
              </div>
              <div>
                <Label>Địa chỉ</Label>
                <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder="123 Đường ABC, Quận XYZ" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleUpdateField} className="bg-blue-600 hover:bg-blue-700"><Edit className="h-4 w-4 mr-2" />Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa sân</DialogTitle>
              <DialogDescription>Bạn có chắc chắn muốn xóa sân này? Hành động này không thể hoàn tác.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleDeleteField} className="bg-red-600 hover:bg-red-700"><Trash2 className="h-4 w-4 mr-2" />Xóa sân</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </StoreLayout>
  )
}
