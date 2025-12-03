'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    MessageCircle,
    Trash2,
    ThumbsUp,
    ChevronDown,
    ChevronUp,
    Loader2,
    Edit,
} from 'lucide-react';
import { getStoreRatings, deleteRating, updateRating } from '@/services/api-new';
import { useToast } from '@/hooks/use-toast';
import EditRatingModal from './EditRatingModal';

interface StoreRatingsListProps {
    storeId: string;
    storeName?: string;
    currentUserId?: string;
}

interface Rating {
    id: string;
    user?: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    sport?: {
        id: string;
        name: string;
        icon?: string;
    };
    star: number;
    comment?: string;
    mediaUrls?: string[];
    createdAt?: string;
}

export default function StoreRatingsList({
    storeId,
    storeName = 'Sân',
    currentUserId,
}: StoreRatingsListProps) {
    const { toast } = useToast();
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRatingId, setExpandedRatingId] = useState<string | null>(null);
    const [deletingRatingId, setDeletingRatingId] = useState<string | null>(null);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    });
    const [editingRating, setEditingRating] = useState<Rating | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        loadRatings();
    }, [storeId]);

    const loadRatings = async () => {
        setLoading(true);
        try {
            const data = await getStoreRatings(storeId, 0, 50);
            setRatings(data);

            // Calculate average rating and distribution
            if (data.length > 0) {
                const totalScore = data.reduce((sum, r) => sum + (r.star || 0), 0);
                const average = totalScore / data.length;
                setAverageRating(Math.round(average * 10) / 10);

                // Calculate distribution
                const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                data.forEach((r) => {
                    const star = Math.round(r.star) as 1 | 2 | 3 | 4 | 5;
                    if (star >= 1 && star <= 5) {
                        distribution[star]++;
                    }
                });
                setRatingDistribution(distribution);
            }
        } catch (error) {
            console.error('Error loading ratings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRating = async (ratingId: string) => {
        if (!confirm('Bạn chắc chắn muốn xóa đánh giá này?')) {
            return;
        }

        setDeletingRatingId(ratingId);
        try {
            await deleteRating(ratingId);
            toast({
                title: ' Đã xóa',
                description: 'Đánh giá của bạn đã được xóa',
            });
            setRatings((prev) => prev.filter((r) => r.id !== ratingId));
        } catch (error: any) {
            toast({
                title: ' Lỗi',
                description: error?.message || 'Không thể xóa đánh giá',
                variant: 'destructive',
            });
        } finally {
            setDeletingRatingId(null);
        }
    };

    const handleEditRating = (rating: Rating) => {
        setEditingRating(rating);
        setIsEditModalOpen(true);
    };

    const handleSaveEditRating = async (data: {
        star: number;
        comment: string;
        newImages?: File[];
    }) => {
        if (!editingRating) return;

        try {
            await updateRating(editingRating.id, data);
            toast({
                title: ' Cập nhật thành công',
                description: 'Đánh giá của bạn đã được cập nhật',
            });

            // Update local state
            setRatings((prev) =>
                prev.map((r) =>
                    r.id === editingRating.id
                        ? {
                            ...r,
                            star: data.star,
                            comment: data.comment,
                        }
                        : r
                )
            );

            setIsEditModalOpen(false);
            setEditingRating(null);
        } catch (error: any) {
            throw error;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return '';
        }
    };

    const renderStars = (count: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={
                    i < count
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                }
            />
        ));
    };

    if (loading) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Đánh giá từ người dùng</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (ratings.length === 0) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Đánh giá từ người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">Chưa có đánh giá nào</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Hãy là người đầu tiên đánh giá {storeName}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Đánh giá từ người dùng</span>
                    <Badge variant="secondary" className="ml-2">
                        {ratings.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Average Rating Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                    {/* Average Score */}
                    <div className="flex-shrink-0 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                            <div className="text-4xl font-bold text-gray-900">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="text-yellow-400">
                                <Star size={32} className="fill-yellow-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Trên {ratings.length} đánh giá
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 w-12">
                                    {star} sao
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all"
                                        style={{
                                            width: `${ratings.length > 0 ? (ratingDistribution[star] / ratings.length) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-8 text-right">
                                    {ratingDistribution[star]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ratings List */}
                <div className="space-y-4">
                    {ratings.map((rating) => (
                        <div
                            key={rating.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {/* Header with User Info */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Avatar className="flex-shrink-0">
                                        <AvatarImage
                                            src={rating.user?.avatarUrl}
                                            alt={rating.user?.name}
                                        />
                                        <AvatarFallback>
                                            {rating.user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {rating.user?.name || 'Ẩn danh'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <div className="flex gap-0.5">
                                                {renderStars(rating.star || 0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">
                                                {rating.star || 0} sao
                                            </span>
                                            {rating.sport && (
                                                <Badge variant="outline" className="text-xs">
                                                    {rating.sport.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button (if owner) */}
                                {currentUserId && currentUserId === rating.user?.id && (
                                    <div className="flex gap-1 flex-shrink-0 ml-2">
                                        <Button
                                            onClick={() => handleEditRating(rating)}
                                            disabled={deletingRatingId === rating.id}
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                            title="Chỉnh sửa đánh giá"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteRating(rating.id)}
                                            disabled={deletingRatingId === rating.id}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            title="Xóa đánh giá"
                                        >
                                            {deletingRatingId === rating.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Comment */}
                            {rating.comment && (
                                <div className="mb-3">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {rating.comment}
                                    </p>
                                </div>
                            )}

                            {/* Images */}
                            {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                                <div className="mb-3">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {rating.mediaUrls.slice(0, 3).map((url, idx) => (
                                            <div
                                                key={idx}
                                                className="relative rounded-lg overflow-hidden bg-gray-100"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Rating image ${idx + 1}`}
                                                    className="w-full h-20 object-cover hover:scale-105 transition-transform cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                        {rating.mediaUrls.length > 3 && (
                                            <div className="relative rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                                <p className="text-sm font-semibold text-gray-600">
                                                    +{rating.mediaUrls.length - 3}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Footer with Date and Actions */}
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                                <span>{formatDate(rating.createdAt)}</span>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <ThumbsUp size={14} />
                                        <span>Hữu ích</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {ratings.length >= 50 && (
                    <Button
                        onClick={loadRatings}
                        variant="outline"
                        className="w-full"
                    >
                        Xem thêm đánh giá
                    </Button>
                )}
            </CardContent>

            {/* Edit Rating Modal */}
            {editingRating && (
                <EditRatingModal
                    isOpen={isEditModalOpen}
                    rating={editingRating}
                    storeName={storeName}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingRating(null);
                    }}
                    onSave={handleSaveEditRating}
                />
            )}
        </Card>
    );
}
