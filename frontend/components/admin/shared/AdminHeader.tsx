// Shared Admin Header Component
// Tái sử dụng cho tất cả các trang admin

interface AdminHeaderProps {
    title: string
    description: string
    actionButton?: React.ReactNode
}

export default function AdminHeader({ title, description, actionButton }: AdminHeaderProps) {
    return (
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>
            {actionButton && actionButton}
        </div>
    )
}