'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Eye, ShoppingCart, Edit, Settings } from 'lucide-react';
import type { StoreAdminDetailResponse } from '@/types';
import ClientOnly from '@/components/common/ClientOnly';

interface OwnerStoreCardProps {
    store: StoreAdminDetailResponse;
}

export default function OwnerStoreCard({ store }: OwnerStoreCardProps) {
    const formatTime = (time?: string) => {
        if (!time) return '--:--';
        return time.substring(0, 5); // HH:mm
    };

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary h-[520px] flex flex-col">
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
                {store.coverImageUrl ? (
                    <img
                        src={store.coverImageUrl}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {store.approved ? (
                        <Badge className="bg-green-600 shadow-lg">✓ Đã duyệt</Badge>
                    ) : (
                        <Badge variant="secondary" className="shadow-lg">⏳ Chờ duyệt</Badge>
                    )}
                    {store.active ? (
                        <Badge variant="outline" className="bg-white shadow-lg">Hoạt động</Badge>
                    ) : (
                        <Badge variant="destructive" className="shadow-lg">Tạm ngừng</Badge>
                    )}
                </div>

                {/* Avatar Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="flex items-center gap-2">
                        {store.avatarUrl ? (
                            <img
                                src={store.avatarUrl}
                                alt={store.name}
                                className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
                                {store.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CardContent className="p-4 space-y-2 flex-1 flex flex-col overflow-hidden">
                {/* Store Name */}
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-shrink-0">
                    {store.name}
                </h3>

                {/* Introduction */}
                {store.introduction && (
                    <p className="text-sm text-gray-600 line-clamp-2 flex-shrink-0">
                        {store.introduction}
                    </p>
                )}

                {/* Location */}
                {store.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 flex-shrink-0">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                        <span className="line-clamp-1">{store.address}</span>
                    </div>
                )}

                {/* Opening Hours */}
                {(store.startTime || store.endTime) && (
                    <div className="flex items-center gap-2 text-sm flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium truncate">
                            {formatTime(store.startTime)} - {formatTime(store.endTime)}
                        </span>
                    </div>
                )}

                {/* Stats - Bottom */}
                <div className="mt-auto pt-2 border-t space-y-2 flex-shrink-0">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-yellow-50 p-2 rounded">
                            <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                            <p className="text-xs font-semibold text-gray-900">
                                <ClientOnly>{(store as any).averageRating?.toFixed(1) || '0.0'}</ClientOnly>
                            </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                            <ShoppingCart className="w-4 h-4 text-green-500 mx-auto mb-1" />
                            <p className="text-xs font-semibold text-gray-900">
                                <ClientOnly>{store.orderCount || 0}</ClientOnly>
                            </p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                            <Eye className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                            <p className="text-xs font-semibold text-gray-900">
                                <ClientOnly>{store.viewCount || 0}</ClientOnly>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                        >
                            <Link href={`/store/detail/${store.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                Xem chi tiết
                            </Link>
                        </Button>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
