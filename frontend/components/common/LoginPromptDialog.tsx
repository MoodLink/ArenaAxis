"use client"

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface LoginPromptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    action?: string
    onLogin?: () => void
}

/**
 * Dialog để yêu cầu người dùng đăng nhập
 * Có thể tái sử dụng cho các tình huống khác nhau
 */
export function LoginPromptDialog({
    open,
    onOpenChange,
    title = 'Yêu cầu đăng nhập',
    description = 'Bạn cần đăng nhập để sử dụng chức năng này.',
    action = 'Đăng nhập',
    onLogin,
}: LoginPromptDialogProps) {
    const router = useRouter()

    const handleLogin = () => {
        onOpenChange(false)

        if (onLogin) {
            onLogin()
        } else {
            // Save current URL để redirect sau khi login
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search)
            }
            router.push('/login')
        }
    }

    const handleCancel = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation()
        }
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white">
                <button
                    onClick={(e) => handleCancel(e)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Đóng</span>
                </button>

                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3 justify-end">
                    <AlertDialogCancel onClick={(e) => handleCancel(e)}>
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogin}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {action}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
