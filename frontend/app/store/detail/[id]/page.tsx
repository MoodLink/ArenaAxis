'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import {
    ArrowLeft,
    Clock,
    MapPin,
    Eye,
    ShoppingCart,
    User,
    CheckCircle,
    XCircle,
    Loader2,
    Image as ImageIcon,
    MessageCircle,
    Star,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Heart,
} from 'lucide-react';
import { getSports } from '@/services/api-new';
import type { StoreAdminDetailResponse } from '@/types';
import StoreDescription from '@/components/store/StoreDescription';
import StoreAmenities from '@/components/store/StoreAmenities';
import StoreSportsList from '@/components/store/StoreSportsList1';
import SportSelectionModal from '@/components/store/SportSelectionModal';
import StoreLayout from '@/components/store/StoreLayout';
import StoreEditDialog from '@/components/store/StoreEditDialog';
import SuspendDialog from '@/components/store/SuspendDialog';
import SuspendConflictDialog from '@/components/store/SuspendConflictDialog';
import SuspendList from '@/components/store/SuspendList';
import { useStoreDetail } from '@/hooks/use-store-detail';
import { useStoreRatings } from '@/hooks/use-store-ratings';
import { usePlans } from '@/hooks/use-plans';
import { SuspendStoreRecord } from '@/services/suspend.service';

export default function StoreOwnerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const storeId = params?.id as string;

    // Use React Query hooks for automatic caching and deduplication
    const { data: store, isLoading: loading } = useStoreDetail(storeId);
    const { data: ratings } = useStoreRatings(storeId);
    const { data: plans } = usePlans('main');

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isSportModalOpen, setIsSportModalOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [sports, setSports] = useState<any[]>([]);
    const [sportsLoading, setSportsLoading] = useState(false);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedSportForRating, setSelectedSportForRating] = useState<any>(null);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
    const [suspendConflicts, setSuspendConflicts] = useState<SuspendStoreRecord[]>([]);
    const [isSuspendConflictOpen, setIsSuspendConflictOpen] = useState(false);
    const [suspendRefreshTrigger, setSuspendRefreshTrigger] = useState(0);

    // Fetch sports when rating dropdown opens
    useEffect(() => {
        if (isRatingDropdownOpen && sports.length === 0) {
            const fetchSports = async () => {
                setSportsLoading(true);
                try {
                    const sportsData = await getSports();
                    setSports(sportsData);
                } catch (error) {
                    console.error('Error fetching sports:', error);
                } finally {
                    setSportsLoading(false);
                }
            };
            fetchSports();
        }
    }, [isRatingDropdownOpen]);

    // Auto-play slide effect
    useEffect(() => {
        if (!isAutoPlaying || !store) return;

        const allImages = [
            store.coverImageUrl,
            store.avatarUrl,
            ...(store.mediaUrls || []),
        ].filter(Boolean) as string[];

        if (allImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) =>
                prev === allImages.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, store, currentSlideIndex]);

    const formatTime = (time?: string) => {
        if (!time) return '--:--';
        return time.substring(0, 5);
    };

    const allImages = !store
        ? []
        : [
            store.coverImageUrl,
            store.avatarUrl,
            ...(store.mediaUrls || []),
        ].filter(Boolean) as string[];

    const handlePrevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlideIndex((prev) =>
            prev === 0 ? allImages.length - 1 : prev - 1
        );
    };

    const handleNextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlideIndex((prev) =>
            prev === allImages.length - 1 ? 0 : prev + 1
        );
    };

    const handleDotClick = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentSlideIndex(index);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };

    const handleBookingClick = () => {
        router.push(`/store/bookings?store_id=${storeId}`);
    };

    const handleSportSelected = (sportId: string) => {
        setIsSportModalOpen(false);
        router.push(`/store-booking?store_id=${storeId}&sport_id=${sportId}`);
    };

    const handleRatingClick = (sport: any) => {
        setSelectedSportForRating(sport);
        setRatingModalOpen(true);
        setUserRating(0);
        setHoverRating(0);
    };

    const handleSubmitRating = () => {
        if (userRating > 0) {
            console.log(`Rated ${selectedSportForRating.name} with ${userRating} stars in store ${store?.name}`);
            setRatingModalOpen(false);
            setSelectedSportForRating(null);
            setUserRating(0);
        }
    };

    const handleEditClick = () => {
        setIsEditDialogOpen(true);
    };

    const handleEditSave = (updatedStore: Partial<StoreAdminDetailResponse>) => {
        // The hook data will automatically refresh when the cache invalidates
        console.log('Store updated:', updatedStore);
        // Note: In a production app, you'd invalidate the query cache here using:
        // queryClient.invalidateQueries({ queryKey: ['storeDetail', storeId] })
    };

    const handleSuspendClick = () => {
        setIsSuspendDialogOpen(true);
    };

    const handleSuspendSuccess = (record: SuspendStoreRecord) => {
        console.log('Store suspended successfully:', record);
        // Trigger refresh of suspend list
        setSuspendRefreshTrigger((prev) => prev + 1);
    };

    const handleSuspendConflict = (conflicts: SuspendStoreRecord[]) => {
        setSuspendConflicts(conflicts);
        setIsSuspendConflictOpen(true);
    };

    const handleForceRetry = () => {
        setIsSuspendConflictOpen(false);
        setIsSuspendDialogOpen(true);
        // You could also set force=true automatically here if desired
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Đang tải thông tin Trung tâm thể thao...</p>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Không tìm thấy Trung tâm thể thao
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Trung tâm thể thao này có thể đã bị xóa hoặc không tồn tại
                    </p>
                    <Button onClick={() => router.push('/store')} size="lg">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <StoreLayout>
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                {/* <div className="mb-6">
                    <BreadcrumbNav
                        items={[
                            { label: 'Danh sách Trung tâm thể thao', href: '/list-store' },
                            { label: store.name, isActive: true }
                        ]}
                    />
                </div> */}

                {/* Cover & Profile Section - Facebook Style */}
                <div className="bg-white rounded-xl shadow-lg overflow-visible mb-6 relative z-20">
                    {/* Cover Image */}
                    <div className="relative h-80 bg-gray-200 overflow-hidden">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={store.name}
                                className="w-full h-full object-cover"
                            />
                        ) : store.coverImageUrl ? (
                            <img
                                src={store.coverImageUrl}
                                alt={store.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-200 to-gray-300">
                                <ImageIcon className="w-24 h-24" />
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="absolute top-4 left-4 z-10">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/store')}
                                className="bg-white/80 hover:bg-white text-gray-700 rounded-full"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-20 relative z-20">
                            {/* Avatar & Name */}
                            <div className="flex items-end gap-4 flex-1">
                                {/* Avatar */}
                                {store.avatarUrl ? (
                                    <img
                                        src={store.avatarUrl}
                                        alt={store.name}
                                        className="w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-5xl flex-shrink-0">
                                        {store.name.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Store Name */}
                                <div className="flex-1 pb-2">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        {store.name}
                                    </h1>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        {store.approved !== undefined && (
                                            <Badge variant={store.approved ? 'default' : 'secondary'}>
                                                {store.approved ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Đã duyệt
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Chưa duyệt
                                                    </>
                                                )}
                                            </Badge>
                                        )}
                                        {store.active !== undefined && (
                                            <Badge variant={store.active ? 'default' : 'destructive'}>
                                                {store.active ? 'Đang hoạt động' : 'Tạm đóng'}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button - Quick Actions */}
                            <div className="w-full md:w-auto flex gap-2">
                                {/* <Button
                                    variant="outline"
                                    onClick={handleEditClick}
                                >
                                    Chỉnh sửa thông tin
                                </Button> */}
                                <Button
                                    variant="destructive"
                                    onClick={handleSuspendClick}
                                >
                                    Tạm dừng
                                </Button>
                            </div>
                        </div>

                        {/* Quick Info - Below Profile */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                                    <ShoppingCart className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Đơn hàng</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {store.orderCount || 0}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                                    <Eye className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm">Lượt xem</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {store.viewCount || 0}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm">Giờ mở cửa</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatTime(store.startTime)} - {formatTime(store.endTime)}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span className="text-sm">Yêu thích</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    0
                                    {/* {store.favoriteCount || 0} */}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Images & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Block 2: Image Slider */}
                        {allImages.length > 0 && (
                            <Card className="shadow-xl overflow-hidden">
                                <div className="relative">
                                    {/* Main Slider */}
                                    <div className="relative h-96 bg-gray-900 overflow-hidden group">
                                        {/* Slides */}
                                        <div className="relative w-full h-full">
                                            {allImages.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlideIndex
                                                        ? 'opacity-100 scale-100'
                                                        : 'opacity-0 scale-105'
                                                        }`}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`${store.name} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Left Arrow */}
                                        <button
                                            onClick={handlePrevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 shadow-lg"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>

                                        {/* Right Arrow */}
                                        <button
                                            onClick={handleNextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 shadow-lg"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>

                                        {/* Slide Counter */}
                                        <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                                            {currentSlideIndex + 1} / {allImages.length}
                                        </div>

                                        {/* Auto-play Toggle Button */}
                                        <button
                                            onClick={toggleAutoPlay}
                                            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
                                            title={isAutoPlaying ? 'Tạm dừng' : 'Phát tự động'}
                                        >
                                            {isAutoPlaying ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5 ml-0.5" />
                                            )}
                                        </button>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Dots Navigation */}
                                    <div className="flex justify-center gap-2 p-4 bg-gray-50">
                                        {allImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDotClick(index)}
                                                className={`relative h-2 rounded-full transition-all duration-300 ${index === currentSlideIndex
                                                    ? 'w-8 bg-primary'
                                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                            >
                                                {index === currentSlideIndex && isAutoPlaying && (
                                                    <div
                                                        className="absolute inset-0 bg-blue-600 rounded-full animate-progress"
                                                        style={{
                                                            animation: 'progressBar 3s linear forwards',
                                                        }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <style jsx>{`
                    @keyframes progressBar {
                      from {
                        width: 0%;
                      }
                      to {
                        width: 100%;
                      }
                    }
                    .animate-progress {
                      animation: progressBar 3s linear forwards;
                    }
                  `}</style>

                                    {/* Thumbnail Strip */}
                                    <div className="bg-white border-t p-3">
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {allImages.map((url, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleDotClick(index)}
                                                    className={`relative h-16 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all hover:border-primary ${index === currentSlideIndex
                                                        ? 'border-primary ring-2 ring-primary shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`${store.name} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {index === currentSlideIndex && (
                                                        <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Block 3: Description */}
                        {store && <StoreDescription store={store} />}

                        {/* Block 4: Amenities */}
                        {store && <StoreAmenities store={store} />}

                        {/* Block 5: Sports List */}
                        {store && (
                            <StoreSportsList
                                store={store}
                                onBookClick={handleBookingClick}
                            />
                        )}

                        {/* Block 6: Suspend History */}
                        {/* <SuspendList
                            storeId={storeId}
                            refreshTrigger={suspendRefreshTrigger}
                        /> */}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Action Button - Booking */}
                        {/* <Button
                            onClick={handleBookingClick}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-12 font-semibold"
                            size="lg"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Đặt sân ngay
                        </Button> */}

                        {/* Quick Actions Card */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Quản lý nhanh</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleEditClick}
                                >
                                    Chỉnh sửa thông tin
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <a href={`/store/ratings/${storeId}`}>
                                        Quản lý đánh giá
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={`/store/bookings?store_id=${storeId}`}>
                                        Quản lý đặt sân
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href="/store/revenue">
                                        Xem doanh thu
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={`/list-store/${storeId}`}>
                                        Xem trang công khai
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Owner Info Card */}
                        {store.owner && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Chủ sở hữu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        {store.owner.avatarUrl ? (
                                            <img
                                                src={store.owner.avatarUrl}
                                                alt={store.owner.name || 'Owner'}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {store.owner.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">
                                                {store.owner.name}
                                            </p>
                                            {store.owner.email && (
                                                <p className="text-sm text-gray-600 truncate">{store.owner.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Sport Selection Modal */}
                <SportSelectionModal
                    isOpen={isSportModalOpen}
                    onClose={() => setIsSportModalOpen(false)}
                    onConfirm={handleSportSelected}
                />

                {/* Store Edit Dialog */}
                <StoreEditDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    store={store}
                    onSave={handleEditSave}
                />

                {/* Suspend Dialog */}
                <SuspendDialog
                    isOpen={isSuspendDialogOpen}
                    onClose={() => setIsSuspendDialogOpen(false)}
                    storeId={storeId}
                    storeName={store.name}
                    onSuccess={handleSuspendSuccess}
                    onConflict={handleSuspendConflict}
                />

                {/* Suspend Conflict Dialog */}
                <SuspendConflictDialog
                    isOpen={isSuspendConflictOpen}
                    onClose={() => setIsSuspendConflictOpen(false)}
                    conflicts={suspendConflicts}
                    onForceRetry={handleForceRetry}
                />
            </div>
        </StoreLayout>
    );
}
