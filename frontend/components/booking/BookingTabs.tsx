// Component tabs để lọc booking theo trạng thái
// Cho phép người dùng chuyển đổi giữa các trạng thái khác nhau

interface BookingTabsProps {
    activeTab: string // Tab hiện tại đang active
    onTabChange: (tab: string) => void // Callback khi thay đổi tab
    tabs?: string[] // Danh sách các tab (optional)
}

export default function BookingTabs({
    activeTab,
    onTabChange,
    tabs = ["Tất cả", "Sắp tới", "Đã xong", "Đã hủy"]
}: BookingTabsProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === tab
                                ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                                : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    )
}
