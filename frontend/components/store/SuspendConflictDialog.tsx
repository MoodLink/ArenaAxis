'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, MapPin, User, ShoppingBag } from 'lucide-react';
import type { SuspendStoreRecord, OrderConflict } from '@/services/suspend.service';

interface SuspendConflictDialogProps {
    isOpen: boolean;
    onClose: () => void;
    conflicts: (SuspendStoreRecord | OrderConflict)[];
    onForceRetry: () => void;
    isLoading?: boolean;
}

// Type guards
const isOrderConflict = (conflict: any): conflict is OrderConflict => {
    return 'orderCode' in conflict && 'orderDetails' in conflict;
};

const isSuspendConflict = (conflict: any): conflict is SuspendStoreRecord => {
    return 'operator' in conflict && !('orderCode' in conflict);
};

export default function SuspendConflictDialog({
    isOpen,
    onClose,
    conflicts,
    onForceRetry,
    isLoading = false,
}: SuspendConflictDialogProps) {
    const formatDateTime = (dateTimeString: string): string => {
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateTimeString;
        }
    };

    const formatTime = (timeString: string): string => {
        try {
            const date = new Date(timeString);
            return date.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return timeString;
        }
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        {conflicts.some(c => isOrderConflict(c))
                            ? 'Có đơn đặt sân trong khoảng thời gian này'
                            : 'Tạm dừng bị trùng thời gian'}
                    </DialogTitle>
                    <DialogDescription>
                        {conflicts.some(c => isOrderConflict(c))
                            ? 'Khoảng thời gian tạm dừng xung đột với các đơn đặt sân hiện có. Vui lòng xem chi tiết:'
                            : 'Khoảng thời gian tạm dừng xung đột với các lần tạm dừng đã tồn tại. Vui lòng xem chi tiết:'}
                    </DialogDescription>
                </DialogHeader>

                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {conflicts.some(c => isOrderConflict(c))
                            ? `Phát hiện ${conflicts.length} đơn đặt sân trong khoảng thời gian này`
                            : `Phát hiện ${conflicts.length} lần tạm dừng trùng lịch`}
                    </AlertDescription>
                </Alert>

                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4">
                    {conflicts.map((conflict, idx) => {
                        if (isOrderConflict(conflict)) {
                            return (
                                <div
                                    key={conflict._id}
                                    className="border border-orange-200 bg-orange-50 rounded-lg p-4 space-y-3"
                                >
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-orange-600" />
                                            <span className="font-semibold text-gray-900">
                                                Đơn #{conflict.orderCode}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${conflict.statusPayment === 'PAID'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {conflict.statusPayment === 'PAID' ? '✓ Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{conflict.user.name}</p>
                                            <p className="text-gray-600">{conflict.user.phone}</p>
                                        </div>
                                    </div>

                                    {/* Store Info */}
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">{conflict.store.name}</p>
                                            <p className="text-gray-600 text-xs">{conflict.store.address}</p>
                                        </div>
                                    </div>

                                    {/* Booking Time Slots */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Lịch đặt sân:</p>
                                        <div className="space-y-2 pl-4">
                                            {conflict.orderDetails.map((detail, detailIdx) => (
                                                <div
                                                    key={detailIdx}
                                                    className="flex items-center gap-2 bg-white rounded p-2"
                                                >
                                                    <Clock className="w-3 h-3 text-orange-600 flex-shrink-0" />
                                                    <div className="text-sm text-gray-700">
                                                        <span className="font-medium">
                                                            {formatDate(detail.startTime)}
                                                        </span>
                                                        <span className="text-gray-500 mx-1">•</span>
                                                        <span>
                                                            {formatTime(detail.startTime)} - {formatTime(detail.endTime)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cost Info */}
                                    <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                                        <span className="text-sm text-gray-600">Tổng tiền:</span>
                                        <span className="font-semibold text-orange-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(conflict.cost)}
                                        </span>
                                    </div>
                                </div>
                            );
                        } else if (isSuspendConflict(conflict)) {
                            // Suspend record overlap display
                            const suspendRecord = conflict as SuspendStoreRecord;
                            return (
                                <div
                                    key={`suspend-${suspendRecord.id}`}
                                    className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3"
                                >
                                    {/* Suspend Header */}
                                    <div className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-red-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                Tạm dừng: {suspendRecord.store?.name || 'Cửa hàng'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Suspend Time Period */}
                                    <div className="grid grid-cols-2 gap-3 text-sm bg-white rounded p-3">
                                        <div>
                                            <span className="text-gray-600 text-xs font-medium">Bắt đầu:</span>
                                            <p className="font-medium text-gray-900">
                                                {formatDateTime(suspendRecord.startAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 text-xs font-medium">Kết thúc:</span>
                                            <p className="font-medium text-gray-900">
                                                {suspendRecord.endAt
                                                    ? formatDateTime(suspendRecord.endAt)
                                                    : 'Chưa xác định'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Suspend Reason */}
                                    {suspendRecord.reason && (
                                        <div className="text-sm">
                                            <span className="text-gray-600 text-xs font-medium">Lý do:</span>
                                            <p className="text-gray-700">{suspendRecord.reason}</p>
                                        </div>
                                    )}

                                    {/* Operator Info */}
                                    {suspendRecord.operator && (
                                        <div className="text-xs text-gray-600 pt-2 border-t border-red-200">
                                            <p>
                                                Tạo bởi: <span className="font-medium text-gray-900">{suspendRecord.operator.name}</span>
                                            </p>
                                            <p>
                                                Lúc: {formatDateTime(suspendRecord.createdAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            // Fallback for unknown types
                            const item = conflict as any;
                            return (
                                <div key={`unknown-${idx}`} className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-700">Xung đột không xác định được</p>
                                </div>
                            );
                        }
                    })}
                </div>

                <Alert>
                    <AlertDescription>
                        {conflicts.some(c => isOrderConflict(c))
                            ? 'Chọn "Tạm dừng buộc" nếu bạn muốn bỏ qua các đơn đặt sân này và tiếp tục tạm dừng sân.'
                            : 'Chọn "Tạm dừng buộc" nếu bạn muốn bỏ qua các tạm dừng hiện tại và tạm dừng trong khoảng thời gian này.'}
                    </AlertDescription>
                </Alert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={onForceRetry}
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Tạm dừng buộc'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
