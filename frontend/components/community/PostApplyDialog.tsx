import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CommunityPost } from '@/services/posts.service'

interface PostApplyDialogProps {
    post: CommunityPost | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (number: number) => Promise<void>
    isLoading?: boolean
}

export default function PostApplyDialog({
    post,
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: PostApplyDialogProps) {
    const [numberOfPlayers, setNumberOfPlayers] = useState(1)
    const [error, setError] = useState<string>('')

    const maxAvailable = post ? Math.max(0, post.requiredNumber - (post.currentNumber || 0)) : 0

    const handleSubmit = async () => {
        setError('')

        if (!numberOfPlayers || numberOfPlayers <= 0) {
            setError('Số lượng phải lớn hơn 0')
            return
        }

        if (numberOfPlayers > maxAvailable) {
            setError(`Chỉ còn ${maxAvailable} chỗ trống`)
            return
        }

        try {
            await onSubmit(numberOfPlayers)
            setNumberOfPlayers(1)
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!isLoading) {
            onOpenChange(newOpen)
            if (!newOpen) {
                setNumberOfPlayers(1)
                setError('')
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tham gia bài viết</DialogTitle>
                </DialogHeader>

                {post && (
                    <div className="space-y-2 text-sm">
                        <p className="font-semibold text-gray-900">{post.title}</p>
                        <p className="text-gray-600">
                            Chỗ trống: <span className="font-semibold">{maxAvailable}</span> / {post.requiredNumber}
                        </p>
                    </div>
                )}

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="players" className="text-right">
                            Số lượng
                        </Label>
                        <Input
                            id="players"
                            type="number"
                            min="1"
                            max={maxAvailable}
                            value={numberOfPlayers}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 0
                                setNumberOfPlayers(Math.min(val, maxAvailable))
                                setError('')
                            }}
                            disabled={isLoading}
                            className="col-span-3"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 font-medium">{error}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || numberOfPlayers <= 0}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? 'Đang gửi...' : 'Tham gia'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
