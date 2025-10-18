"use client"

// Import các components đã tách riêng cho trang tournaments
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import TournamentsHeader from "@/components/tournaments/TournamentsHeader"
import TournamentsFilters from "@/components/tournaments/TournamentsFilters"
import TournamentCard from "@/components/tournaments/TournamentCard"
import { getTournaments } from "@/services/api"
import { Tournament } from "@/types"

// Interface cho filters
interface TournamentFilters {
  search: string
  sport: string
  status: string
  prizeRange: string
}

export default function TournamentsPage() {
  const router = useRouter()

  // State quản lý filters
  const [filters, setFilters] = useState<TournamentFilters>({
    search: "",
    sport: "all",
    status: "all",
    prizeRange: "all"
  })

  // State quản lý dữ liệu từ API
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  // Lấy dữ liệu từ API
  useEffect(() => {
    async function fetchTournaments() {
      try {
        const apiTournaments = await getTournaments()
        setTournaments(apiTournaments)
      } catch (error) {
        console.error("Error fetching tournaments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  // Filter tournaments dựa trên filters
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(tournament => {
      // Filter theo search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          tournament.name.toLowerCase().includes(searchLower) ||
          tournament.location.toLowerCase().includes(searchLower) ||
          tournament.description?.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filter theo sport
      if (filters.sport !== "all" && tournament.sport !== filters.sport) {
        return false
      }

      // Filter theo status - derive from current date and tournament dates
      if (filters.status !== "all") {
        const currentDate = new Date()
        const startDate = new Date(tournament.startDate)
        const endDate = new Date(tournament.endDate)

        let tournamentStatus = "Open Registration" // Default
        if (currentDate > endDate) {
          tournamentStatus = "Completed"
        } else if (currentDate >= startDate && currentDate <= endDate) {
          tournamentStatus = "Ongoing"
        } else if (tournament.currentTeams >= tournament.maxTeams) {
          tournamentStatus = "Registration Closed"
        }

        const statusMap = {
          "open": "Open Registration",
          "closed": "Registration Closed",
          "ongoing": "Ongoing",
          "completed": "Completed"
        }
        if (tournamentStatus !== statusMap[filters.status as keyof typeof statusMap]) {
          return false
        }
      }

      // Filter theo prize range
      if (filters.prizeRange !== "all") {
        const prizeAmount = tournament.prizePool
        switch (filters.prizeRange) {
          case "under-20m":
            if (prizeAmount >= 20000000) return false
            break
          case "20m-50m":
            if (prizeAmount < 20000000 || prizeAmount > 50000000) return false
            break
          case "50m-100m":
            if (prizeAmount < 50000000 || prizeAmount > 100000000) return false
            break
          case "over-100m":
            if (prizeAmount <= 100000000) return false
            break
        }
      }

      return true
    })
  }, [tournaments, filters])

  // Tính toán stats
  const stats = useMemo(() => {
    const total = tournaments.length
    const currentDate = new Date()

    const ongoing = tournaments.filter(t => {
      const startDate = new Date(t.startDate)
      const endDate = new Date(t.endDate)
      return currentDate >= startDate && currentDate <= endDate
    }).length

    const upcoming = tournaments.filter(t => {
      const startDate = new Date(t.startDate)
      return currentDate < startDate && t.currentTeams < t.maxTeams
    }).length

    return { total, ongoing, upcoming }
  }, [tournaments])

  // Xử lý đăng ký giải đấu
  const handleRegisterTournament = (tournamentId: string) => {
    // Điều hướng đến trang đăng ký giải đấu
    router.push(`/tournaments/register/${tournamentId}`)
  }

  // Xử lý xem chi tiết giải đấu
  const handleViewTournamentDetails = (tournamentId: string) => {
    // Điều hướng đến trang chi tiết giải đấu (có thể tạo sau)
    router.push(`/tournaments/${tournamentId}`)
  }

  // Xử lý xóa filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      sport: "all",
      status: "all",
      prizeRange: "all"
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header với stats */}
        <TournamentsHeader
          totalTournaments={stats.total}
          ongoingTournaments={stats.ongoing}
          upcomingTournaments={stats.upcoming}
        />

        {/* Filters */}
        <TournamentsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Kết quả tìm kiếm */}
        {filters.search && (
          <div className="mb-6 text-gray-600">
            Tìm thấy {filteredTournaments.length} giải đấu cho "{filters.search}"
          </div>
        )}

        {/* Grid tournaments */}
        {filteredTournaments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onRegisterClick={handleRegisterTournament}
                onViewDetails={handleViewTournamentDetails}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy giải đấu nào
            </h3>
            <p className="text-gray-500 mb-4">
              Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
            </p>
            <button
              onClick={handleClearFilters}
              className="text-green-600 hover:text-green-700 underline"
            >
              Xóa bộ lọc và xem tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
