'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
    return (
        <nav className={`flex items-center gap-1 text-sm ${className}`} aria-label="Breadcrumb">
            <div className="flex items-center gap-1">
                <Link
                    href="/"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span>Trang chủ</span>
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    {item.href && !item.isActive ? (
                        <>
                            <Link
                                href={item.href}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                            {index < items.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                        </>
                    ) : (
                        <>
                            <span className={item.isActive ? 'text-primary font-semibold' : 'text-gray-600'}>
                                {item.label}
                            </span>
                            {index < items.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                        </>
                    )}
                </div>
            ))}
        </nav>
    );
}
