'use client';

import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    Loader2,
    MessageCircle,
    User,
    Calendar,
    AlertCircle,
} from 'lucide-react';
import { useStoreRatingsDetail, useStoreRatingsStats } from '@/hooks/use-store-ratings-detail';
import { formatDistanceToNow } from 'date-fns';

interface StoreRatingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    storeId: string;
    storeName: string;
}

export default function StoreRatingsDialog({
    isOpen,
    onClose,
    storeId,
    storeName,
}: StoreRatingsDialogProps) {
    const [selectedSport, setSelectedSport] = useState<string>('');
    const [selectedStar, setSelectedStar] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;

    // Fetch stats
    const { data: stats, isLoading: statsLoading } = useStoreRatingsStats(storeId);

    // Fetch ratings with filters
    const { data: ratingsData, isLoading: ratingsLoading } = useStoreRatingsDetail({
        storeId,
        sportId: selectedSport || undefined,
        star: selectedStar || undefined,
        page: currentPage,
        perPage,
    });

    const ratings = Array.isArray(ratingsData?.data) ? ratingsData.data : [];
    const total = ratingsData?.total || 0;
    const totalPages = Math.ceil(total / perPage);

    // Calculate rating distribution for progress bars
    const ratingDistribution = useMemo(() => {
        if (!stats) return {};
        const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        Object.entries(stats.ratingsByScore).forEach(([score, count]) => {
            distribution[parseInt(score) as keyof typeof distribution] = count;
        });

        return distribution;
    }, [stats]);

    const renderStarRating = (stars: number, size: 'sm' | 'md' = 'md') => {
        const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        className={`${sizeClass} ${i <= Math.round(stars)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Quản lý đánh giá - {storeName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Statistics Cards */}
                    {statsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : stats ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Total Ratings */}
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">Tổng đánh giá</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {stats.totalRatings}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Average Rating */}
                            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">Đánh giá trung bình</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <p className="text-3xl font-bold text-yellow-600">
                                                {stats.averageRating.toFixed(1)}
                                            </p>
                                            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Number of Sports */}
                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">Môn thể thao</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {stats.sports.length}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Rating */}
                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">Trạng thái</p>
                                        <Badge variant="default" className="bg-purple-600">
                                            Hoạt động
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}

                    {/* Rating Distribution Chart */}
                    {stats && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Phân bố đánh giá</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[5, 4, 3, 2, 1].map((starCount) => {
                                    const count = ratingDistribution[starCount] || 0;
                                    const percentage =
                                        stats.totalRatings > 0
                                            ? Math.round((count / stats.totalRatings) * 100)
                                            : 0;

                                    return (
                                        <div key={starCount} className="flex items-center gap-3">
                                            <div className="flex gap-1 min-w-fit">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i <= starCount
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 min-w-fit">
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}

                    {/* Sport Rating Summary */}
                    {stats && stats.sports.length > 0 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Đánh giá theo môn thể thao</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {stats.sports.map((sport) => (
                                        <div
                                            key={sport.id}
                                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <p className="font-semibold text-gray-800 mb-2">{sport.name}</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {stats.ratingsBySport[sport.id] || 0}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">đánh giá</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Filters */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Bộ lọc</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sport Filter */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Chọn môn thể thao
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        variant={selectedSport === '' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedSport('');
                                            setCurrentPage(1);
                                        }}
                                    >
                                        Tất cả
                                    </Button>
                                    {stats?.sports.map((sport) => (
                                        <Button
                                            key={sport.id}
                                            variant={selectedSport === sport.id ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                                setSelectedSport(sport.id);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {sport.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Star Rating Filter */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Số sao
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        variant={selectedStar === 0 ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedStar(0);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        Tất cả
                                    </Button>
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <Button
                                            key={star}
                                            variant={selectedStar === star ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                                setSelectedStar(star);
                                                setCurrentPage(1);
                                            }}
                                            className="flex gap-1"
                                        >
                                            {star}
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ratings List */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>
                                Danh sách đánh giá ({ratings.length} / {total})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ratingsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : ratings.length === 0 ? (
                                <div className="text-center py-12">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Không có đánh giá nào</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {ratings.map((rating: any, index: number) => (
                                            <div
                                                key={rating.id || index}
                                                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex gap-4">
                                                    {/* Avatar */}
                                                    <div className="flex-shrink-0">
                                                        {rating.user?.avatarUrl ? (
                                                            <img
                                                                src={rating.user.avatarUrl}
                                                                alt={rating.user.name}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                                                                {rating.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                                            <div>
                                                                <p className="font-semibold text-gray-800">
                                                                    {rating.user?.name || 'Ẩn danh'}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {rating.user?.email}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {renderStarRating(rating.star)}
                                                                <Badge variant="outline" className="ml-2">
                                                                    {rating.sport?.name}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Comment */}
                                                        {rating.comment && (
                                                            <p className="text-gray-700 mb-3">{rating.comment}</p>
                                                        )}

                                                        {/* Media */}
                                                        {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                                                            <div className="flex gap-2 mb-3 flex-wrap">
                                                                {rating.mediaUrls.map((url: string, idx: number) => (
                                                                    <img
                                                                        key={idx}
                                                                        src={url}
                                                                        alt={`Rating media ${idx}`}
                                                                        className="h-20 w-20 object-cover rounded-lg"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Meta Info */}
                                                        <div className="flex gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {rating.createdAt
                                                                    ? formatDistanceToNow(new Date(rating.createdAt), {
                                                                        addSuffix: true,
                                                                    })
                                                                    : 'Vừa xong'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-6 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === currentPage ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
