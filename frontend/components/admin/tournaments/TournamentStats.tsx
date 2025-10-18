// Tournament Stats Component  
import AdminStats from "../shared/AdminStats"
import { Trophy, Calendar, Users, DollarSign } from "lucide-react"
import { AdminTournament } from "@/data/mockDataAdmin"

interface TournamentStatsProps {
    tournaments: AdminTournament[]
}

export default function TournamentStats({ tournaments }: TournamentStatsProps) {
    const totalTournaments = tournaments.length
    const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').length
    const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing').length
    const totalParticipants = tournaments.reduce((sum, t) => sum + t.participants, 0)

    const stats = [
        {
            title: "Tổng giải đấu",
            value: totalTournaments,
            icon: Trophy,
            iconColor: "text-blue-600"
        },
        {
            title: "Sắp diễn ra",
            value: upcomingTournaments,
            icon: Calendar,
            iconColor: "text-green-600"
        },
        {
            title: "Đang diễn ra",
            value: ongoingTournaments,
            icon: Calendar,
            iconColor: "text-yellow-600"
        },
        {
            title: "Tổng VĐV",
            value: totalParticipants,
            icon: Users,
            iconColor: "text-purple-600"
        }
    ]

    return <AdminStats stats={stats} />
}