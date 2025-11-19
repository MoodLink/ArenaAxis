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

interface DebugStore extends StoreSearchItemResponse {
    distance?: number
    ward?: { id: string; name: string }
    address?: string
}

export default function DebugLocationPage() {
    const [debugInfo, setDebugInfo] = useState<LocationDebugInfo>({})
    const [stores, setStores] = useState<DebugStore[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [consoleOutput, setConsoleOutput] = useState<string[]>([])

    // Hook console.log để capture logs
    useEffect(() => {
        const originalLog = console.log
        const originalError = console.error
        const originalWarn = console.warn

        const captureLog = (args: any[]) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setConsoleOutput(prev => [...prev, `[LOG] ${message}`])
            originalLog(...args)
        }

        const captureError = (args: any[]) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setConsoleOutput(prev => [...prev, `[ERROR] ${message}`])
            originalError(...args)
        }

        const captureWarn = (args: any[]) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setConsoleOutput(prev => [...prev, `[WARN] ${message}`])
            originalWarn(...args)
        }

        console.log = captureLog
        console.error = captureError
        console.warn = captureWarn

        return () => {
            console.log = originalLog
            console.error = originalError
            console.warn = originalWarn
        }
    }, [])

    const getLocation = () => {
        setLoading(true)
        setError(null)
        setConsoleOutput([])

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
                    setStores(nearbyStores as DebugStore[])

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
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🗺️ Location Debug (Advanced)</h1>

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Location Info */}
                    <div>
                        {debugInfo.latitude && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4">📍 Location Info</h2>
                                <div className="space-y-3 font-mono text-sm">
                                    <div>
                                        <span className="font-semibold">Latitude:</span>
                                        <div className="text-gray-600">{debugInfo.latitude}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Longitude:</span>
                                        <div className="text-gray-600">{debugInfo.longitude}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Province:</span>
                                        <div className="text-green-600 font-bold">{debugInfo.provinceName || "NOT FOUND"}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Ward:</span>
                                        <div className="text-blue-600 font-bold">{debugInfo.wardName || "NOT FOUND"}</div>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Address:</span>
                                        <div className="text-gray-600 break-words">{debugInfo.address || "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Console Output */}
                    <div>
                        <div className="bg-black rounded-lg shadow p-4 h-96 overflow-y-auto">
                            <h2 className="text-white text-sm font-bold mb-2">📋 Console Logs</h2>
                            <div className="space-y-1">
                                {consoleOutput.map((log, idx) => {
                                    const isError = log.startsWith('[ERROR]')
                                    const isWarn = log.startsWith('[WARN]')
                                    const color = isError ? 'text-red-400' : isWarn ? 'text-yellow-400' : 'text-green-400'
                                    return (
                                        <div key={idx} className={`text-xs font-mono ${color} break-words`}>
                                            {log}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stores List */}
                {stores.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mt-8">
                        <h2 className="text-xl font-bold mb-4">🏪 Nearby Stores ({stores.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Store Name</th>
                                        <th className="px-4 py-2 text-left">Address</th>
                                        <th className="px-4 py-2 text-left">Ward</th>
                                        <th className="px-4 py-2 text-left">Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stores.map((store, idx) => (
                                        <tr key={store.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-2 font-semibold">{store.name}</td>
                                            <td className="px-4 py-2 text-gray-600 max-w-xs truncate">{store.address}</td>
                                            <td className="px-4 py-2">
                                                {store.ward ? (
                                                    <span className={store.ward.name === debugInfo.wardName ? 'text-green-600 font-bold' : 'text-red-600'}>
                                                        {store.ward.name}
                                                    </span>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">
                                                {store.distance ? `${(store.distance / 1000).toFixed(2)} km` : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Store Analysis */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="font-bold mb-2">📊 Analysis</h3>
                            {stores.length > 0 && (
                                <div className="text-sm space-y-2">
                                    {(() => {
                                        const correctWards = stores.filter(s => s.ward?.name === debugInfo.wardName);
                                        const wrongWards = stores.filter(s => s.ward?.name !== debugInfo.wardName && s.ward?.name);
                                        return (
                                            <>
                                                <p>✅ Correct ward ({debugInfo.wardName}): <span className="font-bold text-green-600">{correctWards.length}</span></p>
                                                <p>❌ Wrong wards: <span className="font-bold text-red-600">{wrongWards.length}</span></p>
                                                {wrongWards.length > 0 && (
                                                    <p className="text-red-700">
                                                        Wrong wards: {wrongWards.map(s => s.ward?.name).join(', ')}
                                                    </p>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {stores.length === 0 && debugInfo.latitude && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
                        <p className="text-yellow-800">⚠️ No stores found nearby</p>
                    </div>
                )}
            </div>
        </div>
    )
}
