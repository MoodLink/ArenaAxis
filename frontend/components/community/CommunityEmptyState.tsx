// Component hiển thị khi không có kết quả tìm kiếm
// Khuyến khích người dùng tạo hoạt động mới

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function CommunityEmptyState() {
    return (
        <Card className="text-center py-12">
            <CardContent>
                <div className="text-gray-400 text-6xl mb-4">🏆</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có hoạt động phù hợp
                </h3>
                <p className="text-gray-600 mb-6">
                    Thử thay đổi bộ lọc hoặc tạo một hoạt động mới để bắt đầu!
                </p>
                <Link href="/community/create">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo hoạt động đầu tiên
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}