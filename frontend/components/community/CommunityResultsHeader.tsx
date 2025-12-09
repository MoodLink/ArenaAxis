// Component hiển thị header kết quả tìm kiếm và thông tin pagination
// Bao gồm số kết quả, trang hiện tại, tổng lượt quan tâm

import { Users } from "lucide-react"
import { CommunityPost } from "@/types"

interface CommunityResultsHeaderProps {
    filteredPosts: CommunityPost[]
    currentPage: number
    totalPages: number
    startIndex: number
    endIndex: number
    itemsPerPage: number
}

export default function CommunityResultsHeader({
    filteredPosts,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage
}: CommunityResultsHeaderProps) {
    const totalLikes = filteredPosts.reduce((acc, post) => acc + post.likes, 0)

    if (filteredPosts.length === 0) {
        return (
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Không tìm thấy hoạt động
                </h2>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between">
            {/* <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    {filteredPosts.length} hoạt động
                </h2>
                {totalPages > 1 && (
                    <p className="text-sm text-gray-600 mt-1">
                        Trang {currentPage} / {totalPages} • Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} trong số {filteredPosts.length}
                    </p>
                )}
            </div>
            {filteredPosts.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{totalLikes} lượt quan tâm</span>
                </div>
            )} */}
        </div>
    )
}