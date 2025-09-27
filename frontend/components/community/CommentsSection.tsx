// Component hiển thị phần bình luận và tương tác
// Bao gồm danh sách bình luận, replies và form thêm bình luận mới

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    ThumbsUp,
    Reply,
    MoreHorizontal,
    Send
} from "lucide-react"
import { Comment, CommentReply } from "@/data/mockData"

interface CommentsSectionProps {
    comments: Comment[]
}

export default function CommentsSection({ comments }: CommentsSectionProps) {
    const [newComment, setNewComment] = useState("")
    const [replyTo, setReplyTo] = useState<number | null>(null)

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            // Logic xử lý thêm bình luận mới
            console.log("New comment:", newComment)
            setNewComment("")
            setReplyTo(null)
        }
    }

    const renderComment = (comment: Comment | CommentReply, isReply = false) => (
        <div key={comment.id} className={`${isReply ? "ml-12 mt-4" : "mb-6"}`}>
            <Card className="border-l-4 border-l-green-400 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 ring-2 ring-gray-100">
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold">
                                    {comment.author.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h6 className="font-bold text-gray-900">{comment.author.name}</h6>
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                        ✓ Member
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span>{comment.timeAgo}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                {comment.likes}
                            </Button>
                            {!isReply && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                                >
                                    <Reply className="w-4 h-4 mr-2" />
                                    Trả lời
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-sm">
                                        U
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        placeholder="Viết phản hồi..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="flex-1"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                                    />
                                    <Button size="sm" onClick={handleSubmitComment}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Render replies */}
            {'replies' in comment && comment.replies && comment.replies.map((reply: CommentReply) => renderComment(reply, true))}
        </div>
    )

    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-8">
                <h4 className="font-bold text-2xl mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    Bình luận ({comments.length})
                </h4>

                {/* Add new comment form */}
                <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-dashed border-green-200">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <Avatar className="w-12 h-12 ring-2 ring-green-200">
                                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold">
                                    U
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                                <Input
                                    placeholder="Chia sẻ ý kiến của bạn về hoạt động này..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="bg-white border-green-200 focus:border-green-400"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmitComment}
                                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Gửi bình luận
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments list */}
                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment) => renderComment(comment))
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Chưa có bình luận nào</p>
                            <p className="text-gray-400 text-sm">Hãy là người đầu tiên chia sẻ ý kiến!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}