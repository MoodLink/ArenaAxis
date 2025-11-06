import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getSports } from "@/services/api-new"
import type { StoreClientDetailResponse, Sport } from "@/types"

interface StoreSportsListProps {
    store: StoreClientDetailResponse
    onBookClick: () => void
}

export default function StoreSportsList({ store, onBookClick }: StoreSportsListProps) {
    const [sports, setSports] = useState<Sport[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const sportsData = await getSports()
                setSports(sportsData)
            } catch (error) {
                console.error('Error fetching sports:', error)
                setSports([])
            } finally {
                setLoading(false)
            }
        }

        fetchSports()
    }, [])

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
        'badminton': '�',
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
        courtCount: Math.floor(Math.random() * 5) + 1, // Mock court count
        rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating 3.0-5.0
        price: (Math.floor(Math.random() * 150) + 100) * 1000, // Mock price 100k-250k
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
                                                        🏟️ {sport.courtCount}
                                                    </span>
                                                    <div className="flex items-center gap-0.5">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs font-semibold text-gray-700">
                                                            {sport.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={onBookClick}
                                            className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0"
                                            size="sm"
                                        >
                                            Đặt
                                        </Button>
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
                <Button
                    onClick={onBookClick}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white h-12 text-base font-semibold"
                >
                    🛒 Đặt sân ngay
                </Button>
            </CardContent>
        </Card>
    )
}