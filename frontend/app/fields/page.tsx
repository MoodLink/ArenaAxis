"use client"

import { useState, useEffect, useMemo } from "react"
import { getFields } from "@/services/api"
import { Field } from "@/types"
import FieldsLoadingState from "@/components/fields/FieldsLoadingState"
import FieldsHeader from "@/components/fields/FieldsHeader"
import FieldsBreadcrumb from "@/components/fields/FieldsBreadcrumb"
import FieldsStats from "@/components/fields/FieldsStats"
import FieldsSearchSection from "@/components/fields/FieldsSearchSection"
import FieldsContent from "@/components/fields/FieldsContent"
import Pagination from "@/components/fields/Pagination"

export default function FieldsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchValue, setSearchValue] = useState("")
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8) // 12 items per page
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

  useEffect(() => {
    async function fetchFields() {
      try {
        // Pass filters to API service for server-side filtering
        const apiFields = await getFields({
          sport: selectedFilters.sports.length > 0 ? selectedFilters.sports[0] : undefined,
          location: selectedFilters.location !== "all" ? selectedFilters.location : undefined,
          priceRange: selectedFilters.priceRange !== "all" ? selectedFilters.priceRange : undefined,
          amenities: selectedFilters.amenities.length > 0 ? selectedFilters.amenities : undefined
        })
        setFields(apiFields)
      } catch (error) {
        console.error("Error fetching fields:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFields()
  }, [selectedFilters]) // Re-fetch when filters change

  const filteredFields = useMemo(() => {
    return fields.filter(field => {
      // Client-side search filtering (for search input)
      const matchesSearch = field.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        field.location.toLowerCase().includes(searchValue.toLowerCase()) ||
        field.sport.toLowerCase().includes(searchValue.toLowerCase()) ||
        field.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        field.amenities.some(amenity =>
          amenity.toLowerCase().includes(searchValue.toLowerCase())
        )

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="container mx-auto px-4 pt-8">
        <div className="mb-6">
          <FieldsBreadcrumb current="Sân thể thao" />
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
