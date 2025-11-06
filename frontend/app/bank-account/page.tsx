"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    CreditCard,
    Building2,
    Trash2,
    Edit,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
    getMyBankAccount,
    createBankAccount,
    updateMyBankAccount,
    deleteMyBankAccount,
    getBanks
} from "@/services/api-new"
import { BankAccountResponse, BankResponse } from "@/types"

export default function BankAccountPage() {
    const router = useRouter()
    const { toast } = useToast()

    // State management
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [bankAccount, setBankAccount] = useState<BankAccountResponse | null>(null)
    const [banks, setBanks] = useState<BankResponse[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        bankId: ""
    })

    // Form validation errors
    const [errors, setErrors] = useState({
        name: "",
        number: "",
        bankId: ""
    })

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                // Check authentication
                const token = localStorage.getItem("token")
                if (!token) {
                    toast({
                        title: "Chưa đăng nhập",
                        description: "Vui lòng đăng nhập để tiếp tục",
                        variant: "destructive",
                    })
                    router.push("/login")
                    return
                }

                // Fetch banks list
                console.log("🏦 Fetching banks list...")
                const banksData = await getBanks()
                console.log("✅ Banks data:", banksData)
                setBanks(banksData)

                // Fetch current bank account
                console.log("💳 Fetching current bank account...")
                try {
                    const accountData = await getMyBankAccount()
                    console.log("✅ Bank account data:", accountData)

                    if (accountData) {
                        setBankAccount(accountData)
                        setFormData({
                            name: accountData.name || "",
                            number: accountData.number || "",
                            bankId: accountData.bank?.id || ""
                        })
                    } else {
                        console.log("ℹ️ No bank account found, user can create one")
                        setIsEditing(true) // Auto switch to create mode
                    }
                } catch (error: any) {
                    // If 404, user doesn't have bank account yet
                    if (error?.message?.includes("404")) {
                        console.log("ℹ️ No bank account found (404), user can create one")
                        setIsEditing(true)
                    } else {
                        throw error
                    }
                }

            } catch (error: any) {
                console.error("❌ Error fetching data:", error)
                toast({
                    title: "Lỗi",
                    description: error?.message || "Không thể tải dữ liệu",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router, toast])

    // Validate form
    const validateForm = (): boolean => {
        const newErrors = {
            name: "",
            number: "",
            bankId: ""
        }

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên chủ tài khoản"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Tên chủ tài khoản phải có ít nhất 2 ký tự"
        }

        // Validate account number
        if (!formData.number.trim()) {
            newErrors.number = "Vui lòng nhập số tài khoản"
        } else if (!/^\d+$/.test(formData.number.trim())) {
            newErrors.number = "Số tài khoản chỉ được chứa chữ số"
        } else if (formData.number.trim().length < 6 || formData.number.trim().length > 20) {
            newErrors.number = "Số tài khoản phải từ 6-20 chữ số"
        }

        // Validate bank selection
        if (!formData.bankId) {
            newErrors.bankId = "Vui lòng chọn ngân hàng"
        }

        setErrors(newErrors)
        return !newErrors.name && !newErrors.number && !newErrors.bankId
    }

    // Handle create/update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng kiểm tra lại thông tin",
                variant: "destructive",
            })
            return
        }

        setSubmitting(true)

        try {
            const request = {
                name: formData.name.trim(),
                number: formData.number.trim(),
                bankId: formData.bankId
            }

            let result: BankAccountResponse

            if (bankAccount) {
                // Update existing account
                console.log("📝 Updating bank account:", request)
                result = await updateMyBankAccount(request)
                toast({
                    title: "Cập nhật thành công",
                    description: "Thông tin tài khoản đã được cập nhật",
                })
            } else {
                // Create new account
                console.log("➕ Creating bank account:", request)
                result = await createBankAccount(request)
                toast({
                    title: "Tạo thành công",
                    description: "Tài khoản ngân hàng đã được thêm",
                })
            }

            console.log("✅ Result:", result)
            setBankAccount(result)
            setIsEditing(false)

        } catch (error: any) {
            console.error("❌ Error submitting:", error)
            toast({
                title: "Lỗi",
                description: error?.message || "Không thể lưu thông tin",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    // Handle delete
    const handleDelete = async () => {
        setSubmitting(true)

        try {
            console.log("🗑️ Deleting bank account...")
            await deleteMyBankAccount()

            toast({
                title: "Xóa thành công",
                description: "Tài khoản ngân hàng đã được xóa",
            })

            setBankAccount(null)
            setFormData({ name: "", number: "", bankId: "" })
            setIsEditing(true)
            setShowDeleteDialog(false)

        } catch (error: any) {
            console.error("❌ Error deleting:", error)
            toast({
                title: "Lỗi",
                description: error?.message || "Không thể xóa tài khoản",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    // Handle cancel edit
    const handleCancelEdit = () => {
        if (bankAccount) {
            setFormData({
                name: bankAccount.name || "",
                number: bankAccount.number || "",
                bankId: bankAccount.bank?.id || ""
            })
            setIsEditing(false)
            setErrors({ name: "", number: "", bankId: "" })
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tài khoản ngân hàng
                    </h1>
                    <p className="text-gray-600">
                        Quản lý thông tin tài khoản ngân hàng để nhận thanh toán
                    </p>
                </div>

                {/* Info Alert */}
                {!bankAccount && !isEditing && (
                    <Alert className="mb-6 border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            Bạn chưa có tài khoản ngân hàng. Vui lòng thêm tài khoản để có thể nhận thanh toán.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Main Card */}
                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                    {bankAccount && !isEditing ? "Thông tin tài khoản" : "Thêm tài khoản ngân hàng"}
                                </CardTitle>
                                <CardDescription>
                                    {bankAccount && !isEditing
                                        ? "Xem và chỉnh sửa thông tin tài khoản ngân hàng của bạn"
                                        : "Điền thông tin tài khoản ngân hàng để nhận thanh toán"}
                                </CardDescription>
                            </div>

                            {/* Action buttons when viewing */}
                            {bankAccount && !isEditing && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {/* View mode */}
                        {bankAccount && !isEditing ? (
                            <div className="space-y-6">
                                {/* Bank info */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                                    {bankAccount.bank?.logoUrl ? (
                                        <img
                                            src={bankAccount.bank.logoUrl}
                                            alt={bankAccount.bank.name}
                                            className="w-16 h-16 object-contain rounded-lg bg-white p-2 border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Building2 className="w-8 h-8 text-blue-600" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                                        <p className="text-xl font-semibold">{bankAccount.bank?.name || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Account details */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-gray-600 mb-2 block">Chủ tài khoản</Label>
                                        <div className="p-3 bg-gray-50 rounded-lg border font-medium">
                                            {bankAccount.name}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-600 mb-2 block">Số tài khoản</Label>
                                        <div className="p-3 bg-gray-50 rounded-lg border font-mono font-medium">
                                            {bankAccount.number}
                                        </div>
                                    </div>
                                </div>

                                {/* Success indicator */}
                                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <p className="text-green-800 font-medium">
                                        Tài khoản đã được xác thực và sẵn sàng nhận thanh toán
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Edit/Create mode */
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Bank selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="bankId">
                                        Ngân hàng <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.bankId}
                                        onValueChange={(value) => {
                                            setFormData({ ...formData, bankId: value })
                                            setErrors({ ...errors, bankId: "" })
                                        }}
                                    >
                                        <SelectTrigger className={errors.bankId ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Chọn ngân hàng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {banks.map((bank) => (
                                                <SelectItem key={bank.id} value={bank.id}>
                                                    <div className="flex items-center gap-2">
                                                        {bank.logoUrl && (
                                                            <img
                                                                src={bank.logoUrl}
                                                                alt={bank.name}
                                                                className="w-6 h-6 object-contain"
                                                            />
                                                        )}
                                                        <span>{bank.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.bankId && (
                                        <p className="text-sm text-red-500">{errors.bankId}</p>
                                    )}
                                </div>

                                {/* Account name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Chủ tài khoản <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="VD: NGUYEN VAN A"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value })
                                            setErrors({ ...errors, name: "" })
                                        }}
                                        className={errors.name ? "border-red-500" : ""}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Tên chủ tài khoản phải trùng với tên trên thẻ ngân hàng
                                    </p>
                                </div>

                                {/* Account number */}
                                <div className="space-y-2">
                                    <Label htmlFor="number">
                                        Số tài khoản <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="number"
                                        placeholder="VD: 1234567890"
                                        value={formData.number}
                                        onChange={(e) => {
                                            // Only allow numbers
                                            const value = e.target.value.replace(/\D/g, "")
                                            setFormData({ ...formData, number: value })
                                            setErrors({ ...errors, number: "" })
                                        }}
                                        className={errors.number ? "border-red-500" : ""}
                                        maxLength={20}
                                    />
                                    {errors.number && (
                                        <p className="text-sm text-red-500">{errors.number}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Nhập số tài khoản từ 6-20 chữ số
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                {bankAccount ? "Cập nhật" : "Thêm tài khoản"}
                                            </>
                                        )}
                                    </Button>
                                    {bankAccount && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            disabled={submitting}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Hủy
                                        </Button>
                                    )}
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Security Notice */}
                <Alert className="mt-6 border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        <strong>Bảo mật:</strong> Thông tin tài khoản của bạn được mã hóa và bảo mật.
                        Chúng tôi chỉ sử dụng để xử lý thanh toán và không chia sẻ với bên thứ ba.
                    </AlertDescription>
                </Alert>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tài khoản ngân hàng này không?
                            Hành động này không thể hoàn tác và bạn sẽ không thể nhận thanh toán cho đến khi thêm tài khoản mới.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={submitting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa tài khoản"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
