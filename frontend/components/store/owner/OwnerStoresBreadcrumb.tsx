import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbProps {
    current: string
}

export default function OwnerStoresBreadcrumb({ current }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link
                href="/store"
                className="flex items-center gap-1 hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{current}</span>
        </nav>
    )
}
