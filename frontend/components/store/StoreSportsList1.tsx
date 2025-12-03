import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStoreRatings } from "@/services/api-new"
import type { StoreClientDetailResponse, Sport } from "@/types"

interface StoreSportsListProps {
    store: StoreClientDetailResponse
    onBookClick: () => void
}

interface SportRating {
    sportId: string
    averageRating: number
    totalRatings: number
}

export default function StoreSportsList({ store, onBookClick }: StoreSportsListProps) {
    //  Dùng sports từ store (backend trả về) thay vì gọi getSports()
    const sports = store.sports || []
    const router = useRouter()
    const [sportRatings, setSportRatings] = useState<Record<string, SportRating>>({})
    const [loading, setLoading] = useState(true)

    //  Fetch ratings và tính average rating cho từng sport
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                setLoading(true)
                const ratings = await getStoreRatings(store.id, 0, 100)

                // Group ratings by sport và tính average
                const ratingsBySport: Record<string, SportRating> = {}

                ratings.forEach((rating: any) => {
                    const sportId = rating.sport?.id
                    if (!sportId) return

                    if (!ratingsBySport[sportId]) {
                        ratingsBySport[sportId] = {
                            sportId,
                            averageRating: 0,
                            totalRatings: 0,
                        }
                    }

                    ratingsBySport[sportId].totalRatings += 1
                    ratingsBySport[sportId].averageRating += (rating.star || 0)
                })

                // Tính average
                Object.keys(ratingsBySport).forEach((sportId) => {
                    ratingsBySport[sportId].averageRating =
                        ratingsBySport[sportId].averageRating / ratingsBySport[sportId].totalRatings
                })

                setSportRatings(ratingsBySport)
            } catch (error) {
                console.error('Error fetching ratings:', error)
            } finally {
                setLoading(false)
            }
        }

        if (store.id) {
            fetchRatings()
        }
    }, [store.id])

    const handleSportBookClick = (sportId: string) => {
        router.push(`/store-booking?store_id=${store.id}&sport_id=${sportId}`)
    }

    if (loading) {
        return (
            <Card className="shadow-lg border-0">
                <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                        <p className="text-gray-600">Đang tải môn thể thao...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Map emoji for each sport
    const sportEmojis: Record<string, string> = {
        'badminton': '🏸',
        'volleyball': '🏐',
        'basketball': '🏀',
        'football': '⚽',
        'tennis': '🎾',
        'pingpong': '🏓',
        'swimming': '🏊',
        'pickleball': '🎾',
    }

    const displaySports = sports.map(sport => ({
        ...sport,
        emoji: sportEmojis[sport.id?.toLowerCase()] || '🏟️',
    }))

    // Calculate number of columns needed (4 items per column)
    const itemsPerColumn = 4
    const numColumns = Math.ceil(displaySports.length / itemsPerColumn)

    // Split sports into columns dynamically
    const columns = Array.from({ length: numColumns }, (_, colIndex) =>
        displaySports.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
    )

    // Determine grid columns class based on number of columns
    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    }[Math.min(numColumns, 4)] || 'md:grid-cols-4'

    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Các môn thể thao</h2>
                <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
                    {displaySports.length > 0 ? (
                        columns.map((column, colIndex) => (
                            <div key={`col-${colIndex}`} className="space-y-4">
                                {column.map((sport, index) => (
                                    <div
                                        key={sport.id || `${colIndex}-${index}`}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border border-blue-200 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="text-3xl flex-shrink-0">{sport.emoji}</div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{sport.name}</h3>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="text-xs text-gray-600">
                                                        {sport.nameEn && `(${sport.nameEn})`}
                                                    </span>
                                                    {/*  Hiển thị rating */}
                                                    {sportRatings[sport.id] && (
                                                        <div className="flex items-center gap-0.5">
                                                            <div className="flex">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={14}
                                                                        className={
                                                                            i < Math.round(sportRatings[sport.id].averageRating)
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300'
                                                                        }
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-semibold text-gray-700 ml-1">
                                                                {sportRatings[sport.id].averageRating.toFixed(1)} ({sportRatings[sport.id].totalRatings})
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <Button
                                            onClick={() => handleSportBookClick(sport.id)}
                                            className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0"
                                            size="sm"
                                        >
                                            Đặt
                                        </Button> */}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 col-span-1 md:col-span-2">
                            <p className="text-gray-500">Không có môn thể thao nào</p>
                        </div>
                    )}
                </div>

                {/* Footer Button */}
                {/* <Button
                    onClick={onBookClick}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white h-12 text-base font-semibold"
                >
                    🛒 Đặt sân ngay
                </Button> */}
            </CardContent>
        </Card>
    )
}