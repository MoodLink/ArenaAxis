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
  ExternalLink,
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
import { getStoreById, getSports, toggleFavourite, isFavourite, createRating, getCurrentUser } from '@/services/api-new';
import type { StoreClientDetailResponse, UserResponse } from '@/types';
import StoreDescription from '@/components/store/StoreDescription';
import StoreAmenities from '@/components/store/StoreAmenities';
import StoreSportsList from '@/components/store/StoreSportsList';
import SportSelectionModal from '@/components/store/SportSelectionModal';
import StoreRatingsList from '@/components/store/StoreRatingsList';
import { useToast } from '@/hooks/use-toast';
import { emitFavouriteChange, useFavouriteSync } from '@/hooks/use-favourite-sync';
import { X, Upload } from 'lucide-react';

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const storeId = params?.id as string;

  const [store, setStore] = useState<StoreClientDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isSportModalOpen, setIsSportModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [sports, setSports] = useState<any[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedSportForRating, setSelectedSportForRating] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingImages, setRatingImages] = useState<File[]>([]);
  const [ratingImagePreviews, setRatingImagePreviews] = useState<string[]>([]);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (storeId) {
      loadStoreDetail();
      checkFavourite();
      loadCurrentUser();
    }
  }, [storeId]);

  // Load current user info
  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      // User not logged in
    }
  };

  // Listen to favourite changes from other components
  useFavouriteSync(storeId, (newState) => {
    setIsFav(newState);
  });

  // Check if store is favourite
  const checkFavourite = async () => {
    try {
      const result = await isFavourite(storeId);
      setIsFav(result);
    } catch (error) {
      // Silently fail - user may not be logged in
    }
  };

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
    }, 3000); // Chuyển slide sau mỗi 3 giây

    return () => clearInterval(interval);
  }, [isAutoPlaying, store, currentSlideIndex]);

  const loadStoreDetail = async () => {
    setLoading(true);
    try {
      const data = await getStoreById(storeId);

      // Add mock images for testing if mediaUrls is empty
      if (data && (!data.mediaUrls || data.mediaUrls.length === 0)) {
        data.mediaUrls = [
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop',
        ];
      }

      setStore(data);
      if (data?.coverImageUrl) {
        setSelectedImage(data.coverImageUrl);
      }
    } catch (error) {
      console.error('Error loading store detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '--:--';
    return time.substring(0, 5); // HH:mm
  };

  // Calculate allImages early so handlers can use it
  const allImages = !store
    ? []
    : [
      store.coverImageUrl,
      store.avatarUrl,
      ...(store.mediaUrls || []),
    ].filter(Boolean) as string[];

  const handlePrevSlide = () => {
    setIsAutoPlaying(false); // Dừng auto-play khi người dùng tương tác
    setCurrentSlideIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false); // Dừng auto-play khi người dùng tương tác
    setCurrentSlideIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false); // Dừng auto-play khi người dùng chọn slide
    setCurrentSlideIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleBookingClick = () => {
    setIsSportModalOpen(true);
  };

  const handleToggleFavourite = async () => {
    if (isLoadingFav) return;

    setIsLoadingFav(true);
    try {
      const newState = await toggleFavourite(storeId);
      setIsFav(newState);

      // Emit event để notify các component khác
      emitFavouriteChange(storeId, newState);

      toast({
        title: newState ? '✅ Đã thêm vào yêu thích' : '✅ Đã xóa khỏi yêu thích',
        description: `"${store?.name}"`,
      });
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error?.message || 'Không thể cập nhật yêu thích',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleSportSelected = (sportId: string) => {
    setIsSportModalOpen(false);
    // Redirect to store booking page with query parameters
    router.push(`/store-booking?store_id=${storeId}&sport_id=${sportId}`);
  };

  const handleRatingClick = (sport: any) => {
    if (!currentUser) {
      toast({
        title: '⚠️ Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để đánh giá sân',
        variant: 'destructive',
      });
      return;
    }
    setSelectedSportForRating(sport);
    setRatingModalOpen(true);
    setUserRating(0);
    setHoverRating(0);
    setRatingComment('');
    setRatingImages([]);
    setRatingImagePreviews([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 5 images
    if (files.length + ratingImages.length > 5) {
      toast({
        title: '⚠️ Tối đa 5 ảnh',
        description: 'Bạn chỉ có thể tải lên tối đa 5 ảnh',
        variant: 'destructive',
      });
      return;
    }

    // Add files to state
    setRatingImages([...ratingImages, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRatingImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setRatingImages((prev) => prev.filter((_, i) => i !== index));
    setRatingImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRating = async () => {
    if (userRating <= 0) {
      toast({
        title: '⚠️ Vui lòng chọn số sao',
        description: 'Bạn cần chọn từ 1 đến 5 sao để đánh giá',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedSportForRating || !store) return;

    setIsSubmittingRating(true);
    try {
      const request = {
        storeId: store.id,
        sportId: selectedSportForRating.id,
        star: userRating,
        comment: ratingComment,
        mediaFiles: ratingImages.length > 0 ? ratingImages : undefined,
      };

      await createRating(request);

      toast({
        title: '✅ Cảm ơn bạn!',
        description: 'Đánh giá của bạn đã được gửi thành công',
      });

      // Reset form
      setRatingModalOpen(false);
      setSelectedSportForRating(null);
      setUserRating(0);
      setRatingComment('');
      setRatingImages([]);
      setRatingImagePreviews([]);
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error?.message || 'Không thể gửi đánh giá',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải thông tin sân...</p>
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
            Không tìm thấy sân
          </h3>
          <p className="text-gray-600 mb-6">
            Sân này có thể đã bị xóa hoặc không tồn tại
          </p>
          <Button onClick={() => router.push('/list-store')} size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">


      <div className="container mx-auto px-4 py-6">

        {/* Back Button */}
        <div className="mb-6">
          <BreadcrumbNav
            items={[
              { label: 'Danh sách cửa hàng', href: '/list-store' },
              { label: store.name, isActive: true }
            ]}
          />
        </div>
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
                onClick={() => router.push('/list-store')}
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

              {/* Rating & Dropdown */}
              <div className="w-full md:w-auto relative">
                <button
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="w-full md:w-auto bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <div className="text-left">
                      <div className="text-sm text-gray-600">Đánh giá</div>
                      <div className="text-2xl font-bold text-gray-900">0.0</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${isRatingDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu - Sports Ratings */}
                {isRatingDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border-2 border-primary rounded-lg shadow-xl z-50 p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      Đánh giá theo môn thể thao
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {sportsLoading ? (
                        <div className="text-center py-6">
                          <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
                          <p className="text-gray-600 text-sm mt-2">Đang tải môn thể thao...</p>
                        </div>
                      ) : sports.length > 0 ? (
                        sports.map((sport) => (
                          <div
                            key={sport.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-2xl">🏟️</span>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{sport.name}</p>
                                <p className="text-xs text-gray-600">{sport.nameEn}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRatingClick(sport)}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors text-xs"
                            >
                              Đánh giá
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p>Chưa có môn thể thao nào</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Khoảng cách</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ~2.5 km
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
                        {/* Progress indicator for auto-play */}
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

            {/* Block 6: Ratings List */}
            {store && (
              <StoreRatingsList
                storeId={store.id}
                storeName={store.name}
                currentUserId={currentUser?.id}
              />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Button - Booking only */}
            <Button
              onClick={handleBookingClick}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-12 font-semibold"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Đặt sân ngay
            </Button>

            {/* Owner Info with Chat Icon */}
            {store.owner && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Chủ sở hữu
                    </span>
                    <button
                      onClick={() => {
                        alert('Chức năng chat đang được phát triển');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Chat với chủ sân"
                    >
                      <MessageCircle className="w-5 h-5 text-emerald-600 hover:text-emerald-700" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    {store.owner.avatarUrl ? (
                      <img
                        src={store.owner.avatarUrl}
                        alt={store.owner.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {store.owner.name.charAt(0).toUpperCase()}
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

                  {/* Chat and Favorite Buttons */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      onClick={() => {
                        alert('Chức năng chat đang được phát triển');
                      }}
                      variant="outline"
                      className="w-full border-2"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat ngay
                    </Button>

                    <Button
                      onClick={handleToggleFavourite}
                      disabled={isLoadingFav}
                      variant="outline"
                      className="w-full border-2 hover:border-red-500 hover:bg-red-50 disabled:opacity-50"
                      size="sm"
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 transition-all ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                      />
                      {isFav ? 'Đã thích' : 'Thích'}
                    </Button>
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

        {/* Sport Rating Modal */}
        {ratingModalOpen && selectedSportForRating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between pb-3 sticky top-0 bg-white border-b z-10">
                <CardTitle className="text-xl">Đánh giá {selectedSportForRating.name}</CardTitle>
                <button
                  onClick={() => setRatingModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmittingRating}
                >
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Sport Info */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🏟️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{selectedSportForRating.name}</p>
                    <p className="text-sm text-gray-600 truncate">Tại {store?.name}</p>
                  </div>
                </div>

                {/* Star Rating Input */}
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
                        disabled={isSubmittingRating}
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

                {/* Comment Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bình luận của bạn (tùy chọn)
                  </label>
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    disabled={isSubmittingRating}
                    placeholder="Chia sẻ trải nghiệm của bạn về sân này..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[100px] disabled:bg-gray-50"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {ratingComment.length} / 500 ký tự
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hình ảnh (tùy chọn, tối đa 5)
                  </label>

                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      id="rating-images"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={isSubmittingRating || ratingImages.length >= 5}
                      className="hidden"
                    />
                    <label
                      htmlFor="rating-images"
                      className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isSubmittingRating || ratingImages.length >= 5
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
                          ({ratingImages.length}/5)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {ratingImagePreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh đã chọn ({ratingImagePreviews.length})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ratingImagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden border border-gray-200"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              disabled={isSubmittingRating}
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setRatingModalOpen(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmittingRating}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSubmitRating}
                    disabled={userRating === 0 || isSubmittingRating}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                  >
                    {isSubmittingRating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2 fill-white" />
                        Gửi đánh giá
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
