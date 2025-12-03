'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, Eye, ShoppingCart, Heart, Share2, Phone } from 'lucide-react';
import type { StoreSearchItemResponse } from '@/types';
import { toggleFavourite, isFavourite } from '@/services/api-new';
import { useToast } from '@/hooks/use-toast';
import { emitFavouriteChange, useFavouriteSync } from '@/hooks/use-favourite-sync';

interface StoreCardProps {
  store: StoreSearchItemResponse;
  selectedSportId?: string;
  isFav?: boolean; // Accept isFav from parent to avoid duplicate checks
}

export function StoreCard({ store, selectedSportId, isFav: initialIsFav }: StoreCardProps) {
  const [isFav, setIsFav] = useState(initialIsFav || false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Listen to favourite changes from other components
  useFavouriteSync(store.id, (newState) => {
    setIsFav(newState);
  });

  const formatTime = (time?: string) => {
    if (!time) return '--:--';
    return time.substring(0, 5); // HH:mm
  };

  const getLocationText = () => {
    const parts = [];
    if (store.ward?.name) parts.push(store.ward.name);
    if (store.province?.name) parts.push(store.province.name);
    return parts.join(', ') || 'Chưa có địa chỉ';
  };

  const handleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingFav) return;

    setIsLoadingFav(true);
    try {
      const newState = await toggleFavourite(store.id);
      setIsFav(newState);

      // Emit event để notify các component khác
      emitFavouriteChange(store.id, newState);

      toast({
        title: newState ? ' Đã thêm vào yêu thích' : ' Đã xóa khỏi yêu thích',
        description: `"${store.name}"`,
      });
    } catch (error: any) {
      toast({
        title: ' Lỗi',
        description: error?.message || 'Không thể cập nhật yêu thích',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Share:', store.name);
    toast({
      title: 'Chức năng chia sẻ',
      description: 'Sẽ được cập nhật trong phiên bản tiếp theo',
    });
  };

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSportId) return;

    router.push(`/store-booking?store_id=${store.id}&sport_id=${selectedSportId}`);
  };

  return (
    <div
      onClick={(e) => {
        // If sport is selected and user clicks on the card, treat it as a regular click
        // Button clicks will be handled by the button handler
        if (!selectedSportId) {
          // No sport selected, treat as normal link
          const link = document.createElement('a');
          link.href = `/list-store/${store.id}`;
          link.click();
        }
      }}
    >
      <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary h-[520px] flex flex-col">
        {/* Cover Image */}
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300 flex-shrink-0">
          {store.coverUrl ? (
            <img
              src={store.coverUrl}
              alt={store.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                // Nếu ảnh fail, set background gradient
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
          )}

          {/* Like and Share Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleFavourite}
              disabled={isLoadingFav}
              className={`p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-120 disabled:opacity-50 shadow-lg ${isFav
                ? 'bg-red-500 text-white'
                : 'bg-white/90 hover:bg-white text-gray-700'
                }`}
              title={isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart
                className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`}
              />
            </button>
            {/* <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white/90 hover:bg-white backdrop-blur-md transition-all transform hover:scale-120 shadow-lg text-gray-700"
              title="Chia sẻ"
            >
              <Share2 className="w-6 h-6" />
            </button> */}
          </div>

          {/* Avatar Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center gap-3">
              {store.avatarUrl ? (
                <img
                  src={store.avatarUrl}
                  alt={store.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate drop-shadow-lg">
                  {store.name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Location, Time and Book Button Row */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-1 min-w-0">
              <MapPin className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span className="line-clamp-1 font-medium">{getLocationText()}</span>
            </div>

            {/* Book Button - when sport is selected */}
            {selectedSportId && (
              <button
                onClick={handleBooking}
                title="Đặt ngay"
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-xs hover:shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
              >
                🛒
              </button>
            )}
          </div>

          {/* Opening Hours */}
          <div className="flex items-center gap-2 text-sm flex-shrink-0 mt-2">
            <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <span className="text-gray-700 font-semibold truncate">
              {formatTime(store.startTime)} - {formatTime(store.endTime)}
            </span>
          </div>

          {/* Stats and Rating - Bottom */}
          <div className="mt-auto pt-3 border-t flex-shrink-0">
            {/* Rating, Order, View Row - evenly spaced */}
            <div className="flex items-center mb-3 gap-2 justify-between">
              <div className="flex-1 flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg min-w-0">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="font-bold text-gray-900 truncate">
                  {store.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <div className="flex-1 flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg min-w-0 justify-center">
                <ShoppingCart className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-gray-700 text-sm truncate">{store.orderCount || 0}</span>
              </div>
              <div className="flex-1 flex items-center gap-1.5 bg-purple-50 px-2.5 py-1.5 rounded-lg min-w-0 justify-end">
                <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-semibold text-gray-700 text-sm truncate">{store.viewCount || 0}</span>
              </div>
            </div>

            {/* Favourite Badge Row - Always renders to maintain consistent height */}
            {/* <div className="h-8 mb-3">
              {isFav && (
                <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1.5 rounded-lg w-fit h-full">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500 flex-shrink-0" />
                  <span className="font-semibold text-red-600 text-sm">Yêu thích</span>
                </div>
              )}
            </div> */}
          </div>

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!selectedSportId) {
                router.push(`/list-store/${store.id}`);
              }
            }}
            className="w-full mt-3 bg-gradient-to-r from-primary to-primary/80 text-white py-2.5 px-3 rounded-lg font-bold text-sm hover:shadow-lg transition-all group-hover:shadow-xl flex-shrink-0"
          >
            Xem chi tiết
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
