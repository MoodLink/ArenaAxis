// Component About Section - giới thiệu về ứng dụng
// Hiển thị thông tin về dịch vụ và các tính năng chính

import { Check } from "lucide-react"

export default function AboutSection() {
    // Danh sách các điểm nổi bật của dịch vụ
    const features = [
        "Không tiền mặt, không rắc rối. Chỉ cần mở, đặt chỗ và chơi. Đơn giản vậy thôi.",
        "Chúng tôi là một trung tâm công nghệ kết nối những người đam mê thể thao địa phương, thân thiện và nhiệt tình.",
        "Những hồ sơ đặt chỗ này được xác minh thông qua việc người dùng thực hiện."
    ]

    return (
        <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Hình ảnh minh họa */}
                    <div>
                        <img
                            src="/football-player-in-action-stadium.png"
                            alt="About ArenaAxis"
                            className="rounded-lg shadow-lg w-full h-auto"
                        />
                    </div>

                    {/* Nội dung văn bản */}
                    <div>
                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-bold mb-6">Giới thiệu về ArenaAxis
                        </h2>

                        {/* Mô tả chính */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            ArenaAxis hướng đến mục tiêu chia sẻ trò chơi. Dù là một trận bóng đá 5 người dưới ánh đèn sân khấu, một trận đấu cricket giao lưu với bạn bè hay tự tổ chức giải đấu, chúng tôi luôn tâm huyết mang mọi người đến gần nhau hơn thông qua thể thao.
                        </p>

                        {/* Danh sách các tính năng */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    {/* Icon check với background xanh */}
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>

                                    {/* Nội dung tính năng */}
                                    <p className="text-gray-600 leading-relaxed">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
