// Component form thanh toán với các phương thức khác nhau
// Hỗ trợ thẻ tín dụng, ví điện tử, chuyển khoản ngân hàng

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Building2 } from "lucide-react"

// Interface cho các phương thức thanh toán
interface PaymentMethod {
    id: string // ID phương thức
    name: string // Tên hiển thị
    icon: React.ComponentType<{ className?: string }> // Icon component
}

// Interface cho dữ liệu form
interface PaymentFormData {
    accountNumber: string // Số tài khoản
    ifscCode: string // Mã IFSC (cho ngân hàng)
    name: string // Tên chủ tài khoản
    expiryDate?: string // Ngày hết hạn (cho thẻ)
    cvv?: string // Mã CVV (cho thẻ)
}

interface PaymentFormProps {
    onSubmit?: (data: PaymentFormData, method: string) => void // Callback khi submit
    isLoading?: boolean // Trạng thái loading
}

// Danh sách phương thức thanh toán
const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Thẻ tín dụng", icon: CreditCard },
    { id: "gpay", name: "Ví điện tử", icon: Smartphone },
    { id: "bank", name: "Ngân hàng", icon: Building2 },
]

export default function PaymentForm({
    onSubmit,
    isLoading = false
}: PaymentFormProps) {
    // State quản lý phương thức thanh toán đã chọn
    const [selectedMethod, setSelectedMethod] = useState("card")

    // State quản lý dữ liệu form
    const [formData, setFormData] = useState<PaymentFormData>({
        accountNumber: "",
        ifscCode: "",
        name: "",
        expiryDate: "",
        cvv: ""
    })

    // Xử lý thay đổi input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Xử lý submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validation cơ bản
        if (!formData.accountNumber || !formData.name) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        // Gọi callback nếu có
        if (onSubmit) {
            onSubmit(formData, selectedMethod)
        } else {
            // Xử lý mặc định (có thể thay bằng API call)
            console.log("Thông tin thanh toán:", {
                method: selectedMethod,
                data: formData
            })
            alert("Đã gửi thông tin thanh toán!")
        }
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Grid chọn phương thức thanh toán */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 border rounded-lg flex items-center justify-center gap-2 transition-colors ${selectedMethod === method.id
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <method.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{method.name}</span>
                        </button>
                    ))}
                </div>

                {/* Form nhập thông tin thanh toán */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Số tài khoản/thẻ - bắt buộc cho tất cả phương thức */}
                    <div>
                        <Label htmlFor="accountNumber">
                            {selectedMethod === "card" ? "Số thẻ tín dụng" : "Số tài khoản"} *
                        </Label>
                        <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder={
                                selectedMethod === "card"
                                    ? "1234 5678 9012 3456"
                                    : "Nhập số tài khoản"
                            }
                            className="mt-1"
                            required
                        />
                    </div>

                    {/* Trường đặc biệt cho thẻ tín dụng */}
                    {selectedMethod === "card" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                                <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className="mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="cvv">Mã CVV *</Label>
                                <Input
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className="mt-1"
                                    maxLength={4}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Mã IFSC cho chuyển khoản ngân hàng */}
                    {selectedMethod === "bank" && (
                        <div>
                            <Label htmlFor="ifscCode">Mã IFSC *</Label>
                            <Input
                                id="ifscCode"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleInputChange}
                                placeholder="Nhập mã IFSC"
                                className="mt-1"
                                required
                            />
                        </div>
                    )}

                    {/* Tên chủ tài khoản - bắt buộc cho tất cả */}
                    <div>
                        <Label htmlFor="name">
                            {selectedMethod === "card" ? "Tên trên thẻ" : "Tên chủ tài khoản"} *
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên đầy đủ"
                            className="mt-1"
                            required
                        />
                    </div>

                    {/* Nút thanh toán */}
                    <Button
                        type="submit"
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
