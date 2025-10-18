"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, Navigation } from "lucide-react"
import { officeLocations } from "@/data/mockData"

export default function OfficeLocations() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Văn phòng & Chi nhánh</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    {officeLocations.map((office) => (
                        <Card key={office.id} className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{office.name}</CardTitle>
                                    {(office.isMain || office.type === "main") && (
                                        <Badge className="bg-blue-100 text-blue-700">
                                            Trụ sở chính
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-600">{office.address}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <a href={`tel:${office.phone}`} className="text-sm text-blue-600 hover:underline">
                                        {office.phone}
                                    </a>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="text-sm text-gray-600">
                                        {office.workingHours ? office.workingHours.map((hours, index) => (
                                            <div key={index}>{hours}</div>
                                        )) : (
                                            <div>Thứ 2 - Chủ nhật: 6:00 - 22:00</div>
                                        )}
                                    </div>
                                </div>

                                <Button variant="outline" size="sm" className="w-full">
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Chỉ đường
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}