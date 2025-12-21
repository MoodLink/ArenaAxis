import { useEffect, useState } from 'react'
import { User } from '@/types'

/**
 * Hook để quản lý auth state
 * Lấy user từ localStorage hoặc session
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true)

                // Thử lấy từ localStorage trước
                const storedUser = localStorage.getItem('user')
                if (storedUser) {
                    setUser(JSON.parse(storedUser))
                    setLoading(false)
                    return
                }

                // Thử gọi API để lấy user hiện tại
                const token = localStorage.getItem('token')
                if (!token) {
                    setLoading(false)
                    return
                }

                const response = await fetch('https://www.executexan.store/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData)
                    localStorage.setItem('user', JSON.stringify(userData))
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load user'
                setError(errorMessage)
                console.error('Error loading user:', err)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    return { user, loading, error }
}
