'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { Sport } from '@/types'

interface SportModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (sportId: string) => void
    storeSports?: Sport[]  //  Thêm sports từ store
}

interface DisplaySport extends Sport {
    emoji: string
}

export default function SportSelectionModal({ isOpen, onClose, onConfirm, storeSports = [] }: SportModalProps) {
    const [selectedSport, setSelectedSport] = useState<string | null>(null)
    //  Dùng storeSports từ props (backend trả về) thay vì gọi getSports()
    const sports = storeSports
    const loading = false
    const error = sports.length === 0 ? 'Sân này không có môn thể thao nào' : null

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
                    <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
                        <div className="text-center">
                            <p className="text-gray-600">Đang tải môn thể thao...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || sports.length === 0) {
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
                            <p className="text-red-500 mb-4">{error || 'Sân này không có môn thể thao nào'}</p>
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
                                                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{sport.nameEn}</p>
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
