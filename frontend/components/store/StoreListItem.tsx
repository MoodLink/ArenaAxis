'use client';

// Component hiển thị store trong list view
import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, Eye, ShoppingCart, Heart, Share2 } from 'lucide-react';
import type { StoreSearchItemResponse } from '@/types';

interface StoreListItemProps {
  store: StoreSearchItemResponse;
}

export default function StoreListItem({ store }: StoreListItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const formatTime = (time?: string) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const getLocationText = () => {
    const parts = [];
    if (store.ward?.name) parts.push(store.ward.name);
    if (store.province?.name) parts.push(store.province.name);
    return parts.join(', ') || 'Chưa có địa chỉ';
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Share:', store.name);
  };

  return (
    <Link href={`/list-store/${store.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary h-72">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="relative w-full md:w-72 h-56 md:h-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
            {store.coverUrl ? (
              <img
                src={store.coverUrl}
                alt={store.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}

            {/* Avatar Badge */}
            {store.avatarUrl && (
              <div className="absolute top-4 left-4">
                <img
                  src={store.avatarUrl}
                  alt={store.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            )}

            {/* Like and Share Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 ${isLiked
                  ? 'bg-red-500 shadow-lg'
                  : 'bg-white/80 hover:bg-white'
                  }`}
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-gray-600'
                    }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm transition-all transform hover:scale-110"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 md:p-5 overflow-hidden flex flex-col">
            <div className="flex justify-between items-start gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors truncate">
                  {store.name}
                </h3>
              </div>
            </div>

            <div className="space-y-1.5 text-sm flex-1 min-w-0">
              {/* Location */}
              <div className="flex items-start gap-2 text-gray-600 flex-shrink-0">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                <span className="line-clamp-1 text-xs">{getLocationText()}</span>
              </div>

              {/* Opening Hours */}
              <div className="flex items-center gap-2 text-sm flex-shrink-0">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium truncate text-xs">
                  {formatTime(store.startTime)} - {formatTime(store.endTime)}
                </span>
              </div>

              {/* Stats and Rating - Bottom */}
              <div className="mt-auto pt-2 border-t space-y-1.5 flex-shrink-0">
                {/* Rating, Order, View Row - All in one line */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      {store.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-gray-600">
                      <ShoppingCart className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="font-medium">{store.orderCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-gray-600">
                      <Eye className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                      <span className="font-medium">{store.viewCount || 0}</span>
                    </div>
                    {likeCount > 0 && (
                      <span className="text-red-500 font-semibold">❤ {likeCount}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              {/* <button className="w-full mt-2 bg-primary text-white py-1.5 px-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors group-hover:shadow-lg flex-shrink-0">
                Xem chi tiết
              </button> */}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
