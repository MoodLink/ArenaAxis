"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { FieldService } from "@/services/field.service"
import { getStoreById, getSportById } from "@/services/api-new"
import type { Field as FieldServiceType } from "@/services/field.service"
import type { Field as FieldType } from "@/types"
import FieldsLoadingState from "@/components/fields/FieldsLoadingState"
import FieldsHeader from "@/components/fields/FieldsHeader"
import FieldsBreadcrumb from "@/components/fields/FieldsBreadcrumb"
import FieldsStats from "@/components/fields/FieldsStats"
import FieldsSearchSection from "@/components/fields/FieldsSearchSection"
import FieldsContent from "@/components/fields/FieldsContent"
import Pagination from "@/components/fields/Pagination"

export default function FieldsPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get('store_id')
  const sportId = searchParams.get('sport_id')

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchValue, setSearchValue] = useState("")
  const [fields, setFields] = useState<FieldType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12) // 12 items per page
  const [storeName, setStoreName] = useState<string>("")
  const [sportName, setSportName] = useState<string>("")
  const [selectedFilters, setSelectedFilters] = useState<{
    sports: string[]
    priceRange: string
    location: string
    amenities: string[]
  }>({
    sports: [],
    priceRange: "all",
    location: "all",
    amenities: []
  })

  // Helper function to convert FieldServiceType to FieldType
  const convertField = (field: FieldServiceType): FieldType => {
    return {
      _id: field._id,
      id: field._id,
      name: field.name || 'Sân thể thao',
      sportId: field.sportId,
      sport_name: field.sport_name,
      storeId: field.storeId,
      address: field.address || '',
      avatar: field.avatar,
      cover_image: field.cover_image,
      defaultPrice: field.defaultPrice,
      price: parseFloat(field.defaultPrice) || 0,
      rating: field.rating,
      activeStatus: field.activeStatus,
      active: field.activeStatus,
      status: field.activeStatus ? 'available' : 'unavailable',
      image: field.avatar,
      location: field.address,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt
    }
  }

  useEffect(() => {
    async function fetchFields() {
      setLoading(true)
      try {
        // Fetch store and sport info in parallel
        const promises = []

        if (storeId) {
          promises.push(
            getStoreById(storeId)
              .then(store => store ? setStoreName(store.name) : null)
              .catch(err => console.error('Error fetching store:', err))
          )
        }

        if (sportId) {
          promises.push(
            getSportById(sportId)
              .then(sport => sport ? setSportName(sport.name) : null)
              .catch(err => console.error('Error fetching sport:', err))
          )
        }

        // Fetch fields
        console.log('🔍 Fetching fields with filters:', {
          store_id: storeId,
          sport_id: sportId,
          active_status: true
        })

        const response = await FieldService.getFields({
          store_id: storeId || undefined,
          sport_id: sportId || selectedFilters.sports.length > 0 ? selectedFilters.sports[0] : undefined,
          active_status: true // Only show active fields
        })

        console.log('📦 API Response:', response)
        console.log('📊 Total fields from API:', response.data?.length)

        // Convert FieldServiceType[] to FieldType[]
        const convertedFields = (response.data || []).map(convertField)

        // If sportId is provided but backend doesn't filter, filter client-side
        let finalFields = convertedFields
        if (sportId && convertedFields.length > 0) {
          finalFields = convertedFields.filter(field => {
            const matches = field.sportId === sportId
            if (!matches) {
              console.log(`❌ Filtering out field "${field.name}" - sportId: ${field.sportId} (expected: ${sportId})`)
            }
            return matches
          })
          console.log(`✅ Filtered to ${finalFields.length} fields matching sport_id: ${sportId}`)
        }

        setFields(finalFields)

        // Wait for store and sport info
        await Promise.all(promises)
      } catch (error) {
        console.error("Error fetching fields:", error)
        setFields([])
      } finally {
        setLoading(false)
      }
    }

    fetchFields()
  }, [storeId, sportId, selectedFilters]) // Re-fetch when filters change

  const filteredFields = useMemo(() => {
    return fields.filter(field => {
      // Client-side search filtering (for search input)
      const matchesSearch =
        (field.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (field.address || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (field.sport_name || '').toLowerCase().includes(searchValue.toLowerCase())

      return matchesSearch
    })
  }, [fields, searchValue]) // Remove selectedFilters from deps since it's handled by API now

  // Pagination logic
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFields = filteredFields.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue, selectedFilters])

  const handleFilterClick = () => {
    console.log("Open filter modal")
  }

  const handleFavoriteClick = (fieldId: string) => {
    console.log("Toggle favorite for field:", fieldId)
  }

  const handleMenuClick = (fieldId: string) => {
    console.log("Open menu for field:", fieldId)
  }

  const handleFiltersChange = (filters: {
    sports: string[]
    priceRange: string
    location: string
    amenities: string[]
  }) => {
    setSelectedFilters(filters)
  }

  if (loading) {
    return <FieldsLoadingState />
  }

  // Build dynamic page title
  const pageTitle = storeId && storeName
    ? `Sân ${sportName ? sportName + ' - ' : ''}${storeName}`
    : 'Sân thể thao'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Show filter info banner if coming from store */}
      {(storeId || sportId) && (
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  🏪 {storeName || 'Đang tải...'}
                  {sportName && <span className="ml-2">⚽ {sportName}</span>}
                </span>
              </div>
              <a
                href="/fields"
                className="text-sm hover:underline flex items-center gap-1"
              >
                ← Xem tất cả sân
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-8">
        <div className="mb-6">
          <FieldsBreadcrumb current={pageTitle} />
        </div>

      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="mb-6">
          <FieldsHeader totalFields={filteredFields.length} />
        </div>
        {/* Stats Overview */}
        <FieldsStats fields={fields} />

        {/* Search and Filter Section */}
        <FieldsSearchSection
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedFilters={selectedFilters}
          onFiltersChange={handleFiltersChange}
          onFilterClick={handleFilterClick}
          filteredCount={filteredFields.length}
        />

        {/* Content Display */}
        <FieldsContent
          fields={paginatedFields}
          viewMode={viewMode}
          onFavoriteClick={handleFavoriteClick}
          onMenuClick={handleMenuClick}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredFields.length}
          />
        )}
      </div>
    </div>
  )
}
