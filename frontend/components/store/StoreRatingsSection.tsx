'use client';

import React, { useState } from 'react';
import { useStoreRatingsDetail, useStoreRatingsStats } from '@/hooks/use-store-ratings-detail';
import { Star, ChevronDown, Loader2, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Sport {
    id: string;
    name: string;
}

interface Rating {
    id: string;
    star: number;
    comment: string;
    mediaUrls?: string[];
    user?: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    sport?: Sport;
    createdAt?: string;
    updatedAt?: string;
}

interface StoreRatingsSectionProps {
    storeId: string;
    sports?: Sport[];
}

export default function StoreRatingsSection({ storeId, sports = [] }: StoreRatingsSectionProps) {
    const [selectedSportId, setSelectedSportId] = useState<string | undefined>(undefined);
    const [selectedStar, setSelectedStar] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const perPage = 10;

    // Fetch ratings stats
    const { data: stats } = useStoreRatingsStats(storeId);

    // Fetch ratings with filters
    const { data: ratingsData, isLoading: isLoadingRatings } = useStoreRatingsDetail({
        storeId,
        sportId: selectedSportId,
        star: selectedStar,
        page,
        perPage,
    });

    const ratings = Array.isArray(ratingsData?.data)
        ? ratingsData.data
        : Array.isArray(ratingsData)
            ? ratingsData
            : [];

    const handleSportFilter = (sportId: string | undefined) => {
        setSelectedSportId(sportId);
        setPage(1);
    };

    const handleStarFilter = (star: number | undefined) => {
        setSelectedStar(star);
        setPage(1);
    };

    const handleLoadMore = () => {
        setPage(page + 1);
    };

    const handleClearFilters = () => {
        setSelectedSportId(undefined);
        setSelectedStar(undefined);
        setPage(1);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderStars = (count: number) => {
        return (
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đánh giá sân ({stats?.totalRatings || 0})</h2>
                {stats && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-gray-900">
                                {stats.averageRating.toFixed(1)}
                            </span>
                            <div>
                                {renderStars(Math.round(stats.averageRating))}
                                <p className="text-sm text-gray-500">
                                    Trên {stats.totalRatings} đánh giá
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rating Distribution */}
            {stats && (
                <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-gray-700 mb-4">Phân bố đánh giá</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.ratingsByScore[star] || 0;
                            const percentage =
                                stats.totalRatings > 0
                                    ? Math.round((count / stats.totalRatings) * 100)
                                    : 0;
                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleStarFilter(selectedStar === star ? undefined : star)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${selectedStar === star
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {star}
                                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    </button>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {percentage}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-700 mb-4">Lọc đánh giá</h3>

                {/* Sport Filter */}
                {sports.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Môn thể thao
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleSportFilter(undefined)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedSportId === undefined
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tất cả
                            </button>
                            {sports.map((sport) => (
                                <button
                                    key={sport.id}
                                    onClick={() => handleSportFilter(selectedSportId === sport.id ? undefined : sport.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedSportId === sport.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {sport.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Star Filter - Radio Buttons */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số sao
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleStarFilter(undefined)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStar === undefined
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleStarFilter(selectedStar === star ? undefined : star)}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${selectedStar === star
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {star}
                                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                {(selectedSportId || selectedStar) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="mt-4"
                    >
                        Xóa bộ lọc
                    </Button>
                )}
            </div>

            {/* Ratings List */}
            <div className="space-y-4">
                {isLoadingRatings && page === 1 ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-blue-500 mr-2" size={24} />
                        <span className="text-gray-600">Đang tải đánh giá...</span>
                    </div>
                ) : ratings.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Chưa có đánh giá nào</p>
                    </div>
                ) : (
                    <>
                        {ratings.map((rating: Rating) => (
                            <div
                                key={rating.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                {/* Rating Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                            {rating.user?.avatarUrl ? (
                                                <img
                                                    src={rating.user.avatarUrl}
                                                    alt={rating.user?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-600 font-semibold">
                                                    {rating.user?.name?.[0]?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {rating.user?.name || 'Ẩn danh'}
                                            </p>
                                            {rating.sport && (
                                                <p className="text-sm text-gray-500">{rating.sport.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {renderStars(Math.round(rating.star))}
                                    </div>
                                </div>

                                {/* Rating Comment */}
                                {rating.comment && (
                                    <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                                        {rating.comment}
                                    </p>
                                )}

                                {/* Rating Images */}
                                {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                                    <div className="mb-3 flex gap-2 overflow-x-auto">
                                        {rating.mediaUrls.map((url, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Rating ${idx}`}
                                                    className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Rating Footer */}
                                {rating.createdAt && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar size={14} />
                                        {formatDate(rating.createdAt)}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Load More Button */}
                        {ratings.length === perPage && (
                            <Button
                                onClick={handleLoadMore}
                                disabled={isLoadingRatings}
                                className="w-full mt-4"
                                variant="outline"
                            >
                                {isLoadingRatings ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                        Đang tải...
                                    </>
                                ) : (
                                    'Xem thêm đánh giá'
                                )}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
