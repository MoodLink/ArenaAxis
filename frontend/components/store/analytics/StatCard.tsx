import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: React.ElementType
    subtext: string
    color?: 'blue' | 'green' | 'purple' | 'orange'
}

export default function StatCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    subtext,
    color = 'blue'
}: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                    </div>
                    <div className="text-right">
                        <div className={`p-3 rounded-lg mb-2 ${colorClasses[color]}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {changeType === 'increase' ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <span>{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}