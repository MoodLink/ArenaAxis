import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
    size?: number
    className?: string
}

export default function StarRating({ rating, size = 5, className = "" }: StarRatingProps) {
    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-${size} w-${size} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    )
}