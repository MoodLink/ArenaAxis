import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    Legend
} from 'recharts'
import {
    Target,
    Award,
    Zap,
    Activity,
    TrendingUp,
    TrendingDown
} from 'lucide-react'

interface PerformanceMetric {
    subject: string
    A: number
    B: number
    fullMark: number
}

interface PerformanceMetricsProps {
    performanceMetrics: PerformanceMetric[]
}

export default function PerformanceMetrics({ performanceMetrics }: PerformanceMetricsProps) {
    // Calculate performance scores
    const currentScore = performanceMetrics.reduce((sum, metric) => sum + metric.A, 0) / performanceMetrics.length
    const previousScore = performanceMetrics.reduce((sum, metric) => sum + metric.B, 0) / performanceMetrics.length
    const scoreChange = currentScore - previousScore
    const scoreChangePercent = ((scoreChange / previousScore) * 100).toFixed(1)

    // Key performance indicators
    const kpis = [
        {
            title: 'Điểm hiệu suất tổng',
            value: currentScore.toFixed(1),
            change: scoreChangePercent,
            changeType: scoreChange >= 0 ? 'increase' : 'decrease' as const,
            icon: Target,
            color: 'blue',
            description: 'Điểm trung bình các chỉ số'
        },
        {
            title: 'Chỉ số xuất sắc',
            value: performanceMetrics.filter(m => m.A >= 85).length.toString(),
            change: '+2',
            changeType: 'increase' as const,
            icon: Award,
            color: 'green',
            description: 'Số chỉ số đạt mức xuất sắc'
        },
        {
            title: 'Tăng trưởng',
            value: `${scoreChangePercent}%`,
            change: scoreChangePercent,
            changeType: scoreChange >= 0 ? 'increase' : 'decrease' as const,
            icon: Zap,
            color: 'purple',
            description: 'So với kỳ trước'
        },
        {
            title: 'Hiệu quả vận hành',
            value: `${performanceMetrics.find(m => m.subject === 'Hiệu quả vận hành')?.A || 0}%`,
            change: '+4.2%',
            changeType: 'increase' as const,
            icon: Activity,
            color: 'orange',
            description: 'Tối ưu hóa quy trình'
        }
    ]

    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`p-3 rounded-lg mb-2 ${colorMap[kpi.color as keyof typeof colorMap]}`}>
                                        <kpi.icon className="h-6 w-6" />
                                    </div>
                                    <div className={`flex items-center text-sm ${kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {kpi.changeType === 'increase' ? (
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 mr-1" />
                                        )}
                                        <span>{kpi.change}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Performance Radar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Biểu đồ hiệu suất tổng thể</CardTitle>
                    <CardDescription>So sánh các chỉ số hiệu suất giữa kỳ hiện tại và kỳ trước</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={performanceMetrics}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                <Radar
                                    name="Kỳ hiện tại"
                                    dataKey="A"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                                <Radar
                                    name="Kỳ trước"
                                    dataKey="B"
                                    stroke="#94a3b8"
                                    fill="#94a3b8"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle>So sánh chi tiết các chỉ số</CardTitle>
                    <CardDescription>Thay đổi từng chỉ số hiệu suất</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                                <Legend />
                                <Bar dataKey="A" fill="#3b82f6" name="Kỳ hiện tại" />
                                <Bar dataKey="B" fill="#94a3b8" name="Kỳ trước" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-600">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Điểm mạnh
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {performanceMetrics
                                .filter(metric => metric.A > metric.B)
                                .sort((a, b) => (b.A - b.B) - (a.A - a.B))
                                .slice(0, 3)
                                .map((metric, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{metric.subject}</p>
                                            <p className="text-sm text-gray-600">
                                                Cải thiện {metric.A - metric.B} điểm
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">{metric.A}%</div>
                                            <div className="text-xs text-green-600">
                                                +{((metric.A - metric.B) / metric.B * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-orange-600">
                            <Target className="h-5 w-5 mr-2" />
                            Cần cải thiện
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {performanceMetrics
                                .filter(metric => metric.A < 80)
                                .sort((a, b) => a.A - b.A)
                                .slice(0, 3)
                                .map((metric, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{metric.subject}</p>
                                            <p className="text-sm text-gray-600">
                                                Cần đạt tối thiểu 80%
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-orange-600">{metric.A}%</div>
                                            <div className="text-xs text-orange-600">
                                                Thiếu {80 - metric.A} điểm
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Khuyến nghị hành động</CardTitle>
                    <CardDescription>Các bước cải thiện hiệu suất</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="bg-blue-500 text-white rounded-full p-1 text-xs font-bold w-6 h-6 flex items-center justify-center">1</div>
                            <div>
                                <h4 className="font-medium text-gray-900">Tập trung vào hiệu quả vận hành</h4>
                                <p className="text-sm text-gray-600">
                                    Cải thiện quy trình đặt sân và dịch vụ khách hàng để nâng cao điểm số từ {
                                        performanceMetrics.find(m => m.subject === 'Hiệu quả vận hành')?.A || 0
                                    }% lên 85%+
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 border border-green-200 rounded-lg bg-green-50">
                            <div className="bg-green-500 text-white rounded-full p-1 text-xs font-bold w-6 h-6 flex items-center justify-center">2</div>
                            <div>
                                <h4 className="font-medium text-gray-900">Duy trì thế mạnh về doanh thu</h4>
                                <p className="text-sm text-gray-600">
                                    Tiếp tục phát huy điểm mạnh về doanh thu ({
                                        performanceMetrics.find(m => m.subject === 'Doanh thu')?.A || 0
                                    }%) và tỷ lệ đặt sân cao
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 border border-purple-200 rounded-lg bg-purple-50">
                            <div className="bg-purple-500 text-white rounded-full p-1 text-xs font-bold w-6 h-6 flex items-center justify-center">3</div>
                            <div>
                                <h4 className="font-medium text-gray-900">Nâng cao tỷ lệ khách hàng quay lại</h4>
                                <p className="text-sm text-gray-600">
                                    Xây dựng chương trình loyalty và cải thiện chất lượng dịch vụ để tăng retention rate
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}