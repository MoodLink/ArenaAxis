// Component hiển thị nội dung danh sách sân
// Hỗ trợ cả grid view và list view với responsive layout

import { Field } from "@/types"
import FieldGridCard from "./FieldGridCard"
import FieldListItem from "./FieldListItem"

interface FieldsContentProps {
    fields: Field[]
    viewMode: "grid" | "list"
    onFavoriteClick: (fieldId: string) => void
    onMenuClick?: (fieldId: string) => void
}

export default function FieldsContent({
    fields,
    viewMode,
    onFavoriteClick,
    onMenuClick
}: FieldsContentProps) {
    if (fields.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl text-gray-400">🏟️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy sân nào
                </h3>
                <p className="text-gray-500">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
                </p>
            </div>
        )
    }

    return (
        <div className="mb-8">
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {fields.map((field, index) => (
                        <FieldGridCard
                            key={field._id || field.id || `field-${index}`}
                            field={field}
                            onFavoriteClick={onFavoriteClick}
                            onMenuClick={onMenuClick}
                        />
                    ))}
                </div>
            )}

            {viewMode === "list" && (
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <FieldListItem
                            key={field._id || field.id || `field-${index}`}
                            field={field}
                            onFavoriteClick={onFavoriteClick}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
