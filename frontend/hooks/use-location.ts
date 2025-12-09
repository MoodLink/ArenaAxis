import { useState, useEffect } from 'react'
import { fetchGeoLocation, reversePosition } from '@/services/location.service'

export interface Location {
	latitude?: number
	longitude?: number
	city?: string
	region?: string
	country?: string
	ip?: string
}

export const useLocation = () => {
	const [location, setLocation] = useState<Location | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const getIPBasedLocation = async () => {
		try {
			const data = await fetchGeoLocation()
			setLocation({
				city: data.city,
				region: data.region,
				country: data.country,
				ip: data.ip
			})
		} catch (err) {
			console.error('Error fetching IP-based location:', err)
			setError('Failed to get location from IP')
		} finally {
			setLoading(false)
		}
	}

	const handleLocation = (data: any) => {

	}

	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const data = reversePosition(position.coords.latitude, position.coords.longitude)
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					})
					setLoading(false)
				},
				(err) => {
					console.log('Geolocation permission denied, falling back to IP')
					getIPBasedLocation()
				}
			)
		} else {
			getIPBasedLocation()
		}
	}, [])

	return { location, loading, error }
}