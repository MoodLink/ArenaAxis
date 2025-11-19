"use client"

import { useEffect, useState } from "react"
import { reverseGeocodeAndFindLocation } from "@/services/location-helper.service"
import { getNearbyStoresFromGeolocation } from "@/services/nearby-store.service"
import { StoreSearchItemResponse } from "@/types"

interface LocationDebugInfo {
    latitude?: number
    longitude?: number
    provinceName?: string
    wardName?: string
    address?: string
    error?: string
}

export default function DebugLocationPage() {
    const [debugInfo, setDebugInfo] = useState<LocationDebugInfo>({})
    const [stores, setStores] = useState<StoreSearchItemResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getLocation = () => {
        setLoading(true)
        setError(null)

        if (!navigator.geolocation) {
            setError("Geolocation API not available")
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    console.log(`📍 Got location: ${latitude}, ${longitude}`)

                    setDebugInfo((prev) => ({
                        ...prev,
                        latitude,
                        longitude,
                    }))

                    // Test reverse geocoding
                    const locationInfo = await reverseGeocodeAndFindLocation(latitude, longitude)
                    console.log("🗺️ Location info:", locationInfo)

                    setDebugInfo((prev) => ({
                        ...prev,
                        provinceName: locationInfo.provinceName,
                        wardName: locationInfo.wardName,
                        address: locationInfo.address,
                    }))

                    // Get nearby stores
                    const nearbyStores = await getNearbyStoresFromGeolocation(10000)
                    console.log("🏪 Nearby stores:", nearbyStores)
                    setStores(nearbyStores)

                    setLoading(false)
                } catch (err) {
                    console.error("Error:", err)
                    setError(err instanceof Error ? err.message : "Unknown error")
                    setLoading(false)
                }
            },
            (err) => {
                console.error("Geolocation error:", err)
                setError(err.message)
                setLoading(false)
            }
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🗺️ Location Debug</h1>

                <button
                    onClick={getLocation}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mb-8"
                >
                    {loading ? "Loading..." : "Get Location & Nearby Stores"}
                </button>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-800 font-semibold">❌ Error</p>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Location Info */}
                {debugInfo.latitude && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">📍 Location Info</h2>
                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold">Latitude:</span> {debugInfo.latitude}
                            </p>
                            <p>
                                <span className="font-semibold">Longitude:</span> {debugInfo.longitude}
                            </p>
                            <p>
                                <span className="font-semibold">Province:</span>{" "}
                                <span className="text-green-600 font-semibold">{debugInfo.provinceName || "NOT FOUND"}</span>
                            </p>
                            <p>
                                <span className="font-semibold">Ward:</span>{" "}
                                <span className="text-blue-600 font-semibold">{debugInfo.wardName || "NOT FOUND"}</span>
                            </p>
                            <p>
                                <span className="font-semibold">Address:</span> {debugInfo.address || "N/A"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Stores List */}
                {stores.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">🏪 Nearby Stores ({stores.length})</h2>
                        <div className="space-y-4">
                            {stores.map((store) => (
                                <div key={store.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                                    <p className="font-semibold">{store.name}</p>
                                    <p className="text-sm text-gray-600">{store.address}</p>
                                    {(store as any).distance && (
                                        <p className="text-sm text-blue-600 mt-1">
                                            Distance: {((store as any).distance / 1000).toFixed(2)} km
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {stores.length === 0 && debugInfo.latitude && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">⚠️ No stores found nearby</p>
                    </div>
                )}
            </div>
        </div>
    )
}
