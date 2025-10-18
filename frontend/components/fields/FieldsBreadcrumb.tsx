// Breadcrumb cho trang sân thể thao
import Link from "next/link"

interface FieldsBreadcrumbProps {
    current?: string
}

export default function FieldsBreadcrumb({ current = "Sân thể thao" }: FieldsBreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-600 font-medium">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-emerald-700 font-semibold">{current}</span>
        </nav>
    )
}
