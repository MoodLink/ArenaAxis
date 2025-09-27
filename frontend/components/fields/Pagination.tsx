// Component phân trang cho danh sách sân thể thao
// Hỗ trợ navigation giữa các trang với UI đẹp mắt

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    itemsPerPage: number
    totalItems: number
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show first page
            pages.push(1)

            // Determine range around current page
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // Adjust range if too close to beginning or end
            if (currentPage <= 3) {
                end = Math.min(totalPages - 1, 4)
            } else if (currentPage >= totalPages - 2) {
                start = Math.max(2, totalPages - 3)
            }

            // Add ellipsis after 1 if needed
            if (start > 2) {
                pages.push(-1) // -1 represents ellipsis
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push(-2) // -2 represents ellipsis
            }

            // Show last page
            if (totalPages > 1) {
                pages.push(totalPages)
            }
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            {/* Items info */}
            <div className="text-sm text-gray-600">
                Hiển thị <span className="font-medium">{startItem}</span> đến{" "}
                <span className="font-medium">{endItem}</span> trong tổng số{" "}
                <span className="font-medium">{totalItems}</span> kết quả
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />

                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pages.map((page, index) => {
                        if (page === -1 || page === -2) {
                            return (
                                <div key={`ellipsis-${index}`} className="px-2">
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </div>
                            )
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={`min-w-[40px] ${currentPage === page
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "hover:bg-emerald-50 hover:border-emerald-300"
                                    }`}
                            >
                                {page}
                            </Button>
                        )
                    })}
                </div>

                {/* Next button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                >

                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}