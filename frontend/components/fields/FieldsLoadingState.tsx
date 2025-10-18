// Component loading state cho trang fields
// Hiển thị khi đang tải dữ liệu sân

export default function FieldsLoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tải danh sách sân...</p>
            </div>
        </div>
    )
}
