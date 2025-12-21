'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Star,
    Loader2,
    ArrowLeft,
    AlertCircle,
    Calendar,
    MessageCircle,
    Images,
} from 'lucide-react';
import { useStoreRatingsDetail, useStoreRatingsStats } from '@/hooks/use-store-ratings-detail';
import { formatDistanceToNow } from 'date-fns';

export default function AdminReviewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const storeId = params?.id as string;

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

    if (!storeId) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Không tìm thấy thông tin cửa hàng
                        </h3>
                        
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Chi tiết đánh giá cửa hàng
                            </h1>
                           
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {statsLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Total Ratings */}
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Tổng đánh giá</p>
                                    <p className="text-4xl font-bold text-blue-600">
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
                                        <p className="text-4xl font-bold text-yellow-600">
                                            {stats.averageRating.toFixed(1)}
                                        </p>
                                        <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Number of Sports */}
                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Môn thể thao</p>
                                    <p className="text-4xl font-bold text-green-600">
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
                                    <Badge variant="default" className="bg-purple-600 text-white">
                                        Hoạt động
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Rating Distribution Chart */}
                        {stats && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl">Phân bố đánh giá</CardTitle>
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
                                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
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

                        {/* Ratings List */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">
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
                                        <p className="text-gray-500 text-lg">Không có đánh giá nào</p>
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
                                                                    className="w-14 h-14 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                                                    {rating.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                                                <div>
                                                                    <p className="font-semibold text-gray-800 text-base">
                                                                        {rating.user?.name || 'Ẩn danh'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {rating.user?.email}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {renderStarRating(rating.star)}
                                                                    <Badge variant="outline" className="ml-2 whitespace-nowrap">
                                                                        {rating.sport?.name}
                                                                    </Badge>
                                                                    {rating.comment && (
                                                                        <Badge className="whitespace-nowrap bg-blue-600 text-white">
                                                                            <MessageCircle className="w-3 h-3 mr-1" />
                                                                            Có nhận xét
                                                                        </Badge>
                                                                    )}
                                                                    {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                                                                        <Badge className="whitespace-nowrap bg-green-600 text-white">
                                                                            <Images className="w-3 h-3 mr-1" />
                                                                            {rating.mediaUrls.length} ảnh
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Comment */}
                                                            {rating.comment ? (
                                                                <div className="bg-blue-50 border-l-4 border-l-blue-400 rounded-r p-3 mb-3">
                                                                    <div className="flex items-start gap-2">
                                                                        <MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                                        <p className="text-gray-700 text-sm leading-relaxed flex-1">
                                                                            {rating.comment}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                                                                    <p className="text-gray-400 text-sm italic flex items-center gap-2">
                                                                        <MessageCircle className="w-4 h-4" />
                                                                        Không có nhận xét
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Media */}
                                                            {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                                                                <div className="mb-3">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Images className="w-4 h-4 text-gray-500" />
                                                                        <span className="text-xs font-medium text-gray-600">
                                                                            {rating.mediaUrls.length} hình ảnh
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex gap-2 flex-wrap">
                                                                        {rating.mediaUrls.map((url: string, idx: number) => (
                                                                            <div key={idx} className="relative group">
                                                                                <img
                                                                                    src={url}
                                                                                    alt={`Rating media ${idx + 1}`}
                                                                                    className="h-24 w-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-sm"
                                                                                />
                                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition" />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}


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
                                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                    const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                                                    return page <= totalPages ? (
                                                        <Button
                                                            key={page}
                                                            variant={page === currentPage ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(page)}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ) : null;
                                                })}
                                                {totalPages > 5 && currentPage <= totalPages - 4 && (
                                                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                                                )}
                                                {totalPages > 5 && currentPage <= totalPages - 4 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCurrentPage(totalPages)}
                                                    >
                                                        {totalPages}
                                                    </Button>
                                                )}
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

                    {/* Sidebar Filters */}
                    <div className="space-y-6">
                        {/* Sport Filter */}
                        <Card className="shadow-lg sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Lọc theo môn</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={selectedSport === '' ? 'default' : 'outline'}
                                    className="w-full justify-start"
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
                                        className="w-full justify-start text-left"
                                        onClick={() => {
                                            setSelectedSport(sport.id);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <span className="truncate">{sport.name}</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Star Rating Filter */}
                        <Card className="shadow-lg sticky top-48">
                            <CardHeader>
                                <CardTitle className="text-lg">Lọc theo sao</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={selectedStar === 0 ? 'default' : 'outline'}
                                    className="w-full justify-start"
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
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setSelectedStar(star);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <span>{star}</span>
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i <= star
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
