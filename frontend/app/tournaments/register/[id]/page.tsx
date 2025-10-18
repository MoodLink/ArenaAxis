import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trophy, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { getTournamentById } from "@/services/api"
import { Tournament } from "@/types"

export default async function TournamentRegisterPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch tournament data from API service
  const tournament = await getTournamentById(id)

  // Fallback if tournament not found
  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giải đấu không tìm thấy</h1>
          <Link href="/tournaments">
            <Button>Quay lại danh sách giải đấu</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Helper function to format prize pool
  const formatPrize = (amount: number) => {
    return `₫ ${amount.toLocaleString()}`
  }

  // Mock registration fee based on tournament (in production, this would come from the tournament data)
  const registrationFee = "₫ 2.000.000"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tournaments" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách giải đấu
          </Link>
          <h1 className="text-3xl font-bold mb-2">Đăng ký tham gia giải đấu</h1>
          <p className="text-gray-600">Điền thông tin để đăng ký tham gia {tournament.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tournament Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="aspect-[4/3] relative">
                <img
                  src={tournament.image || "/placeholder.svg"}
                  alt={tournament.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">{tournament.name}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>{tournament.startDate} - {tournament.endDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-3" />
                    <span>{tournament.currentTeams}/{tournament.maxTeams} đội</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Trophy className="w-4 h-4 mr-3" />
                    <span className="font-semibold text-green-600">{formatPrize(tournament.prizePool)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-3" />
                    <span className="font-semibold text-red-600">Phí đăng ký: {registrationFee}</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Phí đăng ký không hoàn lại</li>
                    <li>• Xác nhận đăng ký trong 24h</li>
                    <li>• Cần có giấy tờ tùy thân hợp lệ</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <form className="space-y-6">
              {/* Participation Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Loại tham gia</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="team" className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Cá nhân</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team">Đội nhóm</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Team Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đội/cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teamName">Tên đội/Họ tên *</Label>
                      <Input id="teamName" placeholder="Nhập tên đội hoặc họ tên" required />
                    </div>
                    <div>
                      <Label htmlFor="captainName">Tên đội trưởng/Người đại diện *</Label>
                      <Input id="captainName" placeholder="Nhập tên đội trưởng" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input id="phone" type="tel" placeholder="0123456789" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="example@email.com" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" placeholder="Nhập địa chỉ" />
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách thành viên</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="memberCount">Số lượng thành viên</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số lượng thành viên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 người</SelectItem>
                        <SelectItem value="7">7 người</SelectItem>
                        <SelectItem value="11">11 người</SelectItem>
                        <SelectItem value="15">15 người</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="memberList">Danh sách thành viên (mỗi người một dòng)</Label>
                    <Textarea
                      id="memberList"
                      placeholder="Nguyễn Văn A - 0123456789&#10;Trần Thị B - 0987654321&#10;..."
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Kinh nghiệm thi đấu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Trình độ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Mới bắt đầu</SelectItem>
                        <SelectItem value="intermediate">Trung cấp</SelectItem>
                        <SelectItem value="advanced">Nâng cao</SelectItem>
                        <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="achievements">Thành tích đã đạt được (nếu có)</Label>
                    <Textarea
                      id="achievements"
                      placeholder="Mô tả các thành tích, giải thưởng đã đạt được..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Phí đăng ký: {registrationFee}</h4>
                    <p className="text-sm text-blue-700">
                      Vui lòng chuyển khoản vào tài khoản sau và gửi ảnh chụp biên lai:
                    </p>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        <strong>Ngân hàng:</strong> Vietcombank
                      </p>
                      <p>
                        <strong>Số tài khoản:</strong> 1234567890
                      </p>
                      <p>
                        <strong>Chủ tài khoản:</strong> KICKOFF SPORTS
                      </p>
                      <p>
                        <strong>Nội dung:</strong> DANGKY-{tournament.name.toUpperCase()}-[TEN_DOI]
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentProof">Upload ảnh chụp biên lai chuyển khoản</Label>
                    <Input id="paymentProof" type="file" accept="image/*" />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Điều khoản và điều kiện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms1" />
                      <Label htmlFor="terms1" className="text-sm leading-relaxed">
                        Tôi xác nhận rằng tất cả thông tin đã cung cấp là chính xác và đầy đủ
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms2" />
                      <Label htmlFor="terms2" className="text-sm leading-relaxed">
                        Tôi đồng ý tuân thủ các quy định và luật lệ của giải đấu
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms3" />
                      <Label htmlFor="terms3" className="text-sm leading-relaxed">
                        Tôi hiểu rằng phí đăng ký không được hoàn lại trong mọi trường hợp
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms4" />
                      <Label htmlFor="terms4" className="text-sm leading-relaxed">
                        Tôi đồng ý cho phép ban tổ chức sử dụng hình ảnh trong quá trình thi đấu
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Gửi đăng ký tham gia
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent">
                  Lưu nháp
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
