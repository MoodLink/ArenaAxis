"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isStoreRoute = pathname?.startsWith('/store')
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'

  return (
    <html lang="vi">
      <head>
        <title>{isAdminRoute ? 'ArenaAxis Admin' : isStoreRoute ? 'Store Panel - ArenaAxis' : 'ArenaAxis - Find. Book. Play'}</title>
        <meta name="description" content={isAdminRoute ? 'Admin panel for ArenaAxis' : isStoreRoute ? 'Store management for ArenaAxis' : 'Choose the ideal court according to your playing style and budget'} />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {!isAdminRoute && !isStoreRoute && !isAuthRoute && <Header />}
        <main>{children}</main>
        {!isAdminRoute && !isStoreRoute && !isAuthRoute && <Footer />}
      </body>
    </html>
  )
}
