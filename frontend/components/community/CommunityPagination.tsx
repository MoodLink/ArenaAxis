"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onPrevPage: () => void
    onNextPage: () => void
}

export default function CommunityPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onPrevPage,
    onNextPage,
}: PaginationProps) {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

    if (totalPages <= 1) return null

    return (
        <Card className="shadow-sm">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-medium">{startIndex + 1}</span>-
                        <span className="font-medium">{endIndex}</span> trong số{" "}
                        <span className="font-medium">{totalItems}</span> kết quả
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onPrevPage}
                            disabled={currentPage === 1}
                            className="h-9 px-3"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Trước
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNumber: number
                                if (totalPages <= 5) {
                                    pageNumber = i + 1
                                } else {
                                    if (currentPage <= 3) {
                                        pageNumber = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i
                                    } else {
                                        pageNumber = currentPage - 2 + i
                                    }
                                }

                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`h-9 w-9 p-0 ${currentPage === pageNumber
                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {pageNumber}
                                    </Button>
                                )
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNextPage}
                            disabled={currentPage === totalPages}
                            className="h-9 px-3"
                        >
                            Sau
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}