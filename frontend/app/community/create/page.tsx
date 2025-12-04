"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
  Trophy
} from "lucide-react"
import Link from "next/link"
import { getSports, createCommunityPost } from "@/services/api"
import { Sport } from "@/types"
import {
  skillLevels,
  bookingHistoryLocations,
  popularTags
} from "@/data/mockData"

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    location: "",
    date: "",
    time: "",
    endTime: "",
    level: "",
    maxParticipants: "",
    costType: "free", // free, split, total
    costAmount: "",
    description: "",
    tags: [] as string[],
    contactInfo: "",
    requirements: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [sports, setSports] = useState<Sport[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1) // Multi-step form
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch sports data on component mount
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsData = await getSports()
        console.log('Sports fetched:', sportsData)
        setSports(Array.isArray(sportsData) ? sportsData : [])
      } catch (error) {
        console.error('Error fetching sports:', error)
        // Add fallback sports data if API fails
        setSports([
          { id: '1', name: 'Tennis' },
          { id: '2', name: 'Cầu lông' },
          { id: '3', name: 'Bóng đá' },
          { id: '4', name: 'Bóng rổ' },
          { id: '5', name: 'Bơi lội' },
          { id: '6', name: 'Chạy bộ' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSports()
  }, [])

  // Data được import từ mockData.ts để đồng bộ

  const validateStep1 = () => {
    return formData.title.trim() && formData.sport && formData.date && formData.time
  }

  const validateStep2 = () => {
    // Step 2 is now optional - users can skip it
    return true
  }

  const validateStep3 = () => {
    // Step 3 is now optional - users can skip it
    return true
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.length)
    setUploadedFiles(prev => [...prev, ...newFiles])

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const newPost = {
        title: formData.title,
        content: formData.description,
        author: {
          id: "current-user-id", // This should come from auth context
          name: "Current User",
          avatar: "/placeholder-user.jpg"
        },
        sport: formData.sport,
        location: formData.location,
        date: formData.date ? new Date(formData.date) : new Date(),
        time: `${formData.time} - ${formData.endTime}`,
        level: formData.level,
        participants: 0,
        maxParticipants: parseInt(formData.maxParticipants) || 20,
        cost: formData.costType === 'free' ? 'Miễn phí' : `${formData.costAmount}k VND`,
        likes: 0,
        comments: 0,
        tags: [...formData.tags, formData.sport, formData.level].filter(Boolean),
        createdAt: new Date().toISOString()
      }

      const success = await createCommunityPost(newPost)

      if (success) {
        // Redirect to community page or show success message
        alert("Tạo hoạt động thành công!")
        // You can add router.push("/community") here if using useRouter
      } else {
        alert("Có lỗi xảy ra khi tạo hoạt động")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Có lỗi xảy ra khi tạo hoạt động")
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thông tin cơ bản</h3>
              <p className="text-gray-600">Hãy bắt đầu với những thông tin quan trọng nhất</p>
            </div>

            <div>
              <Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Tiêu đề hoạt động <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="VD: Tìm 2 người chơi tennis đôi chiều nay"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-2 h-12 text-base"
                maxLength={100}
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.title.length}/100
                {formData.title.length < 15 && (
                  <span className="text-amber-600 ml-2">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Tiêu đề nên dài hơn để thu hút người tham gia
                  </span>
                )}
                {formData.title.length >= 15 && formData.title.length < 80 && (
                  <span className="text-green-600 ml-2">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Tiêu đề tốt
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="sport" className="text-base font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-green-500" />
                Môn thể thao <span className="text-red-500">*</span>
              </Label>
              <select
                id="sport"
                value={formData.sport}
                onChange={(e) => handleInputChange("sport", e.target.value)}
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Chọn môn thể thao</option>
                {loading ? (
                  <option disabled>Đang tải...</option>
                ) : sports.length > 0 ? (
                  sports.map((sport) => (
                    <option key={sport.id} value={sport.name}>
                      {sport.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Tennis">Tennis</option>
                    <option value="Cầu lông">Cầu lông</option>
                    <option value="Bóng đá">Bóng đá</option>
                    <option value="Bóng rổ">Bóng rổ</option>
                    <option value="Bơi lội">Bơi lội</option>
                    <option value="Chạy bộ">Chạy bộ</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Ngày <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="mt-2 h-12"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-base font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  Giờ bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="mt-2 h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-base font-medium">
                  Giờ kết thúc
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="mt-2 h-12"
                />
              </div>
            </div>

            {/* Preview card - matches the design in image */}
            {formData.title && formData.sport && (
              <Card className="border border-green-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      N
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Nguyễn Văn An</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded">Hot</Badge>
                      </div>
                      <p className="text-sm text-gray-500">2 ngày trước</p>
                    </div>
                    <div className="flex gap-2">
                      {/* <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1">Gấp</Badge> */}
                      <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">{formData.sport || 'Tennis'}</Badge>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {formData.title}
                  </h2>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {formData.date ? new Date(formData.date).toLocaleDateString('vi-VN') : 'Hôm nay'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {formData.time ? `${formData.time} - ${formData.endTime || '21:00'}` : '19:00 - 21:00'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {formData.location || 'Hà Nội'}
                    </div>
                  </div>

                  {(formData.description || formData.level || formData.maxParticipants) && (
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {formData.description || 'Mình và bạn cần tìm thêm 2 người chơi tennis đôi lúc 18h tại sân Lotte Mart Quận 7. Level trung bình, chơi vui vẻ. Chi phí 80k/người bao gồm sân và nước.'}
                    </p>
                  )}

                  {/* Info grid matching the design */}
                  <div className="grid grid-cols-4 gap-4 py-4 mb-4 bg-gray-50 rounded-lg px-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Trình độ</p>
                      <p className="font-medium text-gray-900">{formData.level || 'Trung bình'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Chi phí</p>
                      <p className="font-medium text-green-600">
                        {formData.costType === 'free' ? 'Miễn phí' :
                          formData.costType === 'split' && formData.costAmount ? `${formData.costAmount}k` :
                            formData.costType === 'total' && formData.costAmount ? `${formData.costAmount}k VND` : '50k'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Tham gia</p>
                      <p className="font-medium text-blue-600">{`9/${formData.maxParticipants || '8'}`}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Thời hạn</p>
                      <p className="font-medium text-orange-600">{formData.date ? '2 ngày' : '2 ngày'}</p>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6 text-gray-500">
                      <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                        <span>❤️</span>
                        <span className="text-sm">13</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                        <span>💬</span>
                        <span className="text-sm">5</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">9 tham gia</span>
                      </button>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                      Liên hệ với chủ sân
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Địa điểm & Yêu cầu</h3>
              <p className="text-gray-600">Thông tin về nơi diễn ra và ai có thể tham gia</p>
            </div>

            <div>
              <Label htmlFor="location" className="text-base font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Địa điểm <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  id="location"
                  placeholder="VD: Sân tennis Lotte Mart, Quận 7 hoặc địa chỉ cụ thể"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="h-12 text-base"
                  required
                />
                {formData.location.length > 0 && formData.location.length < 10 && (
                  <p className="text-sm text-amber-600 mt-1">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Nên ghi rõ tên sân và quận/huyện để dễ tìm
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Label className="text-sm text-gray-600">Hoặc chọn từ lịch sử:</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {bookingHistoryLocations.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleInputChange("location", location)}
                      className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level" className="text-base font-medium flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Trình độ yêu cầu <span className="text-red-500">*</span>
                </Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Chọn trình độ</option>
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="maxParticipants" className="text-base font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Số người tối đa <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="50"
                  placeholder="VD: 4"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                  className="mt-2 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Chi phí
              </Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="free"
                    name="costType"
                    value="free"
                    checked={formData.costType === "free"}
                    onChange={(e) => handleInputChange("costType", e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="free" className="cursor-pointer">💚 Miễn phí</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="split"
                    name="costType"
                    value="split"
                    checked={formData.costType === "split"}
                    onChange={(e) => handleInputChange("costType", e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="split" className="cursor-pointer">💰 Chia đều chi phí</Label>
                  {formData.costType === "split" && (
                    <div className="flex items-center gap-2 ml-4">
                      <Input
                        placeholder="50"
                        value={formData.costAmount}
                        onChange={(e) => handleInputChange("costAmount", e.target.value)}
                        className="w-20 h-8"
                      />
                      <span className="text-sm text-gray-600">k VNĐ/người</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="total"
                    name="costType"
                    value="total"
                    checked={formData.costType === "total"}
                    onChange={(e) => handleInputChange("costType", e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="total" className="cursor-pointer">💳 Tổng chi phí cố định</Label>
                  {formData.costType === "total" && (
                    <div className="flex items-center gap-2 ml-4">
                      <Input
                        placeholder="200"
                        value={formData.costAmount}
                        onChange={(e) => handleInputChange("costAmount", e.target.value)}
                        className="w-20 h-8"
                      />
                      <span className="text-sm text-gray-600">k VNĐ</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mô tả & Hoàn thiện</h3>
              <p className="text-gray-600">Cuối cùng, hãy chia sẻ thêm thông tin chi tiết</p>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium">
                Mô tả hoạt động <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="VD: Mình và bạn cần tìm thêm 2 người chơi tennis đôi lúc 18h tại sân Lotte Mart Quận 7. Level trung bình, chơi vui vẻ. Chi phí 80k/người bao gồm sân và nước. Liên hệ Zalo: 0xxx-xxx-xxx"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-2 min-h-[140px] resize-none text-base leading-relaxed"
                maxLength={600}
              />
              <div className="flex justify-between items-center text-sm mt-1">
                <span className={`${formData.description.length < 30 ? 'text-amber-600' : 'text-green-600'}`}>
                  {formData.description.length < 30 && (
                    <>
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Mô tả chi tiết hơn để thu hút người tham gia
                    </>
                  )}
                  {formData.description.length >= 30 && formData.description.length < 500 && (
                    <>
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Mô tả rất tốt!
                    </>
                  )}
                  {formData.description.length >= 500 && (
                    <>
                      <Info className="w-3 h-3 inline mr-1" />
                      Mô tả đầy đủ
                    </>
                  )}
                </span>
                <span className="text-gray-500">{formData.description.length}/600</span>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Tags (Tối đa 5)</Label>
              <div className="mt-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.includes(tag) || formData.tags.length >= 5}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.tags.includes(tag)
                        ? "bg-green-100 text-green-700 border-green-300 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        }`}
                    >
                      {formData.tags.includes(tag) ? "✓ " : "+ "}{tag}
                    </button>
                  ))}
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Tags đã chọn:</span>
                  {formData.tags.map((tag) => (
                    <Badge key={tag} className="bg-green-100 text-green-800 border-green-300">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-blue-500" />
                Hình ảnh/Video
              </Label>
              <div
                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Kéo thả file hoặc </span>
                  <span className="text-blue-600 underline">chọn file</span>
                </p>
                <p className="text-sm text-gray-500">JPG, PNG, MP4 • Tối đa 50MB/file • Tối đa 5 file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600 text-center p-2">
                          {file.name.length > 15 ? `${file.name.slice(0, 15)}...` : file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Đang tải lên...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="contactInfo" className="text-base font-medium flex items-center gap-2">
                <span>📱</span>
                Thông tin liên hệ (khuyến khích)
              </Label>
              <Input
                id="contactInfo"
                placeholder="VD: Zalo: 0xxx-xxx-xxx hoặc Facebook: fb.com/username"
                value={formData.contactInfo}
                onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                className="mt-2 h-12 text-base"
              />
              <p className="text-sm text-gray-500 mt-1">
                <Info className="w-3 h-3 inline mr-1" />
                Sẽ hiển thị sau khi người khác tham gia để họ liên hệ trực tiếp với bạn
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
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
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === stepNumber
                    ? "bg-green-600 text-white"
                    : step > stepNumber
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                </div>
              ))}
            </div>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {previewMode ? "Chỉnh sửa" : "Xem trước"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Tạo hoạt động thể thao
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === 1 && "Bước 1/3: Thông tin cơ bản"}
              {step === 2 && "Bước 2/3: Địa điểm & Yêu cầu"}
              {step === 3 && "Bước 3/3: Mô tả & Hoàn thiện"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>

                <div className="flex gap-3">
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={(step === 1 && !validateStep1())}
                      className="bg-green-600 hover:bg-green-700 px-6"
                    >
                      Tiếp theo
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700 px-8 h-12"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Tạo hoạt động
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Help text */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1"> Mẹo để có hoạt động thu hút:</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Tiêu đề rõ ràng, cụ thể về môn thể thao và thời gian</li>
                      <li>• Mô tả chi tiết về địa điểm và yêu cầu kỹ năng</li>
                      <li>• Thêm hình ảnh minh họa để thu hút hơn</li>
                      <li>• Cập nhật thông tin liên hệ để dễ kết nối</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
