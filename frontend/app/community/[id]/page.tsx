"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  getCommunityPostById,
  getCommunityPostDetail,
  getCommunityPostComments,
  getCommunityPostParticipants,
  getRelatedCommunityPosts
} from "@/services/api"
import { CommunityPost } from "@/types"
import PostHeaderNew from "@/components/community/PostHeaderNew"
import ParticipantsList from "@/components/community/ParticipantsList"
import CommentsSection from "@/components/community/CommentsSection"
import PostSidebar from "@/components/community/PostSidebar"

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [postDetail, setPostDetail] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [participants, setParticipants] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  // Unwrap params Promise using React.use()
  const { id } = React.use(params)

  // Fetch all data on component mount
  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)

        // Fetch basic post data first
        const fetchedPost = await getCommunityPostById(id)
        if (!fetchedPost) {
          setLoading(false)
          return
        }

        setPost(fetchedPost)

        // Fetch detailed data in parallel
        const authorName = typeof fetchedPost.author === 'string'
          ? fetchedPost.author
          : fetchedPost.author?.name || "Unknown"

        const [detailData, commentsData, participantsData, relatedData] = await Promise.all([
          getCommunityPostDetail(id, authorName, fetchedPost.createdAt),
          getCommunityPostComments(id),
          getCommunityPostParticipants(id),
          getRelatedCommunityPosts(id)
        ])

        setPostDetail(detailData.postDetail)
        setComments(commentsData)
        setParticipants(participantsData)
        setRelatedPosts(relatedData)
      } catch (error) {
        console.error('Error fetching post data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [id])

  // Event handlers
  const handleLike = () => setIsLiked(!isLiked)
  const handleJoin = () => setIsJoined(!isJoined)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bài viết không tìm thấy</h1>
          <Link href="/community">
            <Button>Quay lại cộng đồng</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/community" className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold text-lg">Cộng đồng</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Post Header */}
            <PostHeaderNew
              post={post}
              postDetail={postDetail}
              isLiked={isLiked}
              isJoined={isJoined}
              commentsCount={comments?.length || 0}
              onLike={handleLike}
              onShare={handleShare}
              onJoin={handleJoin}
            />

            {/* Participants List */}
            {/* {participants && postDetail && (
              <ParticipantsList
                participants={participants.participants}
                joinedUsers={participants.joinedUsers}
                hostInfo={postDetail.hostInfo}
              />
            )} */}

            {/* Comments Section */}
            {comments && (
              <CommentsSection
                comments={comments}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            {postDetail && relatedPosts && (
              <PostSidebar
                postDetail={postDetail}
                relatedPosts={relatedPosts}
                similarActivities={postDetail.similarActivities || []}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}