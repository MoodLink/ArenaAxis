'use client'

import { use } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminStoreDetail from '@/components/admin/AdminStoreDetail'

interface StoreDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default function AdminStoreDetailPage({ params }: StoreDetailPageProps) {
    const { id } = use(params)

    return (
        <AdminLayout>
            <AdminStoreDetail storeId={id} />
        </AdminLayout>
    )
}
