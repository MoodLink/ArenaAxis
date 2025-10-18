// Field Stats Component
// Hiển thị thống kê về sân thể thao

import AdminStats from "../shared/AdminStats"
import { MapPin, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { AdminField } from "@/data/mockDataAdmin"

interface FieldStatsProps {
  fields: AdminField[]
}

export default function FieldStats({ fields }: FieldStatsProps) {
  const totalFields = fields.length
  const availableFields = fields.filter(f => f.status === 'available').length
  const verifiedFields = fields.filter(f => f.isVerified).length
  const totalRevenue = fields.reduce((sum, field) => sum + field.revenueThisMonth, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

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
      title: "Sân đã xác minh",
      value: verifiedFields.toString(),
      icon: CheckCircle,
      iconColor: "text-blue-600"
    },
    {
      title: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      iconColor: "text-green-600"
    }
  ]

  return <AdminStats stats={statsData} />
}