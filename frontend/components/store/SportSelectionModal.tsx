'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Star, Loader2 } from 'lucide-react'
import { getSports } from '@/services/api-new'
import type { Sport } from '@/types'

interface SportModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (sportId: string) => void
}

interface DisplaySport extends Sport {
    emoji: string
    courtCount: number
    rating: string
    price: number
    description: string
}

export default function SportSelectionModal({ isOpen, onClose, onConfirm }: SportModalProps) {
    const [selectedSport, setSelectedSport] = useState<string | null>(null)
    const [sports, setSports] = useState<Sport[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) return

        const fetchSports = async () => {
            try {
                setLoading(true)
                setError(null)
                const sportsData = await getSports()
                setSports(sportsData)
                setSelectedSport(null)
            } catch (err) {
                console.error('Error fetching sports:', err)
                setError('Không thể tải danh sách môn thể thao')
                setSports([])
            } finally {
                setLoading(false)
            }
        }

        fetchSports()
    }, [isOpen])

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

    const displaySports: DisplaySport[] = sports.map(sport => ({
        ...sport,
        emoji: sportEmojis[sport.id?.toLowerCase()] || '🏟️',
        courtCount: Math.floor(Math.random() * 5) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        price: (Math.floor(Math.random() * 150) + 100) * 1000,
        description: `Sân ${sport.name.toLowerCase()} - Đặt ngay để được ưu đãi tốt nhất`,
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

    if (!isOpen) return null

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md shadow-2xl border-0">
                    <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                            <p className="text-gray-600">Đang tải môn thể thao...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md shadow-2xl border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-2xl">Chọn môn thể thao</CardTitle>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={onClose} variant="outline">
                                Đóng
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className={`w-full shadow-2xl border-0 ${numColumns > 1 ? 'max-w-4xl' : 'max-w-md'
                }`}>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-2xl">Chọn môn thể thao</CardTitle>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {displaySports.length > 0 ? (
                        <>
                            <div className={`grid grid-cols-1 ${gridColsClass} gap-3`}>
                                {columns.map((column, colIndex) => (
                                    <div key={`col-${colIndex}`} className="space-y-3">
                                        {column.map((sport) => (
                                            <div
                                                key={sport.id}
                                                onClick={() => setSelectedSport(sport.id)}
                                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSport === sport.id
                                                        ? 'border-emerald-600 bg-emerald-50 shadow-md'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <div className="text-2xl flex-shrink-0">{sport.emoji}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm truncate">{sport.name}</h3>
                                                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{sport.description}</p>
                                                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                                🏟️ {sport.courtCount}
                                                            </span>
                                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                                <Star className="w-2.5 h-2.5 fill-current" /> {sport.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {selectedSport === sport.id && (
                                                        <div className="text-emerald-600 text-lg flex-shrink-0">✓</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button onClick={onClose} variant="outline" className="flex-1">
                                    Hủy
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedSport) {
                                            onConfirm(selectedSport)
                                            setSelectedSport(null)
                                        }
                                    }}
                                    disabled={!selectedSport}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Tiếp tục
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Không có môn thể thao nào</p>
                            <Button onClick={onClose} className="mt-4" variant="outline">
                                Đóng
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
