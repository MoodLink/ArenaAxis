// Custom hook để quản lý search và filtering cho Community posts
// Giúp tái sử dụng logic này ở nhiều trang khác nhau

import { useState, useEffect, useMemo } from "react"
import { CommunityPost } from "@/types"

export interface CommunityFilterState {
    sport: string
    distance: string
    sortBy: "newest" | "popular" | "trending"
}

export function useCommunitySearchAndFilter(
    posts: CommunityPost[],
    itemsPerPage: number = 8
) {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedFilters, setSelectedFilters] = useState<CommunityFilterState>({
        sport: "Tất cả",
        distance: "Tất cả",
        sortBy: "newest"
    })

    // Filter and search logic
    const filteredPosts = useMemo(() => {
        let filtered = posts

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery.trim()) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.sport.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Lọc theo môn thể thao
        if (selectedFilters.sport !== "Tất cả") {
            filtered = filtered.filter(post => post.sport === selectedFilters.sport)
        }

        // Sắp xếp theo sortBy
        filtered.sort((a, b) => {
            switch (selectedFilters.sortBy) {
                case "popular":
                    return (b.likes + b.comments) - (a.likes + a.comments)
                case "trending":
                    // Mock trending logic - could be based on engagement rate
                    return Math.random() - 0.5
                default: // newest
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        return filtered
    }, [posts, searchQuery, selectedFilters])

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedFilters])

    // Handler functions
    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
    }

    const handleFiltersChange = (filters: Partial<CommunityFilterState>) => {
        setSelectedFilters(prev => ({ ...prev, ...filters }))
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            // Scroll to top when changing page
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const clearFilters = () => {
        setSelectedFilters({
            sport: "Tất cả",
            distance: "Tất cả",
            sortBy: "newest"
        })
        setSearchQuery("")
    }

    return {
        // State
        searchQuery,
        selectedFilters,
        currentPage,

        // Derived state
        filteredPosts,
        paginatedPosts,
        totalPages,
        totalFilteredItems: filteredPosts.length,
        startIndex,
        endIndex,

        // Handlers
        handleSearchChange,
        handleFiltersChange,
        handlePageChange,
        nextPage,
        prevPage,
        clearFilters,

        // Config
        itemsPerPage
    }
}