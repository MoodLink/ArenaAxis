'use client'

import { createContext, useEffect, useState } from 'react'
import { validate } from '@/services/auth.service'
import { Location, useLocation } from '@/hooks/use-location'
import { User } from '@/types'
import { useMemo } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	isLoading: boolean
	user: User | null,
	location: Location | null
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isLoading: true,
	user: null,
	location: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState(null)
	const { location } = useLocation()

	useEffect(() => {
		const validateToken = async () => {
			try {
				const token = localStorage.getItem('token')
				const userStr = localStorage.getItem('user')

				// Chỉ cần check token và user trong localStorage, không cần gọi API
				if (!token || !userStr) {
					setIsAuthenticated(false)
					setUser(null)
					setIsLoading(false)
					return
				}

				// Parse user data
				const userData = JSON.parse(userStr)
				setIsAuthenticated(true)
				setUser(userData)
				setIsLoading(false)
			} catch (error) {
				console.error('Auth validation failed:', error)
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				setIsAuthenticated(false)
				setUser(null)
				setIsLoading(false)
			}
		}

		validateToken()
	}, [])

	const contextValue = useMemo(() => ({
		isAuthenticated,
		isLoading,
		user,
		location
	}), [isAuthenticated, isLoading, user, location])

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}