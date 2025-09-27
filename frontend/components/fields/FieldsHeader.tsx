// Component hiển thị header cho trang fields
// Bao gồm breadcrumb, tiêu đề, mô tả và các thông tin khác

import Link from "next/link"
import { MapPin, Users, Award } from "lucide-react"

interface FieldsHeaderProps {
    totalFields: number
}

export default function FieldsHeader({ totalFields }: FieldsHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header Content */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold">Khám phá sân thể thao</h1>
                                <p className="text-emerald-100 text-lg mt-1">
                                    Tìm kiếm và đặt sân thể thao chất lượng cao gần bạn
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="bg-white/20 px-3 py-2 rounded-full">
                                <span>{totalFields} sân có sẵn</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <Users className="w-4 h-4" />
                                <span>1000+ người dùng</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <Award className="w-4 h-4" />
                                <span>Chất lượng đảm bảo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
