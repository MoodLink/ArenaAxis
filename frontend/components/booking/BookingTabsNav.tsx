// Component tab navigation cho booking history
"use client"

import { Badge } from "@/components/ui/badge"
import { BookingTab } from "@/types"

interface BookingTabsNavProps {
    tabs: BookingTab[]
    activeTab: string
    setActiveTab: (tabId: string) => void
}

export default function BookingTabsNav({ tabs, activeTab, setActiveTab }: BookingTabsNavProps) {
    return (
        <div className="bg-white rounded-xl p-2 shadow-sm border">
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
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
                                className={isActive ? "bg-green-700 text-white" : ""}
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