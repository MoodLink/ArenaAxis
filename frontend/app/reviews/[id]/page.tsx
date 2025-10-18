import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ArrowLeft } from "lucide-react"
import { getFieldReviews } from "@/services/api"
import { Review, FieldReviewData } from "@/types"

interface ReviewPageProps {
  params: {
    id: string
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id: fieldId } = await params;

  // Fetch data from API service
  const { fieldData, reviews } = await getFieldReviews(fieldId)

  // Fallback if no data found
  if (!fieldData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sân không tìm thấy</h1>
          <Link href="/fields">
            <Button>Quay lại danh sách sân</Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getProgressWidth = (count: number) => {
    return (count / fieldData.totalReviews) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/fields/${fieldId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{fieldData.name}</h1>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Viết đánh giá</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold mb-2">{fieldData.rating}</div>
                  <div className="flex justify-center mb-2">{renderStars(Math.floor(fieldData.rating))}</div>
                  <div className="text-gray-600">{fieldData.totalReviews} đánh giá</div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-sm">{stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressWidth(fieldData.ratingDistribution[stars as keyof typeof fieldData.ratingDistribution])}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {fieldData.ratingDistribution[stars as keyof typeof fieldData.ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Đánh giá gần đây</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gray-300 text-gray-700">{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{review.user}</h3>
                          <span className="text-sm text-gray-500">{review.timeAgo}</span>
                        </div>
                        <div className="flex items-center mb-3">{renderStars(review.rating)}</div>
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        {review.images.length > 0 && (
                          <div className="flex gap-2">
                            {review.images.map((image, index) => (
                              <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg">
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline">Xem thêm đánh giá</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
