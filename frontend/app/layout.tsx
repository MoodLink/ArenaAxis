"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { NotificationProvider } from "@/components/providers/notification-context"
import GlobalNotificationCenter from "@/components/providers/global-notification-center"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isStoreRoute = pathname?.startsWith('/store') && !pathname?.includes('/store-booking') && !pathname?.includes('/store-view-history')
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'

  return (
    <html lang="vi">
      <head>
        <title>{isAdminRoute ? 'ArenaAxis Admin' : isStoreRoute ? 'Store Panel - ArenaAxis' : 'ArenaAxis - Find. Book. Play'}</title>
        <meta name="description" content={isAdminRoute ? 'Admin panel for ArenaAxis' : isStoreRoute ? 'Store management for ArenaAxis' : 'Choose the ideal court according to your playing style and budget'} />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <NotificationProvider>
          <QueryProvider>
            <AuthProvider>
              {!isAdminRoute && !isStoreRoute && !isAuthRoute && <Header />}
              <main>{children}</main>
              {!isAdminRoute && !isStoreRoute && !isAuthRoute && <Footer />}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
          <GlobalNotificationCenter />
        </NotificationProvider>
      </body>
    </html>
  )
}
