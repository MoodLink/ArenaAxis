'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Eye, ShoppingCart, Edit } from 'lucide-react';
import type { StoreAdminDetailResponse } from '@/types';
import ClientOnly from '@/components/common/ClientOnly';

interface OwnerStoreListItemProps {
    store: StoreAdminDetailResponse;
}

export default function OwnerStoreListItem({ store }: OwnerStoreListItemProps) {
    const formatTime = (time?: string) => {
        if (!time) return '--:--';
        return time.substring(0, 5); // HH:mm
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Image Section */}
                    <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                        {store.coverUrl ? (
                            <img
                                src={store.coverUrl}
                                alt={store.name}
                                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        )}

                        {/* Avatar */}
                        <div className="absolute bottom-3 left-3">
                            {store.avatarUrl ? (
                                <img
                                    src={store.avatarUrl}
                                    alt={store.name}
                                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                                    {store.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 md:py-4 md:pr-4 md:pl-0">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                                        {store.name}
                                    </h3>
                                    {store.introduction && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {store.introduction}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {store.approved ? (
                                        <Badge className="bg-green-600">✓ Đã duyệt</Badge>
                                    ) : (
                                        <Badge variant="secondary">⏳ Chờ duyệt</Badge>
                                    )}
                                    {store.active ? (
                                        <Badge variant="outline">Hoạt động</Badge>
                                    ) : (
                                        <Badge variant="destructive">Tạm ngừng</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                {/* Location */}
                                {store.address && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                                        <span className="line-clamp-1">{store.address}</span>
                                    </div>
                                )}

                                {/* Opening Hours */}
                                {(store.startTime || store.endTime) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">
                                            {formatTime(store.startTime)} - {formatTime(store.endTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stats & Actions */}
                            <div className="mt-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-gray-800">
                                            <ClientOnly>{(store as any).averageRating?.toFixed(1) || '0.0'}</ClientOnly>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <ShoppingCart className="w-4 h-4 text-green-500" />
                                        <span className="font-medium">
                                            <ClientOnly>{store.orderCount || 0}</ClientOnly>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Eye className="w-4 h-4 text-purple-500" />
                                        <span className="font-medium">
                                            <ClientOnly>{store.viewCount || 0}</ClientOnly>
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/store/detail/${store.id}`}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            Xem chi tiết
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/store/${store.id}/settings`}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Chỉnh sửa
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
