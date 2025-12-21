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
import { AlertTriangle, Clock } from 'lucide-react';
import { SuspendStoreRecord } from '@/services/suspend.service';

interface SuspendConflictDialogProps {
    isOpen: boolean;
    onClose: () => void;
    conflicts: SuspendStoreRecord[];
    onForceRetry: () => void;
    isLoading?: boolean;
}

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Xung đột lịch tạm dừng</DialogTitle>
                    <DialogDescription>
                        Khoảng thời gian tạm dừng này xung đột với các lần tạm dừng hiện có
                    </DialogDescription>
                </DialogHeader>

                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Có {conflicts.length} lần tạm dừng khác trong khoảng thời gian này
                    </AlertDescription>
                </Alert>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {conflicts.map((conflict) => (
                        <div
                            key={conflict.id}
                            className="border border-red-200 bg-red-50 rounded-lg p-3"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-red-600" />
                                        <span className="font-semibold text-gray-900">
                                            {conflict.store?.name || 'Cửa hàng'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Bắt đầu:</span>
                                            <p className="font-medium">
                                                {formatDateTime(conflict.startAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Kết thúc:</span>
                                            <p className="font-medium">
                                                {conflict.endAt
                                                    ? formatDateTime(conflict.endAt)
                                                    : 'Chưa xác định'}
                                            </p>
                                        </div>
                                    </div>

                                    {conflict.operator && (
                                        <div className="text-xs text-gray-600 mt-2">
                                            <p>
                                                Tạo bởi: <span className="font-medium">{conflict.operator.name}</span> ({conflict.operator.email})
                                            </p>
                                            <p>
                                                Lúc: {formatDateTime(conflict.createdAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Alert>
                    <AlertDescription>
                        Bạn có thể chọn "Buộc tạm dừng" khi tạo lại để bỏ qua xung đột này.
                    </AlertDescription>
                </Alert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Đóng
                    </Button>
                    <Button
                        onClick={onForceRetry}
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Thử lại với tạm dừng buộc'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
