import AdminLayout from '@/components/admin/AdminLayout'
import DashboardStats from '@/components/admin/DashboardStats'
import { RecentBookings, TopFields, RecentActivities } from '@/components/admin/DashboardWidgets'
import { RevenueChart, SportsChart } from '@/components/admin/AnalyticsDashboard'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan về hoạt động của hệ thống ArenaAxis</p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <SportsChart />
        </div>

        {/* Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentBookings />
          <TopFields />
          <RecentActivities />
        </div>
      </div>
    </AdminLayout>
  )
}