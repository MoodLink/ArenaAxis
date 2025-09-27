// Component tabs hiện đại với icons và counters
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface TabItem {
    id: string
    label: string
    icon: LucideIcon
    count: number
}

interface ModernTabsProps {
    tabs: TabItem[]
    activeTab: string
    onTabChange: (tabId: string) => void
    className?: string
}

export default function ModernTabs({ tabs, activeTab, onTabChange, className = "" }: ModernTabsProps) {
    return (
        <div className={`bg-white rounded-xl p-2 shadow-sm border ${className}`}>
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 
                ${isActive
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
              `}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            <Badge
                                variant={isActive ? "secondary" : "outline"}
                                className={`
                  ${isActive ? "bg-green-700 text-white border-green-700" : "border-gray-200"}
                  text-xs px-2 py-0.5
                `}
                            >
                                {tab.count}
                            </Badge>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}