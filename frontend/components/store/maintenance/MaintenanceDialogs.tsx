import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Edit,
    Trash2,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Wrench,
    DollarSign,
    FileText,
    Camera,
    Upload
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Edit Maintenance Dialog
export function EditMaintenanceDialog({ maintenance, trigger }: { maintenance: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(maintenance.status || 'pending')
    const [priority, setPriority] = useState(maintenance.priority || 'medium')
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
        maintenance.scheduledDate ? new Date(maintenance.scheduledDate) : undefined
    )

    const handleSubmit = () => {
        console.log('Updating maintenance:', maintenance.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa bảo trì #{maintenance.id}</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin chi tiết về công việc bảo trì
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Field Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <div>
                                <p className="font-medium">{maintenance.field?.name}</p>
                                <p className="text-sm text-gray-600">{maintenance.field?.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Tiêu đề công việc</Label>
                            <Input id="edit-title" defaultValue={maintenance.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả chi tiết</Label>
                            <Textarea
                                id="edit-description"
                                defaultValue={maintenance.description}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Trạng thái</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Chờ thực hiện</SelectItem>
                                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Độ ưu tiên</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Thấp</SelectItem>
                                    <SelectItem value="medium">Trung bình</SelectItem>
                                    <SelectItem value="high">Cao</SelectItem>
                                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Loại bảo trì</Label>
                            <Select defaultValue={maintenance.type}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Định kỳ</SelectItem>
                                    <SelectItem value="emergency">Khẩn cấp</SelectItem>
                                    <SelectItem value="preventive">Phòng ngừa</SelectItem>
                                    <SelectItem value="repair">Sửa chữa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ngày lên lịch</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {scheduledDate ? format(scheduledDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-estimated-duration">Thời gian dự kiến (giờ)</Label>
                            <Input
                                id="edit-estimated-duration"
                                type="number"
                                defaultValue={maintenance.estimatedDuration}
                            />
                        </div>
                    </div>

                    {/* Cost and Technician */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-estimated-cost">Chi phí dự kiến (VNĐ)</Label>
                            <Input
                                id="edit-estimated-cost"
                                type="number"
                                defaultValue={maintenance.estimatedCost}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-assigned-technician">Kỹ thuật viên</Label>
                            <Select defaultValue={maintenance.assignedTechnician?.id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kỹ thuật viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Nguyễn Văn A</SelectItem>
                                    <SelectItem value="2">Trần Thị B</SelectItem>
                                    <SelectItem value="3">Lê Văn C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Ghi chú thêm</Label>
                        <Textarea
                            id="edit-notes"
                            defaultValue={maintenance.notes}
                            placeholder="Thêm ghi chú về công việc bảo trì..."
                            rows={2}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Delete Maintenance Dialog
export function DeleteMaintenanceDialog({ maintenance, trigger }: { maintenance: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        console.log('Deleting maintenance:', maintenance.id)
        setOpen(false)
    }

    const isInProgress = maintenance.status === 'in_progress'
    const isCompleted = maintenance.status === 'completed'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Xác nhận xóa bảo trì</span>
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa công việc bảo trì <strong>#{maintenance.id}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Maintenance Info */}
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <p><strong>Tiêu đề:</strong> {maintenance.title}</p>
                        <p><strong>Sân:</strong> {maintenance.field?.name}</p>
                        <p><strong>Trạng thái:</strong> {maintenance.status}</p>
                        <p><strong>Kỹ thuật viên:</strong> {maintenance.assignedTechnician?.name || 'Chưa phân công'}</p>
                        {maintenance.estimatedCost && (
                            <p><strong>Chi phí dự kiến:</strong> {maintenance.estimatedCost.toLocaleString()}đ</p>
                        )}
                    </div>

                    {/* Warnings */}
                    {(isInProgress || isCompleted) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">Lưu ý:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                {isInProgress && <li>• Công việc đang được thực hiện</li>}
                                {isCompleted && <li>• Công việc đã hoàn thành</li>}
                                <li>• Lịch sử bảo trì sẽ bị mất</li>
                                <li>• Báo cáo thống kê có thể bị ảnh hưởng</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa bảo trì
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Complete Maintenance Dialog
export function CompleteMaintenanceDialog({ maintenance, trigger }: { maintenance: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [actualCost, setActualCost] = useState('')
    const [completionNotes, setCompletionNotes] = useState('')

    const handleComplete = () => {
        console.log('Completing maintenance:', maintenance.id, {
            actualCost,
            completionNotes
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Hoàn thành bảo trì</span>
                    </DialogTitle>
                    <DialogDescription>
                        Xác nhận hoàn thành công việc bảo trì <strong>#{maintenance.id}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Maintenance Info */}
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                        <p><strong>Tiêu đề:</strong> {maintenance.title}</p>
                        <p><strong>Sân:</strong> {maintenance.field?.name}</p>
                        <p><strong>Chi phí dự kiến:</strong> {maintenance.estimatedCost?.toLocaleString()}đ</p>
                    </div>

                    {/* Actual Cost */}
                    <div className="space-y-2">
                        <Label htmlFor="actual-cost">Chi phí thực tế (VNĐ)</Label>
                        <Input
                            id="actual-cost"
                            type="number"
                            value={actualCost}
                            onChange={(e) => setActualCost(e.target.value)}
                            placeholder="Nhập chi phí thực tế..."
                        />
                    </div>

                    {/* Completion Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="completion-notes">Ghi chú hoàn thành</Label>
                        <Textarea
                            id="completion-notes"
                            value={completionNotes}
                            onChange={(e) => setCompletionNotes(e.target.value)}
                            placeholder="Mô tả công việc đã thực hiện, vấn đề gặp phải..."
                            rows={4}
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <Label>Hình ảnh hoàn thành (tùy chọn)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Camera className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Tải lên hình ảnh sau khi bảo trì</p>
                            <Button variant="outline" size="sm" className="mt-2">
                                <Upload className="h-4 w-4 mr-2" />
                                Chọn file
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Hoàn thành
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Quick Actions for Maintenance
export function MaintenanceQuickActions({ maintenance }: { maintenance: any }) {
    const canStart = maintenance.status === 'pending'
    const canComplete = maintenance.status === 'in_progress'
    const canEdit = ['pending', 'in_progress'].includes(maintenance.status)

    return (
        <div className="flex items-center space-x-2">
            {canStart && (
                <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                    Bắt đầu
                </Button>
            )}
            {canComplete && (
                <CompleteMaintenanceDialog
                    maintenance={maintenance}
                    trigger={
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                            Hoàn thành
                        </Button>
                    }
                />
            )}
            {canEdit && (
                <EditMaintenanceDialog
                    maintenance={maintenance}
                    trigger={
                        <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                        </Button>
                    }
                />
            )}
            <DeleteMaintenanceDialog
                maintenance={maintenance}
                trigger={
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                }
            />
        </div>
    )
}