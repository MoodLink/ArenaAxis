"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, CheckCircle, Clock, X, ChevronRight, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getProvinces, getWardsByProvinceId, getMyBankAccount, registerStore, updateStoreImages } from "@/services/api-new"
import { ProvinceResponse, WardResponse, StoreRegistrationRequest } from "@/types"
import { useRouter } from "next/navigation"

type RegistrationStep = 1 | 2 | 3

export default function StoreRegistrationPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
    const [storeId, setStoreId] = useState<string | null>(null)

    const [formData, setFormData] = useState<{
        name: string;
        introduction: string;
        address: string;
        linkGoogleMap: string;
        latitude: number | string;
        longitude: number | string;
        startTime: string;
        endTime: string;
        provinceId: string;
        wardId: string;
    }>({
        name: '',
        introduction: '',
        address: '',
        linkGoogleMap: '',
        latitude: '',
        longitude: '',
        startTime: '',
        endTime: '',
        provinceId: '',
        wardId: '',
    })

    const [files, setFiles] = useState<{
        businessLicense?: File
        coverImage?: File
        avatar?: File
    }>({})

    const [provinces, setProvinces] = useState<ProvinceResponse[]>([])
    const [wards, setWards] = useState<WardResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [checkingBankAccount, setCheckingBankAccount] = useState(true)
    const [hasBankAccount, setHasBankAccount] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
    const [mainPlans, setMainPlans] = useState<any[]>([])
    const [loadingPlans, setLoadingPlans] = useState(true)

    // Check if user has bank account on component mount
    useEffect(() => {
        const checkBankAccount = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const bankAccount = await getMyBankAccount()
                if (bankAccount) {
                    setHasBankAccount(true)
                } else {
                    setHasBankAccount(false)
                }
            } catch (error: any) {
                // If 404, user doesn't have bank account
                if (error?.message?.includes("404") || error?.message?.includes("not found")) {
                    setHasBankAccount(false)
                } else {
                    console.error('Error checking bank account:', error)
                    setError('Có lỗi xảy ra khi kiểm tra tài khoản ngân hàng')
                }
            } finally {
                setCheckingBankAccount(false)
            }
        }
        checkBankAccount()
    }, [router])
 
    // Load main plans on component mount
    useEffect(() => {
        const loadPlans = async () => {
            try {
                const { getMainPlans } = await import('@/services/api-new')
                const plansData = await getMainPlans()
                if (plansData && plansData.length > 0) {
                    setMainPlans(plansData)
                    // Auto-select first plan
                    setSelectedPlanId(plansData[0].id)
                } else {
                    setError('Không có gói dịch vụ nào. Vui lòng thử lại sau.')
                }
            } catch (error: any) {
                console.error('Error loading main plans:', error)
                setError(`Không thể tải gói dịch vụ: ${error?.message || 'Lỗi không xác định'}`)
            } finally {
                setLoadingPlans(false)
            }
        }
        loadPlans()
    }, [])

    // Load provinces on component mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const provincesData = await getProvinces()
                setProvinces(provincesData)
            } catch (error) {
                console.error('Error loading provinces:', error)
            }
        }
        loadProvinces()
    }, [])

    // Load wards when province changes
    useEffect(() => {
        const loadWards = async () => {
            if (formData.provinceId) {
                try {
                    const wardsData = await getWardsByProvinceId(formData.provinceId)
                    setWards(wardsData)
                } catch (error) {
                    console.error('Error loading wards:', error)
                }
            } else {
                setWards([])
            }
        }
        loadWards()
    }, [formData.provinceId])

    const handleInputChange = (field: keyof StoreRegistrationRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFileChange = (field: 'businessLicense' | 'coverImage' | 'avatar', file: File | null) => {
        if (file) {
            setFiles(prev => ({
                ...prev,
                [field]: file
            }))
        }
    }

    const removeFile = (field: 'businessLicense' | 'coverImage' | 'avatar') => {
        setFiles(prev => {
            const updated = { ...prev }
            delete updated[field]
            return updated
        })
    }

    const validateStep1 = (): boolean => {
        if (!formData.name || !formData.address || !formData.startTime ||
            !formData.endTime || !formData.wardId) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc')
            return false
        }
        return true
    }

    const validateStep2 = (): boolean => {
        // Step 2 images are optional, so we can always proceed
        return true
    }

    const validateStep3 = (): boolean => {
        if (!selectedPlanId) {
            setError('Vui lòng chọn một gói dịch vụ')
            return false
        }
        return true
    }

    const handleStep1Submit = async () => {
        setError(null)
        if (!validateStep1()) return

        setLoading(true)
        try {
            // Bước 1: Tạo store với JSON data (không có file)
            const request: StoreRegistrationRequest = {
                ...formData,
                latitude: formData.latitude === '' ? undefined : Number(formData.latitude),
                longitude: formData.longitude === '' ? undefined : Number(formData.longitude)
            }

            const response = await registerStore(request)

            if (!response.success) {
                setError(response.message)
                setLoading(false)
                return
            }

            // Store the storeId for later use
            if (response.storeId) {
                setStoreId(response.storeId)
            }

            // 🔑 QUAN TRỌNG: Refresh token vì backend đã chuyển role USER → CLIENT
            // Token cũ vẫn có role USER, cần token mới với role CLIENT để upload ảnh
            console.log('🔄 Store created! Refreshing token to get new role (CLIENT)...')
            const oldToken = localStorage.getItem('token')
            if (oldToken) {
                try {
                    const { refreshToken } = await import('@/services/api-new')
                    const refreshResponse = await refreshToken(oldToken)
                    if (refreshResponse && refreshResponse.token) {
                        localStorage.setItem('token', refreshResponse.token)
                        console.log('✅ Token refreshed! Now has CLIENT role')
                    }
                } catch (refreshError) {
                    console.warn('⚠️ Failed to refresh token:', refreshError)
                    // Tiếp tục anyway - có thể vẫn work
                }
            }

            // Move to step 2
            setCurrentStep(2)
        } catch (error) {
            console.error('Error in step 1:', error)
            setError('Có lỗi xảy ra khi lưu thông tin cơ bản')
        } finally {
            setLoading(false)
        }
    }

    const handleStep2Submit = async (skipImages: boolean = false) => {
        setError(null)
        if (!validateStep2()) return

        setLoading(true)
        try {
            // Bước 2: Upload ảnh nếu có (sau khi tạo store thành công)
            if (storeId && !skipImages && (files.avatar || files.coverImage || files.businessLicense)) {
                console.log('📤 Starting image upload...')
                const uploadResult = await updateStoreImages(storeId, {
                    avatar: files.avatar,
                    coverImage: files.coverImage,
                    businessLicenseImage: files.businessLicense
                })

                if (!uploadResult.success) {
                    setError(uploadResult.message)
                    setLoading(false)
                    return
                }

                console.log('✅ Upload request sent successfully!')
                console.log('⏳ Backend is processing images asynchronously...')
                console.log('ℹ️ Images will appear in your store shortly (within 1-2 minutes)')
            }

            // Move to step 3
            setCurrentStep(3)
        } catch (error) {
            console.error('Error in step 2:', error)
            setError('Có lỗi xảy ra khi tải ảnh lên')
        } finally {
            setLoading(false)
        }
    }

    const handleStep3Submit = async () => {
        setError(null)
        if (!validateStep3()) return

        setLoading(true)
        try {
            // Bước 3: Đăng ký Main Plan cho Store
            if (storeId && selectedPlanId) {
                const selectedPlanData = mainPlans.find(p => p.id === selectedPlanId)
                console.log(`🎯 Registering plan: ${selectedPlanData?.name} for store: ${storeId}`)

                const { purchaseMainPlan } = await import('@/services/api-new')
                const planResult = await purchaseMainPlan(storeId, selectedPlanId)

                if (!planResult.success) {
                    setError(planResult.message)
                    setLoading(false)
                    return
                }

                console.log('✅ Main plan registered successfully!')
                console.log('📋 Plan Details:', planResult.data)
            }

            // Hiển thị thông báo thành công
            setSuccess(true)
            setTimeout(() => {
                router.push('/profile')
            }, 2000)
        } catch (error) {
            console.error('Error in step 3:', error)
            setError('Có lỗi xảy ra khi hoàn thành đăng ký')
        } finally {
            setLoading(false)
        }
    }

    const handleValidateForm = (): boolean => {
        if (!formData.name || !formData.address || !formData.startTime ||
            !formData.endTime || !formData.wardId) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc')
            return false
        }

        // Business license is optional - can be uploaded later
        // if (!files.businessLicense) {
        //     setError('Vui lòng tải lên giấy phép kinh doanh')
        //     return false
        // }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!handleValidateForm()) return

        setLoading(true)
        setError(null)

        try {
            // Bước 1: Tạo store với JSON data (không có file)
            const request: StoreRegistrationRequest = {
                ...formData,
                latitude: formData.latitude === '' ? undefined : Number(formData.latitude),
                longitude: formData.longitude === '' ? undefined : Number(formData.longitude)
            }

            const response = await registerStore(request)

            if (!response.success) {
                setError(response.message)
                setLoading(false)
                return
            }

            // Bước 2: Upload ảnh nếu có (sau khi tạo store thành công)
            const storeId = response.storeId
            if (storeId && (files.avatar || files.coverImage || files.businessLicense)) {
                const uploadResult = await updateStoreImages(storeId, {
                    avatar: files.avatar,
                    coverImage: files.coverImage,
                    businessLicenseImage: files.businessLicense
                })

                if (!uploadResult.success) {
                    console.warn('Store created but image upload failed:', uploadResult.message)
                    // Vẫn coi như thành công vì store đã được tạo
                }
            }

            // Hiển thị thông báo thành công
            setSuccess(true)
            setTimeout(() => {
                router.push('/profile')
            }, 2000)
        } catch (error) {
            console.error('Error in store registration:', error)
            setError('Có lỗi xảy ra khi đăng ký cửa hàng')
        } finally {
            setLoading(false)
        }
    }

    // Loading state while checking bank account
    if (checkingBankAccount) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardContent className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang kiểm tra tài khoản ngân hàng...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Show error if user doesn't have bank account
    if (!hasBankAccount) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="text-center py-8">
                        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-amber-600 mb-2">Cần có tài khoản ngân hàng</h2>
                        <p className="text-gray-600 mb-6">
                            Bạn cần đăng ký tài khoản ngân hàng trước khi có thể đăng ký cửa hàng.
                            Tài khoản ngân hàng được sử dụng để nhận thanh toán từ các giao dịch của cửa hàng.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => router.push('/profile')}>
                                Quay về hồ sơ
                            </Button>
                            <Button onClick={() => router.push('/bank-account')}>
                                Đăng ký tài khoản ngân hàng
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (success) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Đăng ký thành công!</h2>

                        <div className="space-y-3 text-left max-w-md mx-auto mb-6">
                            <p className="text-gray-700">
                                ✅ Cửa hàng đã được tạo thành công
                            </p>

                            {(files.avatar || files.coverImage || files.businessLicense) && (
                                <Alert className="bg-blue-50 border-blue-200">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-800">
                                        <strong>Ảnh đang được xử lý:</strong><br />
                                        Hệ thống đang upload và tối ưu hóa ảnh của bạn.
                                        Ảnh sẽ hiển thị trong vòng 1-2 phút.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <p className="text-gray-600">
                                Yêu cầu đăng ký đã được gửi. Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ.
                            </p>
                        </div>

                        <Button onClick={() => router.push('/profile')}>
                            Quay về hồ sơ
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Đăng ký trở thành Chủ cửa hàng
                        </CardTitle>
                        <CardDescription className="text-center">
                            Bước {currentStep} / 3: {currentStep === 1 ? 'Thông tin cơ bản' : currentStep === 2 ? 'Tải ảnh lên' : 'Chọn gói dịch vụ'}
                        </CardDescription>

                        {/* Progress Bar */}
                        <div className="flex gap-2 mt-6">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex-1">
                                    <div className={`h-2 rounded-full transition-colors ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}></div>
                                </div>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <Alert className="mb-6" variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* STEP 1: Thông tin cơ bản */}
                        {currentStep === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleStep1Submit() }} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

                                    <div>
                                        <Label htmlFor="name">Tên cửa hàng *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Nhập tên cửa hàng"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="introduction">Giới thiệu</Label>
                                        <Textarea
                                            id="introduction"
                                            value={formData.introduction}
                                            onChange={(e) => handleInputChange('introduction', e.target.value)}
                                            placeholder="Mô tả ngắn về cửa hàng của bạn"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                {/* Địa chỉ */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Địa chỉ</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                                            <Select
                                                value={formData.provinceId}
                                                onValueChange={(value) => {
                                                    handleInputChange('provinceId', value)
                                                    handleInputChange('wardId', '') // Reset ward
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provinces.map((province) => (
                                                        <SelectItem key={province.id} value={province.id}>
                                                            {province.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="ward">Quận/Huyện *</Label>
                                            <Select
                                                value={formData.wardId}
                                                onValueChange={(value) => handleInputChange('wardId', value)}
                                                disabled={!formData.provinceId}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn quận/huyện" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wards.map((ward) => (
                                                        <SelectItem key={ward.id} value={ward.id}>
                                                            {ward.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Số nhà, tên đường..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="linkGoogleMap">Link Google Maps</Label>
                                        <Input
                                            id="linkGoogleMap"
                                            value={formData.linkGoogleMap}
                                            onChange={(e) => handleInputChange('linkGoogleMap', e.target.value)}
                                            placeholder="https://goo.gl/maps/..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="latitude">Vị trí Latitude</Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="0.000001"
                                                value={formData.latitude || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    handleInputChange('latitude', value === '' ? '' : parseFloat(value));
                                                }}
                                                placeholder="10.7769"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="longitude">Vị trí Longitude</Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="0.000001"
                                                value={formData.longitude || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    handleInputChange('longitude', value === '' ? '' : parseFloat(value));
                                                }}
                                                placeholder="106.7009"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thời gian hoạt động */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Thời gian hoạt động</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="startTime">Giờ mở cửa *</Label>
                                            <Input
                                                id="startTime"
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => handleInputChange('startTime', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="endTime">Giờ đóng cửa *</Label>
                                            <Input
                                                id="endTime"
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => handleInputChange('endTime', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="flex-1"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                Tiếp tục
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* STEP 2: Upload Images */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Tải ảnh lên cho cửa hàng</h3>
                                    <Alert className="bg-blue-50 border-blue-200">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-800">
                                            <strong>Lưu ý:</strong> Mỗi ảnh nên có dung lượng &lt; 2MB.
                                            Nếu ảnh quá lớn, vui lòng nén hoặc chọn ảnh khác.
                                        </AlertDescription>
                                    </Alert>

                                    {/* Business License */}
                                    <div>
                                        <Label htmlFor="businessLicense">Giấy phép kinh doanh (tùy chọn)</Label>
                                        <p className="text-xs text-gray-500 mt-1">Max: 1-2MB</p>
                                        <div className="mt-2">
                                            {files.businessLicense ? (
                                                <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <div className="flex-1">
                                                        <p className="text-sm">{files.businessLicense.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(files.businessLicense.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFile('businessLicense')}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <div className="text-center">
                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Tải lên giấy phép kinh doanh</p>
                                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cover Image */}
                                    <div>
                                        <Label htmlFor="coverImage">Ảnh bìa cửa hàng (tùy chọn)</Label>
                                        <p className="text-xs text-gray-500 mt-1">Max: 2MB</p>
                                        <div className="mt-2">
                                            {files.coverImage ? (
                                                <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <div className="flex-1">
                                                        <p className="text-sm">{files.coverImage.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(files.coverImage.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFile('coverImage')}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <div className="text-center">
                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Tải lên ảnh bìa</p>
                                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange('coverImage', e.target.files?.[0] || null)}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Avatar */}
                                    <div>
                                        <Label htmlFor="avatar">Logo cửa hàng (tùy chọn)</Label>
                                        <p className="text-xs text-gray-500 mt-1">Max: 2MB</p>
                                        <div className="mt-2">
                                            {files.avatar ? (
                                                <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <div className="flex-1">
                                                        <p className="text-sm">{files.avatar.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(files.avatar.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFile('avatar')}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <div className="text-center">
                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Tải lên logo</p>
                                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange('avatar', e.target.files?.[0] || null)}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Quay lại
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleStep2Submit(true)}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            'Cập nhật sau'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => handleStep2Submit(false)}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                Tiếp tục
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Choose Main Plan */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Chọn gói dịch vụ</h3>
                                    <p className="text-sm text-gray-600">
                                        Hãy chọn gói dịch vụ phù hợp với nhu cầu của cửa hàng bạn. Bạn có thể nâng cấp hoặc thay đổi gói dịch vụ bất cứ lúc nào.
                                    </p>

                                    {/* Loading state */}
                                    {loadingPlans ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="text-gray-600 mt-4">Đang tải gói dịch vụ...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Plan Options - Dynamic from database */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {mainPlans.map((plan) => (
                                                    <div
                                                        key={plan.id}
                                                        className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedPlanId === plan.id
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => setSelectedPlanId(plan.id)}
                                                    >
                                                        <div className="flex items-start justify-between mb-4">
                                                            <h4 className="text-xl font-bold">{plan.name}</h4>
                                                            {selectedPlanId === plan.id && (
                                                                <CheckCircle className="w-6 h-6 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-4">
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Quay lại
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => handleStep3Submit()}
                                        disabled={loading || !selectedPlanId}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                Hoàn thành đăng ký
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}