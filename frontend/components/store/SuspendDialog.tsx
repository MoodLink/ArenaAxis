'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, AlertTriangle } from 'lucide-react';
import { suspendStore, SuspendStoreRecord } from '@/services/suspend.service';

interface SuspendDialogProps {
    isOpen: boolean;
    onClose: () => void;
    storeId: string;
    storeName: string;
    onSuccess: (record: SuspendStoreRecord) => void;
    onConflict: (conflicts: SuspendStoreRecord[]) => void;
}

export default function SuspendDialog({
    isOpen,
    onClose,
    storeId,
    storeName,
    onSuccess,
    onConflict,
}: SuspendDialogProps) {
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [reason, setReason] = useState('');
    const [force, setForce] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDateTimeForInput = (dateString: string): string => {
        if (!dateString) return '';
        // Convert yyyy/MM/dd HH:mm:ss to datetime-local format (yyyy-MM-ddThh:mm)
        const date = new Date(dateString.replace(/\//g, '-'));
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDateTimeForAPI = (inputValue: string): string => {
        if (!inputValue) return '';
        // Convert datetime-local format (yyyy-MM-ddThh:mm) to yyyy/MM/dd HH:mm:ss
        const [date, time] = inputValue.split('T');
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        return `${year}/${month}/${day} ${hours}:${minutes}:00`;
    };

    const handleSubmit = async () => {
        // Validation
        if (!startAt || !endAt || !reason.trim()) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const startDate = new Date(startAt);
        const endDate = new Date(endAt);

        if (startDate >= endDate) {
            setError('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formattedStartAt = formatDateTimeForAPI(startAt);
            const formattedEndAt = formatDateTimeForAPI(endAt);

            const response = await suspendStore({
                storeId,
                startAt: formattedStartAt,
                endAt: formattedEndAt,
                reason,
                force,
            });

            onSuccess(response);
            resetForm();
            onClose();
        } catch (err: any) {
            if (err.conflicts) {
                // Handle conflict - show conflicting records to user
                onConflict(err.conflicts);
            }
            setError(err.message || 'Có lỗi xảy ra khi tạm dừng cửa hàng');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setStartAt('');
        setEndAt('');
        setReason('');
        setForce(false);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạm dừng cửa hàng</DialogTitle>
                    <DialogDescription>
                        Tạm dừng hoạt động của <span className="font-semibold text-gray-900">{storeName}</span>
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4 py-4">
                    {/* Start Time */}
                    <div className="space-y-2">
                        <Label htmlFor="startAt">
                            Thời gian bắt đầu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="startAt"
                            type="datetime-local"
                            value={startAt}
                            onChange={(e) => setStartAt(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500">
                            Định dạng: yyyy-MM-dd HH:mm
                        </p>
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                        <Label htmlFor="endAt">
                            Thời gian kết thúc <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="endAt"
                            type="datetime-local"
                            value={endAt}
                            onChange={(e) => setEndAt(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500">
                            Để trống nếu tạm dừng không xác định thời gian kết thúc
                        </p>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Lý do <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Nhập lý do tạm dừng..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    {/* Force Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="force"
                            checked={force}
                            onCheckedChange={(checked) => setForce(checked as boolean)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="force" className="cursor-pointer flex-1">
                            <span className="font-medium">Buộc tạm dừng</span>
                            <p className="text-xs text-gray-500">
                                Bỏ qua kiểm tra xung đột với các đơn hàng hiện có
                            </p>
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Tạm dừng'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
