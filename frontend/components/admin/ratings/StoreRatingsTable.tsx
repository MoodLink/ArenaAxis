import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Star, Eye, ShoppingCart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StoreRating } from "@/hooks/use-admin-stores-ratings"

interface StoreRatingsTableProps {
    stores: StoreRating[]
    onViewRatings: (store: StoreRating) => void
}

export default function StoreRatingsTable({ stores, onViewRatings }: StoreRatingsTableProps) {
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.round(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
        )
    }

    const getApprovalBadge = (approved: boolean, approvable: boolean) => {
        if (approved) {
            return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>
        }
        if (approvable) {
            return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
        }
        return <Badge className="bg-gray-100 text-gray-800">Từ chối</Badge>
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cửa hàng</TableHead>
                        <TableHead>Địa chỉ</TableHead>
                        <TableHead className="text-center">Đánh giá trung bình</TableHead>
                        <TableHead className="text-center">Số lượng đánh giá</TableHead>
                        <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stores.map((store) => (
                        <TableRow key={store.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewRatings(store)}>
                            <TableCell>
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={store.avatarUrl} alt={store.name} />
                                        <AvatarFallback>{store.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{store.name}</p>

                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-gray-600 max-w-xs truncate">{store.address}</p>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                    {renderStars(store.averageRating)}
                                    <span className="text-sm font-semibold">{store.averageRating.toFixed(1)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-center">
                                    <Badge variant="outline" className="bg-blue-50">
                                        {store.ratingCount}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation()
                                                onViewRatings(store)
                                            }}>
                                                <Star className="h-4 w-4 mr-2" />
                                                Xem chi tiết đánh giá
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem cửa hàng
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
