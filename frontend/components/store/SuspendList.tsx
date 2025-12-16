'use client';

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Clock, User } from 'lucide-react';
import { getSuspendRecords, SuspendStoreRecord } from '@/services/suspend.service';

interface SuspendListProps {
    storeId: string;
    refreshTrigger?: number; // Trigger refresh when this value changes
}

export default function SuspendList({ storeId, refreshTrigger = 0 }: SuspendListProps) {
    const [suspends, setSuspends] = useState<SuspendStoreRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuspends = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getSuspendRecords(storeId);
                setSuspends(data);
            } catch (err: any) {
                setError(err.message || 'Không thể tải danh sách tạm dừng');
                setSuspends([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuspends();
    }, [storeId, refreshTrigger]);

    const formatDateTime = (dateTimeString: string): string => {
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch {
            return dateTimeString;
        }
    };

    const isActive = (record: SuspendStoreRecord): boolean => {
        const now = new Date();
        const startAt = new Date(record.startAt);
        const endAt = record.endAt ? new Date(record.endAt) : null;

        if (endAt) {
            return now >= startAt && now <= endAt;
        }
        return now >= startAt;
    };

    const getDurationText = (record: SuspendStoreRecord): string => {
        if (!record.endAt) {
            return 'Không xác định thời gian kết thúc';
        }

        const start = new Date(record.startAt);
        const end = new Date(record.endAt);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return `${diffHours}h ${diffMins}m`;
        }
        return `${diffMins}m`;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử tạm dừng</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử tạm dừng</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (suspends.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử tạm dừng</CardTitle>
                    <CardDescription>
                        Chưa có lần tạm dừng nào
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lịch sử tạm dừng</CardTitle>
                <CardDescription>
                    Tổng cộng {suspends.length} lần tạm dừng
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {suspends.map((record) => {
                        const active = isActive(record);
                        return (
                            <div
                                key={record.id}
                                className={`border rounded-lg p-4 transition-all ${active
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                {/* Status Badge & Duration */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge
                                            variant={active ? 'destructive' : 'secondary'}
                                        >
                                            {active ? '🔴 Đang tạm dừng' : '⏸️ Đã kết thúc'}
                                        </Badge>
                                        <span className="text-sm font-medium text-gray-600">
                                            {getDurationText(record)}
                                        </span>
                                    </div>
                                </div>

                                {/* Time Info */}
                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                    <div>
                                        <div className="text-gray-600 flex items-center gap-1 mb-1">
                                            <Clock className="w-4 h-4" />
                                            Bắt đầu
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {formatDateTime(record.startAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-gray-600 flex items-center gap-1 mb-1">
                                            <Clock className="w-4 h-4" />
                                            Kết thúc
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {record.endAt
                                                ? formatDateTime(record.endAt)
                                                : 'Chưa xác định'}
                                        </p>
                                    </div>
                                </div>

                                {/* Reason */}
                                {record.startAt && (
                                    <div className="mb-3 bg-white/50 rounded p-2 border border-gray-200">
                                        <p className="text-xs text-gray-600 mb-1">Lý do:</p>
                                        <p className="text-sm text-gray-800">{record.startAt}</p>
                                    </div>
                                )}

                                {/* Operator Info */}
                                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {record.operator?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            {record.operator?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {formatDateTime(record.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
