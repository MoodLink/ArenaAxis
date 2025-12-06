"use client"

import ContactFAQ from "@/components/contact/ContactFAQ"
import OfficeLocations from "@/components/contact/OfficeLocations"
import QuickContactBar from "@/components/contact/QuickContactBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Headphones,
  Users,
  Star,
  Send
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với đội ngũ chuyên nghiệp của ArenaAxis!
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-green-100">Hỗ trợ khách hàng</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">50K+</h3>
                <p className="text-green-100">Khách hàng tin tưởng</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">4.9/5</h3>
                <p className="text-green-100">Đánh giá từ khách hàng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cách thức liên hệ</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chọn phương thức liên hệ phù hợp nhất với bạn. Chúng tôi cam kết phản hồi trong vòng 24 giờ.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
              <CardContent className="pt-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Hotline</h3>
                <p className="text-gray-600 mb-4">Gọi ngay để được hỗ trợ trực tiếp</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  1900-ARENA
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat trực tiếp với nhân viên hỗ trợ</p>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Bắt đầu chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
              <CardContent className="pt-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Email</h3>
                <p className="text-gray-600 mb-4">Gửi email cho đội ngũ hỗ trợ</p>
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  <Mail className="w-4 h-4 mr-2" />
                  support@arenaaxis.com
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input id="name" placeholder="Nhập họ và tên của bạn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" placeholder="0123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Đặt sân</SelectItem>
                          <SelectItem value="payment">Thanh toán</SelectItem>
                          <SelectItem value="account">Tài khoản</SelectItem>
                          <SelectItem value="complaint">Khiếu nại</SelectItem>
                          <SelectItem value="suggestion">Góp ý</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tiêu đề *</Label>
                    <Input id="subject" placeholder="Mô tả ngắn gọn vấn đề của bạn" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea
                      id="message"
                      placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                      rows={5}
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </div>
            </Card>

            <div className="space-y-8">
              <Card>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Điện thoại</h4>
                        <p className="text-gray-600">1900-ARENA (27362)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Email</h4>
                        <p className="text-gray-600">support@arenaaxis.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Địa chỉ</h4>
                        <p className="text-gray-600">
                          Tầng 10, Tòa nhà ABC<br />
                          123 Đường XYZ, Quận 1<br />
                          TP. Hồ Chí Minh, Việt Nam
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">  
          <ContactFAQ />
        </div>
      </section>

     
      <section className="py-16">
        <div className="container mx-auto px-4">
          <OfficeLocations />
        </div>



      </section> */}


      {/* Quick Contact Bar */}

      <QuickContactBar />







    </div>
  )
}