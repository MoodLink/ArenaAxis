// Field Stats Component
// Hiển thị thống kê về sân thể thao

import AdminStats from "../shared/AdminStats"
import { MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { AdminField } from "@/data/mockDataAdmin"

interface FieldStatsProps {
  fields: AdminField[]
}

export default function FieldStats({ fields }: FieldStatsProps) {
  const totalFields = fields.length
  const availableFields = fields.filter(f => f.status === 'available').length
  const unavailableFields = fields.filter(f => f.status !== 'available').length

  const statsData = [
    {
      title: "Tổng sân",
      value: totalFields.toString(),
      icon: MapPin,
      iconColor: "text-blue-600"
    },
    {
      title: "Sân hoạt động",
      value: availableFields.toString(),
      icon: CheckCircle,
      iconColor: "text-green-600"
    },
    {
      title: "Sân tạm ngưng",
      value: unavailableFields.toString(),
      icon: AlertCircle,
      iconColor: "text-red-600"
    }
  ]

  return <AdminStats stats={statsData} />
}