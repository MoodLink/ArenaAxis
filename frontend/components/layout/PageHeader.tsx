import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href?: string
    isActive?: boolean
}

interface PageHeaderProps {
    title: string
    subtitle?: string
    breadcrumbs: BreadcrumbItem[]
    backgroundImage?: string
    gradientFrom?: string
    gradientTo?: string
    actions?: React.ReactNode
    badge?: string
    icon?: React.ReactNode
}

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    backgroundImage,
    gradientFrom = "emerald-500",
    gradientTo = "blue-600",
    actions,
    badge,
    icon
}: PageHeaderProps) {
    return (
        <div className="mb-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>Trang chủ</span>
                </Link>
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {item.href && !item.isActive ? (
                            <Link href={item.href} className="hover:text-emerald-600 transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={item.isActive ? "text-gray-800 font-medium" : "text-gray-600"}>
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </nav>

            {/* Header Section */}
            <div
                className={`relative rounded-2xl overflow-hidden ${backgroundImage ? 'bg-cover bg-center' : `bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`
                    } text-white`}
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
            >
                {/* Overlay for background image */}
                {backgroundImage && (
                    <div className="absolute inset-0 bg-black/40"></div>
                )}

                <div className="relative p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                {icon && (
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        {icon}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
                                    {badge && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90">
                                            {badge}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {subtitle && (
                                <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {actions && (
                            <div className="flex items-center gap-3 ml-6">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
        </div>
    )
}
