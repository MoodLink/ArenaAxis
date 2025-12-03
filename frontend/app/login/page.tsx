// Kích hoạt chế độ client-side rendering cho component này
"use client"
// Import các hook và component cần thiết
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/services/auth.service"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  //  Lấy redirect URL từ query parameters
  const redirectUrl = searchParams.get('redirect')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result = await login(email, password);
      if (!result?.token) {
        setError("Sai tài khoản hoặc mật khẩu");
      } else {
        localStorage.setItem("token", result.token);
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
          const successRole = result.user.role;

          //  Nếu có redirectUrl, ưu tiên chuyển về đó (trừ khi là ADMIN)
          if (redirectUrl && successRole !== "ADMIN") {
            console.log(' Redirecting to:', redirectUrl)

            //  Kiểm tra và khôi phục thông tin đặt sân nếu có
            const pendingBooking = sessionStorage.getItem('pendingBooking')
            if (pendingBooking) {
              console.log(' Restoring pending booking:', pendingBooking)
              // Không cần làm gì, data đã có trong sessionStorage
            }

            router.push(redirectUrl)
          } else if (successRole === "ADMIN") {
            router.push("/admin");
          } else if (successRole === "CLIENT") {
            router.push("/store");
          } else {
            router.push("/");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* 3D Cube Animation Background */}
      <div className="absolute inset-0 z-0">
        {/* Các khối lập phương động tạo hiệu ứng nền 3D */}
        <div className="cube-container">
          <div className="floating-cube cube-1"></div>
          <div className="floating-cube cube-2"></div>
          <div className="floating-cube cube-3"></div>
          <div className="floating-cube cube-4"></div>
          <div className="floating-cube cube-5"></div>
        </div>

        {/* Ảnh nền */}
        <img src="/modern-football-turf-field.png" alt="Modern football turf" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-teal-500/70 to-green-400/60"></div>
      </div>

      {/* Form đăng nhập */}
      <Card className="w-full max-w-md mx-4 z-10 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl transform-gpu perspective-1000 hover:scale-105 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] card-3d">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white animate-fade-in">Đăng nhập</CardTitle>
          <p className="text-white/80 text-sm animate-fade-in-delay">
            {/* Link chuyển sang trang đăng ký nếu chưa có tài khoản */}
            Bạn chưa có tài khoản?{" "}
            <Link href="/signup" className="text-white underline hover:text-white/80 transition-colors">
              Tạo tài khoản
            </Link>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Trường nhập email */}
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 transition-all duration-300 hover:bg-white/30 focus:scale-105"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {/* Trường nhập password */}
            <div className="space-y-2 animate-slide-up-delay">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 transition-all duration-300 hover:bg-white/30 focus:scale-105"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-md border border-red-400/30">
                {error}
              </div>
            )}

            {/* Link quên mật khẩu */}
            <div className="text-center animate-slide-up-delay-2">
              <Link href="/forgot-password" className="text-white/80 text-sm hover:text-white underline transition-colors">
                Quên mật khẩu
              </Link>
            </div>
            {/* Nút submit đăng nhập */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-slide-up-delay-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Đăng nhập"}
            </Button>
          </form>

          {/* Phân cách hoặc đăng nhập bằng mạng xã hội */}
          <div className="relative animate-slide-up-delay-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/80">or</span>
            </div>
          </div>

          {/* Nút đăng nhập bằng Google, Facebook (chưa có logic) */}
          <div className="flex gap-4 justify-center animate-slide-up-delay-5">
            <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30 transform hover:scale-110 hover:rotate-6 transition-all duration-300">
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
            <Button variant="outline" size="icon" className="bg-white/20 border-white/30 hover:bg-white/30 transform hover:scale-110 hover:-rotate-6 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Style cho hiệu ứng động 3D và các animation */}
      <style jsx>{`
        .cube-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          perspective: 1200px;
        }
        
        .floating-cube {
          position: absolute;
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3));
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-cube::before {
          content: '';
          position: absolute;
          top: -60px;
          left: 0;
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2));
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: rotateX(90deg);
          transform-origin: bottom;
        }
        
        .floating-cube::after {
          content: '';
          position: absolute;
          top: 0;
          right: -60px;
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.15));
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: rotateY(90deg);
          transform-origin: left;
        }
        
        .cube-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 8s;
        }
        
        .cube-2 {
          top: 60%;
          right: 15%;
          animation-delay: -2s;
          animation-duration: 10s;
        }
        
        .cube-3 {
          top: 80%;
          left: 20%;
          animation-delay: -4s;
          animation-duration: 7s;
        }
        
        .cube-4 {
          top: 30%;
          right: 30%;
          animation-delay: -1s;
          animation-duration: 9s;
        }
        
        .cube-5 {
          top: 10%;
          right: 5%;
          animation-delay: -3s;
          animation-duration: 11s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: translateY(-20px) rotateX(90deg) rotateY(90deg);
          }
          50% {
            transform: translateY(-40px) rotateX(180deg) rotateY(180deg);
          }
          75% {
            transform: translateY(-20px) rotateX(270deg) rotateY(270deg);
          }
        }
        
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        
        .card-3d:hover {
          transform: rotateX(5deg) rotateY(5deg) scale(1.05);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out 0.3s both;
        }
        
        .animate-slide-up-delay {
          animation: slideUp 0.6s ease-out 0.4s both;
        }
        
        .animate-slide-up-delay-2 {
          animation: slideUp 0.6s ease-out 0.5s both;
        }
        
        .animate-slide-up-delay-3 {
          animation: slideUp 0.6s ease-out 0.6s both;
        }
        
        .animate-slide-up-delay-4 {
          animation: slideUp 0.6s ease-out 0.7s both;
        }
        
        .animate-slide-up-delay-5 {
          animation: slideUp 0.6s ease-out 0.8s both;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
