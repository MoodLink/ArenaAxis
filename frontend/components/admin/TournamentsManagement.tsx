"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Import components đã tách
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import TournamentStats from "./tournaments/TournamentStats"
import TournamentTable from "./tournaments/TournamentTable"
import TournamentForm from "./tournaments/TournamentForm"
import TournamentDetail from "./tournaments/TournamentDetail"

// Import mock data
import { mockTournaments, AdminTournament } from "@/data/mockDataAdmin"

export default function TournamentsManagement() {
    const [tournaments, setTournaments] = useState<AdminTournament[]>(mockTournaments)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sportFilter, setSportFilter] = useState<string>('all')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedTournament, setSelectedTournament] = useState<AdminTournament | null>(null)

    // Filter tournaments
    const filteredTournaments = tournaments.filter(tournament => {
        const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.location.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter
        const matchesSport = sportFilter === 'all' || tournament.sport === sportFilter

        return matchesSearch && matchesStatus && matchesSport
    })

    const handleTournamentAction = (tournamentId: string, action: 'approve' | 'reject' | 'cancel' | 'view' | 'edit' | 'delete') => {
        const tournament = tournaments.find(t => t.id === tournamentId)

        switch (action) {
            case 'view':
                if (tournament) {
                    setSelectedTournament(tournament)
                    setIsViewDialogOpen(true)
                }
                break
            case 'edit':
                if (tournament) {
                    setSelectedTournament(tournament)
                    setIsEditDialogOpen(true)
                }
                break
            case 'approve':
                setTournaments(tournaments.map(t =>
                    t.id === tournamentId ? { ...t, status: 'upcoming' as const } : t
                ))
                break
            case 'cancel':
                setTournaments(tournaments.map(t =>
                    t.id === tournamentId ? { ...t, status: 'cancelled' as const } : t
                ))
                break
            case 'delete':
                setTournaments(tournaments.filter(t => t.id !== tournamentId))
                break
            default:
                console.log(`${action} tournament ${tournamentId}`)
        }
    }

    const handleCreateTournament = (formData: any) => {
        const newTournament: AdminTournament = {
            id: (Math.max(...tournaments.map(t => parseInt(t.id))) + 1).toString(),
            name: formData.name,
            sport: formData.sport,
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            prizePool: formData.prizePool,
            maxTeams: formData.maxTeams,
            currentTeams: 0,
            image: "/placeholder.svg",
            description: formData.description,
            organizerName: formData.organizerName,
            organizerEmail: formData.organizerEmail,
            organizerPhone: formData.organizerPhone,
            registrationFee: formData.registrationFee,
            status: formData.status,
            registrationDeadline: formData.registrationDeadline,
            createdAt: new Date().toISOString().split('T')[0],
            participants: 0
        }
        setTournaments([...tournaments, newTournament])
        setIsCreateDialogOpen(false)
    }

    const handleUpdateTournament = (formData: any) => {
        if (!selectedTournament) return

        setTournaments(tournaments.map(t => t.id === selectedTournament.id ? {
            ...t,
            name: formData.name,
            sport: formData.sport,
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            prizePool: formData.prizePool,
            maxTeams: formData.maxTeams,
            registrationFee: formData.registrationFee,
            description: formData.description,
            organizerName: formData.organizerName,
            organizerEmail: formData.organizerEmail,
            organizerPhone: formData.organizerPhone,
            registrationDeadline: formData.registrationDeadline,
            status: formData.status
        } : t))
        setIsEditDialogOpen(false)
        setSelectedTournament(null)
    }

    // Filter options
    const filterOptions = [
        {
            key: 'status',
            placeholder: 'Trạng thái',
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: [
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'upcoming', label: 'Sắp diễn ra' },
                { value: 'ongoing', label: 'Đang diễn ra' },
                { value: 'completed', label: 'Đã kết thúc' },
                { value: 'cancelled', label: 'Đã hủy' }
            ]
        },
        {
            key: 'sport',
            placeholder: 'Môn thể thao',
            value: sportFilter,
            onValueChange: setSportFilter,
            options: [
                { value: 'all', label: 'Tất cả môn thể thao' },
                { value: 'Bóng đá', label: 'Bóng đá' },
                { value: 'Tennis', label: 'Tennis' },
                { value: 'Cầu lông', label: 'Cầu lông' },
                { value: 'Bóng rổ', label: 'Bóng rổ' }
            ]
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminHeader
                title="Quản lý giải đấu"
                description="Quản lý và theo dõi các giải đấu thể thao"
                actionButton={
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tạo giải đấu mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tạo giải đấu mới</DialogTitle>
                                <DialogDescription>
                                    Thêm giải đấu thể thao mới vào hệ thống
                                </DialogDescription>
                            </DialogHeader>
                            <TournamentForm
                                onSubmit={handleCreateTournament}
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                }
            />

            {/* Stats Cards */}
            <TournamentStats tournaments={tournaments} />

            {/* Filters and Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách giải đấu</CardTitle>
                    <CardDescription>
                        Quản lý {filteredTournaments.length} giải đấu trong hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminFilters
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={filterOptions}
                    />

                    <TournamentTable
                        tournaments={filteredTournaments}
                        onTournamentAction={handleTournamentAction}
                    />

                    {filteredTournaments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Không tìm thấy giải đấu nào phù hợp
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Tournament Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa giải đấu</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin giải đấu
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTournament && (
                        <TournamentForm
                            initialData={{
                                name: selectedTournament.name,
                                sport: selectedTournament.sport,
                                startDate: selectedTournament.startDate,
                                endDate: selectedTournament.endDate,
                                location: selectedTournament.location,
                                prizePool: selectedTournament.prizePool,
                                maxTeams: selectedTournament.maxTeams,
                                registrationFee: selectedTournament.registrationFee,
                                description: selectedTournament.description,
                                organizerName: selectedTournament.organizerName,
                                organizerEmail: selectedTournament.organizerEmail,
                                organizerPhone: selectedTournament.organizerPhone,
                                registrationDeadline: selectedTournament.registrationDeadline,
                                status: selectedTournament.status
                            }}
                            onSubmit={handleUpdateTournament}
                            onCancel={() => {
                                setIsEditDialogOpen(false)
                                setSelectedTournament(null)
                            }}
                            isEdit={true}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* View Tournament Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết giải đấu</DialogTitle>
                        <DialogDescription>
                            Xem thông tin chi tiết giải đấu
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTournament && <TournamentDetail tournament={selectedTournament} />}
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}