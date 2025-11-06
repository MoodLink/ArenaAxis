// Kích hoạt chế độ client-side rendering cho component này
"use client"
// Import các hook và component cần thiết
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupUser } from "@/services/api-new"

export default function SignUpPage() {
  const router = useRouter()
  // State lưu tên người dùng nhập
  const [name, setName] = useState("")
  // State lưu email người dùng nhập
  const [email, setEmail] = useState("")
  // State lưu password người dùng nhập
  const [password, setPassword] = useState("")
  // State lưu số điện thoại người dùng nhập
  const [phone, setPhone] = useState("")
  // State lưu thông báo lỗi
  const [error, setError] = useState("")
  // State lưu thông báo thành công
  const [success, setSuccess] = useState("")
  // State kiểm soát trạng thái loading khi gửi request
  const [loading, setLoading] = useState(false)

  // Hàm xử lý đăng ký khi submit form
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Kiểm tra định dạng password: ít nhất 8 ký tự, có chữ hoa, chữ thường và số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số");
      setLoading(false);
      return;
    }

    // Kiểm tra định dạng số điện thoại: đúng 10 chữ số
    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Số điện thoại phải có đúng 10 chữ số");
      setLoading(false);
      return;
    }

    try {
      const result = await signupUser({ name, email, password, phone });
      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Ảnh nền */}
      <div className="absolute inset-0 z-0">
        <img src="/modern-football-turf-field.png" alt="Modern football turf" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-teal-500/70 to-green-400/60"></div>
      </div>

      {/* Form đăng ký */}
      <Card className="w-full max-w-md mx-4 z-10 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Sign Up</CardTitle>
          <p className="text-white/80 text-sm">
            {/* Link chuyển sang trang đăng nhập nếu đã có tài khoản */}
            Already have an account?{" "}
            <Link href="/login" className="text-white underline hover:text-white/80">
              Sign In
            </Link>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Trường nhập tên */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {/* Trường nhập email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {/* Trường nhập password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {/* Trường nhập số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10 digit phone number"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                maxLength={10}
              />
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-md border border-red-400/30">
                {error}
              </div>
            )}

            {/* Hiển thị thông báo thành công nếu có */}
            {success && (
              <div className="text-green-300 text-sm bg-green-500/20 p-3 rounded-md border border-green-400/30">
                {success}
              </div>
            )}

            {/* Nút submit đăng ký */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Phân cách hoặc đăng ký bằng mạng xã hội */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/80">or</span>
            </div>
          </div>

          {/* Nút đăng ký bằng Google, Facebook (chưa có logic) */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}