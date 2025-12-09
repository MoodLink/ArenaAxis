import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "ArenaAxis Admin - Dashboard",
    description: "Admin panel for ArenaAxis sports field booking system",
    generator: 'ArenaAxis Admin'
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}