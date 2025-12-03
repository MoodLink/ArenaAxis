'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    X,
    Upload,
    Loader2,
    Edit,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditRatingModalProps {
    isOpen: boolean;
    rating: {
        id: string;
        star: number;
        comment?: string;
        mediaUrls?: string[];
        sportName?: string;
    };
    storeName?: string;
    onClose: () => void;
    onSave: (data: { star: number; comment: string; newImages?: File[] }) => Promise<void>;
}

export default function EditRatingModal({
    isOpen,
    rating,
    storeName = 'Sân',
    onClose,
    onSave,
}: EditRatingModalProps) {
    const { toast } = useToast();
    const [userRating, setUserRating] = useState(rating.star);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(rating.comment || '');
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setUserRating(rating.star);
            setComment(rating.comment || '');
            setNewImages([]);
            setImagePreviews([]);
            setHoverRating(0);
        }
    }, [isOpen, rating]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Limit to 5 total (existing + new)
        const existingCount = rating.mediaUrls?.length || 0;
        if (files.length + newImages.length + existingCount > 5) {
            toast({
                title: ' Tối đa 5 ảnh',
                description: `Bạn chỉ có thể tải lên tối đa 5 ảnh (${existingCount} ảnh cũ)`,
                variant: 'destructive',
            });
            return;
        }

        setNewImages([...newImages, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (userRating <= 0) {
            toast({
                title: ' Vui lòng chọn số sao',
                description: 'Bạn cần chọn từ 1 đến 5 sao',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                star: userRating,
                comment: comment,
                newImages: newImages.length > 0 ? newImages : undefined,
            });
            onClose();
        } catch (error: any) {
            toast({
                title: ' Lỗi',
                description: error?.message || 'Không thể cập nhật đánh giá',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Chỉnh sửa đánh giá
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Info Section */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-2xl flex-shrink-0">
                            🏟️
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">
                                {rating.sportName || 'Môn thể thao'}
                            </p>
                            <p className="text-sm text-gray-600 truncate">Tại {storeName}</p>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Bạn đánh giá bao nhiêu sao? *
                        </label>
                        <div className="flex gap-3 justify-center mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setUserRating(i + 1)}
                                    onMouseEnter={() => setHoverRating(i + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    disabled={isSubmitting}
                                    className="transition-transform hover:scale-110 disabled:opacity-50"
                                >
                                    <Star
                                        size={40}
                                        className={`transition-colors ${i < (hoverRating || userRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {userRating > 0 && (
                            <p className="text-center text-lg font-bold text-yellow-600">
                                {userRating} / 5 sao
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bình luận (tùy chọn)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[100px] disabled:bg-gray-50"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {comment.length} / 500 ký tự
                        </p>
                    </div>

                    {/* Existing Images */}
                    {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ảnh cũ
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {rating.mediaUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-lg overflow-hidden border border-gray-200"
                                    >
                                        <img
                                            src={url}
                                            alt={`Existing ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                        <Badge variant="secondary" className="absolute top-1 left-1">
                                            Cũ
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thêm ảnh mới (tùy chọn)
                        </label>

                        <div className="relative">
                            <input
                                type="file"
                                id="edit-rating-images"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                disabled={isSubmitting}
                                className="hidden"
                            />
                            <label
                                htmlFor="edit-rating-images"
                                className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isSubmitting
                                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                                    }`}
                            >
                                <Upload className="w-6 h-6 text-blue-500" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        Nhấp để chọn ảnh
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        ({newImages.length} ảnh mới)
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* New Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Ảnh mới ({imagePreviews.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative group rounded-lg overflow-hidden border border-gray-200"
                                        >
                                            <img
                                                src={preview}
                                                alt={`New ${index + 1}`}
                                                className="w-full h-24 object-cover"
                                            />
                                            <button
                                                onClick={() => removeNewImage(index)}
                                                disabled={isSubmitting}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50"
                                            >
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={userRating === 0 || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Edit className="w-4 h-4 mr-2" />
                                Cập nhật
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
