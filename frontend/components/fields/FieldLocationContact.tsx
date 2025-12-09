// Component hiển thị thông tin liên hệ và vị trí
// Bao gồm địa chỉ, số điện thoại, email và bản đồ

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import { Field } from "@/types"

interface FieldLocationContactProps {
    field: Field
}

export default function FieldLocationContact({ field }: FieldLocationContactProps) {
    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Địa điểm & Liên hệ</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                                <p className="text-gray-600">{field.address || field.location || 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Số điện thoại</h3>
                                <p className="text-gray-600">{field.phone || 'Liên hệ qua store'}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">@</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                <p className="text-gray-600">{field.email || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg h-48 flex items-center justify-center border border-emerald-100">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                            <span className="text-gray-600 font-medium">Bản đồ tương tác</span>
                            <p className="text-sm text-gray-500 mt-1">Nhấn để xem đường đi</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
