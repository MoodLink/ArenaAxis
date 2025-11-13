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
				const user = localStorage.getItem('user')

				if (!token || !user) {
					setIsAuthenticated(false)
					setUser(null)
					return
				}

				const response = await validate()
				if (!response) {
					localStorage.removeItem('token')
					localStorage.removeItem('user')
					setIsAuthenticated(false)
					setUser(null)
					return
				}

				setIsAuthenticated(true)
				setUser(JSON.parse(user))
			} catch (error) {
				console.error('Auth validation failed:', error)
			} finally {
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