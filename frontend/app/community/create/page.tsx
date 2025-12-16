"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Upload,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Star,
  ImagePlus,
  X,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Trophy,
  Home,
  Radio
} from "lucide-react"
import Link from "next/link"
import { getSports } from "@/services/api"
import { getMyProfile } from "@/services/get-my-profile"
import { getMatchesByOrderId, formatMatchTime, formatMatchDate, formatPrice, getMatchDuration } from "@/services/matches.service"
import { createPost, validatePostData } from "@/services/posts.service"
import { Sport } from "@/types"

interface Match {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  field: { id: string; name: string | null };
  sport: { id: string; name: string; nameEn: string };
  price: number;
}

export default function CreatePostPage() {
  const router = useRouter()

  // State for page flow
  const [pageStep, setPageStep] = useState<'select-order' | 'select-matches' | 'create-post'>('select-order')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredNumber: 10,
    currentNumber: 1,
  })

  // State for data fetching
  const [userId, setUserId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Fetch user info on mount
  useEffect(() => {
    try {
      const userInfo = getMyProfile()
      if (userInfo?.id) {
        setUserId(userInfo.id)
        setUserProfile(userInfo)
        setLoading(false)
      } else {
        // User not logged in
        console.warn('No user profile found')
        setError('Bạn cần đăng nhập để tạo bài viết')
        setLoading(false)
        // Don't redirect immediately, let user see the error message
        // router.push('/login')
      }
    } catch (err) {
      console.error('Error getting user profile:', err)
      setLoading(false)
    }
  }, [router])

  // Fetch user orders when userId is available
  useEffect(() => {
    if (!userId) {
      console.log('Waiting for userId...')
      return
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken')
        if (!token) {
          console.error('No token found')
          setError('Không tìm thấy token xác thực')
          setOrders([])
          return
        }

        console.log('Fetching orders for userId:', userId)

        // Fetch user's orders
        const response = await fetch(`/api/orders/user?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        console.log('Orders response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('Orders fetched:', data)
          const ordersList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
          setOrders(ordersList)
          console.log('Orders set:', ordersList.length, 'orders')
        } else {
          const errorText = await response.text()
          console.error('Failed to fetch orders:', response.status, errorText)
          setOrders([])
          setError(`Không thể tải đơn đặt sân (${response.status})`)
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setOrders([])
        setError(`Lỗi khi tải đơn đặt sân: ${err}`)
      }
    }

    fetchOrders()
  }, [userId])

  // Handle order selection to fetch matches
  const handleSelectOrder = async (orderId: string) => {
    setSelectedOrder(orderId)
    setSelectedMatches([])
    setLoadingMatches(true)
    setError(null)

    try {
      // Log the selected order details
      const selectedOrderData = orders.find(o => o._id === orderId)
      console.log('Selected order:', selectedOrderData)
      console.log('Order details:', selectedOrderData?.orderDetails)
      console.log('Order details - detailed:', JSON.stringify(selectedOrderData?.orderDetails, null, 2))

      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      console.log(`\n🔴 [CLIENT] Fetching matches for orderId: ${orderId}`)

      const response = await fetch(`/api/matches/order/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      console.log(`🟠 [CLIENT] Response status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log('🟡 [CLIENT] Data received:', data)
        const matchesArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
        console.log(`🟢 [CLIENT] Extracted matches: ${matchesArray.length} items\n`)

        setMatches(matchesArray)
        setPageStep('select-matches')
      } else {
        const errorData = await response.text()
        setError('Không thể lấy danh sách trận đấu. Vui lòng thử lại.')
        console.error('Failed to fetch matches:', response.status, errorData)
      }
    } catch (err) {
      setError('Lỗi khi lấy danh sách trận đấu')
      console.error('Error fetching matches:', err)
    } finally {
      setLoadingMatches(false)
    }
  }

  // Handle match selection
  const toggleMatchSelection = (matchId: string) => {
    setSelectedMatches(prev =>
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    )
  }

  // Handle form input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear form errors when user starts typing
    setFormErrors([])
  }

  // Handle post creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setError('Bạn cần đăng nhập để tạo bài viết')
      return
    }

    // Validate form data
    const postData = {
      matchIds: selectedMatches,
      title: formData.title,
      description: formData.description,
      requiredNumber: formData.requiredNumber,
      currentNumber: formData.currentNumber,
      userId: userId,
    }

    console.log('📝 Post data being sent:', postData)

    const validation = validatePostData(postData)
    if (!validation.isValid) {
      setFormErrors(validation.errors)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      console.log('🚀 Sending POST request to create post...')
      const result = await createPost(postData)
      console.log('✅ Post created successfully:', result)
      console.log('📌 Post ID:', result?.id)
      alert('Tạo bài viết thành công!')
      router.push('/community')
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi tạo bài viết'
      setError(errorMessage)
      console.error('Error creating post:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Render step 1: Select order
  const renderSelectOrder = () => {
    const unpaidOrders = orders.filter(order => {
      // Filter for orders that are paid but game date hasn't occurred yet
      const orderDate = order.orderDetails?.[0]?.startTime
      if (!orderDate) return false
      return new Date(orderDate) > new Date()
    })

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn đơn đặt sân</h2>
          <p className="text-gray-600">Chọn một đơn đặt sân để tuyển người chơi thay thế</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {unpaidOrders.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn đặt sân phù hợp</h3>
            <p className="text-gray-600 mb-6">Bạn cần có đơn đặt sân đã thanh toán nhưng ngày chơi chưa đến để tuyển người.</p>
            <Link href="/booking-history">
              <Button className="bg-green-600 hover:bg-green-700">
                Xem lịch sử đặt sân
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {unpaidOrders.map((order) => {
              const firstDetail = order.orderDetails?.[0]
              const orderDate = new Date(firstDetail?.startTime)
              const orderTime = new Date(firstDetail?.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

              return (
                <button
                  key={order._id}
                  onClick={() => handleSelectOrder(order._id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{firstDetail?.fieldId || 'Sân thể thao'}</h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {orderDate.toLocaleDateString('vi-VN')} - {orderTime}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Mã đơn: {order._id?.slice(0, 8)}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{order.statusPayment}</Badge>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Render step 2: Select matches from order
  const renderSelectMatches = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn trận đấu</h2>
          <p className="text-gray-600">Chọn một hoặc nhiều trận đấu để tuyển người chơi</p>
        </div>

        {loadingMatches ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có trận đấu nào</h3>
            <p className="text-gray-600">Đơn đặt sân này không có trận đấu phù hợp để tuyển người.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {matches.map((match) => (
                <label
                  key={match.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMatches.includes(match.id)}
                    onChange={() => toggleMatchSelection(match.id)}
                    className="w-5 h-5 text-green-600 rounded mt-1 cursor-pointer"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{match.sport?.name}</h3>
                      <span className="text-lg font-bold text-green-600">{formatPrice(match.price)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatMatchDate(match.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatMatchTime(match.startTime, match.endTime)} ({getMatchDuration(match.startTime, match.endTime)} phút)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Sân {match.field?.id}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setPageStep('select-order')}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <Button
                onClick={() => setPageStep('create-post')}
                disabled={selectedMatches.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Tiếp theo
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }

  // Render step 3: Create post
  const renderCreatePost = () => {
    const selectedMatchList = matches.filter(m => selectedMatches.includes(m.id))
    const totalPrice = selectedMatchList.reduce((sum, m) => sum + m.price, 0)
    const pricePerPerson = formData.requiredNumber > 0 ? Math.round(totalPrice / formData.requiredNumber) : 0
    const playersNeeded = Math.max(0, formData.requiredNumber - formData.currentNumber)

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tạo bài tuyển người</h2>
          <p className="text-gray-600">Điền thông tin chi tiết để hoàn thành</p>
        </div>

        {formErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
            {formErrors.map((err, idx) => (
              <div key={idx} className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{err}</p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Summary of selected matches */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Trận đấu đã chọn ({selectedMatchList.length})
            </h3>
            {selectedMatchList.map((match) => (
              <div key={match.id} className="text-sm text-gray-700 flex justify-between">
                <span>
                  {formatMatchDate(match.date)} - {formatMatchTime(match.startTime, match.endTime)}
                </span>
                <span className="font-medium">{formatPrice(match.price)}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-green-200 flex justify-between font-semibold">
              <span>Tổng tiền:</span>
              <span className="text-green-600">{formatPrice(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Form fields */}
        <div>
          <Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Tiêu đề <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="VD: Tìm 3 người chơi bóng đá vào chiều nay"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="mt-2 h-12 text-base"
            maxLength={100}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.title.length}/100
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium">
            Mô tả / Trình độ yêu cầu <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="VD: Trình độ trung bình, chơi vui vẻ. Vui lòng liên hệ trước 2 tiếng."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="mt-2 min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.description.length}/500
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="requiredNumber" className="text-base font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Tổng người cần <span className="text-red-500">*</span>
            </Label>
            <Input
              id="requiredNumber"
              type="number"
              min="1"
              max="50"
              value={formData.requiredNumber}
              onChange={(e) => handleInputChange('requiredNumber', parseInt(e.target.value) || 1)}
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label htmlFor="currentNumber" className="text-base font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              Người hiện có <span className="text-red-500">*</span>
            </Label>
            <Input
              id="currentNumber"
              type="number"
              min="1"
              max={formData.requiredNumber}
              value={formData.currentNumber}
              onChange={(e) => handleInputChange('currentNumber', parseInt(e.target.value) || 1)}
              className="mt-2 h-12"
            />
          </div>
        </div>

        {/* Info box */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">Chi tiết tuyển người:</p>
                <ul className="space-y-1">
                  <li>• Cần tuyển: <strong>{playersNeeded} người</strong></li>
                  <li>• Giá mỗi người: <strong>{formatPrice(pricePerPerson)}</strong></li>
                  <li>• Tổng tiền: <strong>{formatPrice(totalPrice)}</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPageStep('select-matches')}
            className="flex-1 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !formData.title.trim() || !formData.description.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700 h-12"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Tạo bài viết
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (pageStep) {
      case 'select-order':
        return renderSelectOrder()
      case 'select-matches':
        return renderSelectMatches()
      case 'create-post':
        return renderCreatePost()
      default:
        return null
    }
  }

  // Show loading state while getting user info
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  // Show error if not logged in
  if (error && !userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Link href="/community" className="flex items-center gap-3 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Cộng đồng</span>
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Yêu cầu đăng nhập</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <Link href="/login">
                <Button className="bg-red-600 hover:bg-red-700">Đăng nhập ngay</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const stepLabels = {
    'select-order': 'Bước 1/3: Chọn đơn đặt sân',
    'select-matches': 'Bước 2/3: Chọn trận đấu',
    'create-post': 'Bước 3/3: Tạo bài viết'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/community" className="flex items-center gap-3 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Cộng đồng</span>
            </Link>

            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {(['select-order', 'select-matches', 'create-post'] as const).map((step, idx) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${pageStep === step
                    ? "bg-green-600 text-white"
                    : ['select-order', 'select-matches', 'create-post'].indexOf(pageStep) > idx
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {['select-order', 'select-matches', 'create-post'].indexOf(pageStep) > idx ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
              ))}
            </div>

            <span className="text-sm text-gray-600 font-medium">
              {stepLabels[pageStep]}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Tạo bài tuyển người
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {stepLabels[pageStep]}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
