// Component pagination giống fields
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    itemsPerPage: number
    totalItems: number
}

export default function StoresPagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const generatePageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push("...")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("...")
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push("...")
                pages.push(currentPage - 1)
                pages.push(currentPage)
                pages.push(currentPage + 1)
                pages.push("...")
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-md">
            <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold">{startItem}</span> đến{" "}
                <span className="font-semibold">{endItem}</span> trong tổng số{" "}
                <span className="font-semibold">{totalItems}</span> Trung tâm thể thao
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 text-gray-400">
                                ...
                            </span>
                        )
                    }

                    return (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page as number)}
                            className="min-w-[40px]"
                        >
                            {page}
                        </Button>
                    )
                })}

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
