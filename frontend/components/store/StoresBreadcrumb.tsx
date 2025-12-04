// Component hiển thị breadcrumb cho trang stores
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface StoresBreadcrumbProps {
    current: string
}

export default function StoresBreadcrumb({ current }: StoresBreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link
                href="/"
                className="flex items-center hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{current}</span>
        </nav>
    )
}
