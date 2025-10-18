// Component About Section - giới thiệu về ứng dụng
// Hiển thị thông tin về dịch vụ và các tính năng chính

import { Check } from "lucide-react"

export default function AboutSection() {
    // Danh sách các điểm nổi bật của dịch vụ
    const features = [
        "No cash, No confusion. Just open, book and play. It's that simple.",
        "We're a technology hub that connects local, friendly, and enthusiastic sports adventures.",
        "Such booking records are verified through which users accomplished through."
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
                        <h2 className="text-3xl font-bold mb-6">About ArenaAxis</h2>

                        {/* Mô tả chính */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            ArenaAxis aims to share the game. Whether it's a 5 a side football match under the lights, a social
                            cricket match with your mates or hosting your own tournament, we are passionate about bringing people
                            together through sport.
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
