// Tournament Table Component
import AdminTable, { TableColumn, TableAction, renderBadge, renderCurrency } from "../shared/AdminTable"
import { Eye, Edit, CheckCircle, X, Trash2 } from "lucide-react"
import { AdminTournament } from "@/data/mockDataAdmin"

interface TournamentTableProps {
    tournaments: AdminTournament[]
    onTournamentAction: (tournamentId: string, action: 'approve' | 'reject' | 'cancel' | 'view' | 'edit' | 'delete') => void
}

export default function TournamentTable({ tournaments, onTournamentAction }: TournamentTableProps) {
    const statusColorMap = {
        'upcoming': 'bg-blue-100 text-blue-800',
        'ongoing': 'bg-green-100 text-green-800',
        'completed': 'bg-gray-100 text-gray-800',
        'cancelled': 'bg-red-100 text-red-800'
    }

    const statusLabelMap = {
        'upcoming': 'Sắp diễn ra',
        'ongoing': 'Đang diễn ra',
        'completed': 'Đã kết thúc',
        'cancelled': 'Đã hủy'
    }

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Tên giải đấu',
            render: (name, tournament) => (
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{tournament.sport}</div>
                </div>
            )
        },
        {
            key: 'organizerName',
            label: 'Ban tổ chức',
            render: (organizerName, tournament) => (
                <div>
                    <div className="font-medium">{organizerName}</div>
                    <div className="text-sm text-gray-500">{tournament.organizerPhone}</div>
                </div>
            )
        },
        {
            key: 'location',
            label: 'Địa điểm',
            render: (location) => <span className="text-sm text-gray-600">{location}</span>
        },
        {
            key: 'startDate',
            label: 'Thời gian',
            render: (startDate, tournament) => (
                <div>
                    <div className="font-medium">{new Date(startDate).toLocaleDateString('vi-VN')}</div>
                    <div className="text-sm text-gray-500">đến {new Date(tournament.endDate).toLocaleDateString('vi-VN')}</div>
                </div>
            )
        },
        {
            key: 'participants',
            label: 'Thí sinh',
            render: (participants, tournament) => (
                <div className="text-center">
                    <div className="font-medium">{participants}</div>
                    <div className="text-sm text-gray-500">/ {tournament.maxTeams * 4} người</div>
                </div>
            )
        },
        {
            key: 'prizePool',
            label: 'Giải thưởng',
            render: (prizePool) => renderCurrency(prizePool)
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => renderBadge(statusLabelMap[status as keyof typeof statusLabelMap], statusColorMap)
        }
    ]

    const actions: TableAction[] = [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (tournament) => onTournamentAction(tournament.id, 'view')
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <Edit className="mr-2 h-4 w-4" />,
            onClick: (tournament) => onTournamentAction(tournament.id, 'edit')
        },
        {
            key: 'approve',
            label: 'Phê duyệt',
            icon: <CheckCircle className="mr-2 h-4 w-4" />,
            onClick: (tournament) => onTournamentAction(tournament.id, 'approve'),
            show: (tournament) => tournament.status === 'completed'
        },
        {
            key: 'cancel',
            label: 'Hủy giải',
            icon: <X className="mr-2 h-4 w-4" />,
            onClick: (tournament) => onTournamentAction(tournament.id, 'cancel'),
            show: (tournament) => tournament.status !== 'cancelled' && tournament.status !== 'completed',
            variant: 'destructive'
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            onClick: (tournament) => onTournamentAction(tournament.id, 'delete'),
            variant: 'destructive'
        }
    ]

    return (
        <AdminTable
            columns={columns}
            data={tournaments}
            actions={actions}
            emptyMessage="Không tìm thấy giải đấu nào"
        />
    )
}