import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFieldById } from "@/services/api"
import { Field } from "@/types"
import PageHeader from "@/components/layout/PageHeader"
import {
  FieldNotFound,
  FieldImageGallery,
  FieldDescription,
  FieldAmenities,
  FieldLocationContact,
  FieldBookingSidebar
} from "@/components/fields"

export default async function FieldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params to fix NextJS warning
  const { id } = await params

  // Fetch field data from API service
  const field = await getFieldById(id)

  // Fallback if field not found
  if (!field) {
    return <FieldNotFound />
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <PageHeader
          title={field.name}
          subtitle={`Trải nghiệm sân bóng chất lượng cao tại ${field.location}`}
          breadcrumbs={[
            { label: "Sân bóng", href: "/fields" },
            { label: field.name, isActive: true }
          ]}
          gradientFrom="emerald-500"
          gradientTo="blue-600"
          backgroundImage={field.image}
          badge={`⭐ ${field.rating}/5 • ${field.reviewCount} đánh giá`}
          actions={
            <div className="flex items-center gap-3">
              <Link href={`/reviews/${id}`}>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Xem đánh giá
                </Button>
              </Link>
              <Link href={`/booking/${id}`}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Đặt sân ngay
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <FieldImageGallery field={field} />

            {/* Field Description */}
            <FieldDescription field={field} />

            {/* Amenities & Facilities */}
            <FieldAmenities field={field} />

            {/* Location & Contact */}
            <FieldLocationContact field={field} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <FieldBookingSidebar fieldId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
