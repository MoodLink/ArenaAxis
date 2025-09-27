"use client"

import {
    User,
    Activity,
    Award,
    Settings
} from "lucide-react"

interface ProfileTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    const tabs = [
        { id: "overview", label: "Tổng quan", icon: User },
        { id: "activities", label: "Hoạt động", icon: Activity },
        { id: "achievements", label: "Thành tựu", icon: Award },
        { id: "settings", label: "Cài đặt", icon: Settings }
    ]

    return (
        <div className="bg-white border-b sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? "border-green-600 text-green-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}