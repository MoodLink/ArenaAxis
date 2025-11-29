'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, Upload, X, CheckCircle } from 'lucide-react';
import { StoreAdminDetailResponse, ProvinceResponse, WardResponse } from '@/types';
import { getProvinces, getWardsByProvinceId, updateStoreInfo, updateStoreImages, getMainPlans, purchaseMainPlan } from '@/services/api-new';

type EditStep = 1 | 2 | 3;

interface StoreEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    store: StoreAdminDetailResponse | null;
    onSave?: (updatedStore: Partial<StoreAdminDetailResponse>) => void;
}

export default function StoreEditDialog({
    isOpen,
    onClose,
    store,
    onSave,
}: StoreEditDialogProps) {
    const [currentStep, setCurrentStep] = useState<EditStep>(1);
    const [formData, setFormData] = useState<Partial<StoreAdminDetailResponse>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
    const [wards, setWards] = useState<WardResponse[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
    const [selectedWardId, setSelectedWardId] = useState<string>('');

    // Step 2: Image files
    const [files, setFiles] = useState<{
        avatar?: File;
        coverImage?: File;
        businessLicense?: File;
    }>({});

    // Step 3: Main Plans
    const [mainPlans, setMainPlans] = useState<any[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [loadingPlans, setLoadingPlans] = useState(true);

    // Load provinces on component mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const provincesData = await getProvinces();
                setProvinces(provincesData);
            } catch (error) {
                console.error('Error loading provinces:', error);
            }
        };
        loadProvinces();
    }, []);

    // Load wards when province changes
    useEffect(() => {
        const loadWards = async () => {
            if (selectedProvinceId) {
                try {
                    const wardsData = await getWardsByProvinceId(selectedProvinceId);
                    setWards(wardsData);
                } catch (error) {
                    console.error('Error loading wards:', error);
                }
            } else {
                setWards([]);
            }
        };
        loadWards();
    }, [selectedProvinceId]);

    // Load main plans for Step 3
    useEffect(() => {
        const loadPlans = async () => {
            try {
                const plansData = await getMainPlans();
                if (plansData && plansData.length > 0) {
                    setMainPlans(plansData);
                    setSelectedPlanId(plansData[0].id);
                }
            } catch (error) {
                console.error('Error loading plans:', error);
            } finally {
                setLoadingPlans(false);
            }
        };
        loadPlans();
    }, []);

    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name,
                introduction: store.introduction,
                address: store.address,
                linkGoogleMap: store.linkGoogleMap,
                startTime: store.startTime,
                endTime: store.endTime,
            });
            setError(null);
            // Reset province selection
            setSelectedProvinceId('');
            // Reset to step 1 when dialog opens
            setCurrentStep(1);
            setFiles({});
            setSelectedPlanId(mainPlans.length > 0 ? mainPlans[0].id : null);
        }
    }, [store, isOpen, mainPlans]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Handle number inputs specially
        if (name === 'latitude' || name === 'longitude') {
            const numValue = value ? parseFloat(value) : '';
            setFormData((prev) => ({
                ...prev,
                [name]: numValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleProvinceChange = (value: string) => {
        setSelectedProvinceId(value);
        // Reset ward when province changes
        setSelectedWardId('');
    };

    const handleWardChange = (value: string) => {
        setSelectedWardId(value);
        setFormData((prev) => ({
            ...prev,
            wardId: value,
        }));
    };

    const handleFileChange = (field: 'avatar' | 'coverImage' | 'businessLicense', file: File | null) => {
        if (file) {
            setFiles((prev) => ({
                ...prev,
                [field]: file,
            }));
        }
    };

    const removeFile = (field: 'avatar' | 'coverImage' | 'businessLicense') => {
        setFiles((prev) => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
    };

    const handleStep1Next = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Validate required fields
            if (!formData.name?.trim()) {
                setError('Tên trung tâm thể thao không được để trống');
                setIsLoading(false);
                return;
            }

            if (!formData.address?.trim()) {
                setError('Địa chỉ không được để trống');
                setIsLoading(false);
                return;
            }

            // ⏳ Backend chưa hỗ trợ PUT endpoint
            // Tạm thời chỉ validate frontend, không gọi API
            console.log('📝 Form data validated (Backend update pending):', formData);
            console.log('ℹ️ Backend chưa implement PUT /stores/{storeId}');

            // Move to step 2
            setCurrentStep(2);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Lỗi khi xử lý'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2Next = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Upload images if any
            if (store?.id && (files.avatar || files.coverImage || files.businessLicense)) {
                console.log('📤 Starting image upload...');
                const uploadResult = await updateStoreImages(store.id, {
                    avatar: files.avatar,
                    coverImage: files.coverImage,
                    businessLicenseImage: files.businessLicense,
                });

                if (!uploadResult.success) {
                    setError(uploadResult.message);
                    setIsLoading(false);
                    return;
                }

                console.log('✅ Upload request sent successfully!');
                console.log('⏳ Backend is processing images asynchronously...');
            } else {
                console.log('ℹ️ No images selected - skipping upload');
            }

            setCurrentStep(3);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Lỗi khi tải ảnh lên'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep3Complete = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Register main plan if selected
            if (store?.id && selectedPlanId) {
                const selectedPlanData = mainPlans.find((p) => p.id === selectedPlanId);
                console.log(
                    `🎯 Registering plan: ${selectedPlanData?.name} for store: ${store.id}`
                );

                const planResult = await purchaseMainPlan(store.id, selectedPlanId);

                if (!planResult.success) {
                    setError(planResult.message);
                    setIsLoading(false);
                    return;
                }

                console.log('✅ Main plan registered successfully!');
                console.log('📋 Plan Details:', planResult.data);
            }

            if (onSave) {
                onSave(formData);
            }

            console.log('✅ All steps completed!');
            console.log('📝 Form data saved to state:', formData);
            console.log('ℹ️ Waiting for backend to implement PUT /stores/{storeId}');
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Lỗi khi hoàn thành cập nhật'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin cửa hàng</DialogTitle>
                    <DialogDescription>
                        {currentStep === 1 && 'Step 1: Cập nhật thông tin cơ bản'}
                        {currentStep === 2 && 'Step 2: Cập nhật ảnh cửa hàng'}
                        {currentStep === 3 && 'Step 3: Cập nhật gói dịch vụ'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress indicator */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`flex-1 h-2 rounded-full transition-colors ${currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>

                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="flex items-start gap-3 p-4">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <>
                            <Card className="bg-amber-50 border-amber-200 mb-4">
                                <CardContent className="p-4">
                                    <p className="text-sm text-amber-700">
                                        <strong>⏳ Chú ý:</strong> Backend chưa implement PUT endpoint. Hiện tại chỉ validate frontend, dữ liệu sẽ được lưu khi backend sẵn sàng.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Tên cửa hàng */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-semibold">
                                    Tên trung tâm thể thao *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nhập tên trung tâm thể thao"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="space-y-2">
                                <Label htmlFor="introduction" className="font-semibold">
                                    Mô tả cửa hàng
                                </Label>
                                <Textarea
                                    id="introduction"
                                    name="introduction"
                                    placeholder="Nhập mô tả về cửa hàng"
                                    value={formData.introduction || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    rows={4}
                                />
                            </div>

                            {/* Địa chỉ */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="font-semibold">
                                    Địa chỉ *
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Nhập địa chỉ cửa hàng"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Liên kết Google Map */}
                            <div className="space-y-2">
                                <Label htmlFor="linkGoogleMap" className="font-semibold">
                                    Liên kết Google Map
                                </Label>
                                <Input
                                    id="linkGoogleMap"
                                    name="linkGoogleMap"
                                    type="url"
                                    placeholder="https://maps.google.com/..."
                                    value={formData.linkGoogleMap || ''}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Tỉnh/Thành phố */}
                            <div className="space-y-2">
                                <Label htmlFor="province" className="font-semibold">
                                    Tỉnh/Thành phố
                                </Label>
                                <Select
                                    value={selectedProvinceId}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger disabled={isLoading}>
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

                            {/* Quận/Huyện */}
                            <div className="space-y-2">
                                <Label htmlFor="ward" className="font-semibold">
                                    Quận/Huyện
                                </Label>
                                <Select
                                    value={selectedWardId}
                                    onValueChange={handleWardChange}
                                    disabled={!selectedProvinceId || isLoading}
                                >
                                    <SelectTrigger disabled={!selectedProvinceId || isLoading}>
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

                            {/* Tọa độ - Latitude & Longitude */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude" className="font-semibold">
                                        Latitude
                                    </Label>
                                    <Input
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        placeholder="Vd: 21.0285"
                                        step="0.0001"
                                        value={(formData as any)?.latitude || ''}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude" className="font-semibold">
                                        Longitude
                                    </Label>
                                    <Input
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        placeholder="Vd: 105.8542"
                                        step="0.0001"
                                        value={(formData as any)?.longitude || ''}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Giờ mở cửa - Đóng cửa */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime" className="font-semibold">
                                        Giờ mở cửa
                                    </Label>
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        value={formData.startTime || ''}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime" className="font-semibold">
                                        Giờ đóng cửa
                                    </Label>
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        value={formData.endTime || ''}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 2: Images */}
                    {currentStep === 2 && (
                        <>
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-4">
                                    <p className="text-sm text-blue-700">
                                        <strong>Step 2:</strong> Cập nhật các ảnh của cửa hàng (tuỳ chọn)
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Avatar */}
                            <div className="space-y-2">
                                <Label htmlFor="avatar" className="font-semibold">
                                    Ảnh đại diện cửa hàng
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    {files.avatar ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="text-sm text-gray-700">
                                                    {files.avatar.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('avatar')}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    Nhấp để chọn ảnh
                                                </span>
                                            </div>
                                            <input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange('avatar', e.target.files?.[0] || null)
                                                }
                                                disabled={isLoading}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2">
                                <Label htmlFor="coverImage" className="font-semibold">
                                    Ảnh bìa cửa hàng
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    {files.coverImage ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="text-sm text-gray-700">
                                                    {files.coverImage.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('coverImage')}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    Nhấp để chọn ảnh
                                                </span>
                                            </div>
                                            <input
                                                id="coverImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange('coverImage', e.target.files?.[0] || null)
                                                }
                                                disabled={isLoading}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Business License */}
                            <div className="space-y-2">
                                <Label htmlFor="businessLicense" className="font-semibold">
                                    Ảnh giấy phép kinh doanh
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    {files.businessLicense ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="text-sm text-gray-700">
                                                    {files.businessLicense.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('businessLicense')}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    Nhấp để chọn ảnh
                                                </span>
                                            </div>
                                            <input
                                                id="businessLicense"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange('businessLicense', e.target.files?.[0] || null)
                                                }
                                                disabled={isLoading}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <Card className="bg-amber-50 border-amber-200">
                                <CardContent className="p-4">
                                    <p className="text-sm text-amber-700">
                                        <strong>Lưu ý:</strong> Tất cả ảnh đều tuỳ chọn. Bạn có thể
                                        bỏ qua và cập nhật sau.
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Step 3: Main Plan */}
                    {currentStep === 3 && (
                        <>
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-4">
                                    <p className="text-sm text-green-700">
                                        <strong>Step 3:</strong> Chọn gói dịch vụ chính cho cửa hàng
                                    </p>
                                </CardContent>
                            </Card>

                            {loadingPlans ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {mainPlans.map((plan) => (
                                        <Card
                                            key={plan.id}
                                            className={`cursor-pointer transition-all ${selectedPlanId === plan.id
                                                ? 'border-2 border-blue-600 bg-blue-50'
                                                : 'border border-gray-200 hover:border-blue-300'
                                                }`}
                                            onClick={() => setSelectedPlanId(plan.id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">
                                                            {plan.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {plan.description}
                                                        </p>
                                                        <p className="text-lg font-bold text-blue-600 mt-2">
                                                            {plan.price?.toLocaleString()} ₫
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlanId === plan.id
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : 'border-gray-300'
                                                            }`}
                                                    >
                                                        {selectedPlanId === plan.id && (
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter className="flex gap-2 pt-6">
                    {currentStep > 1 && (
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep((prev) => (prev - 1) as EditStep)}
                            disabled={isLoading}
                        >
                            ← Quay lại
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    {currentStep < 3 && (
                        <Button
                            onClick={
                                currentStep === 1 ? handleStep1Next : handleStep2Next
                            }
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? 'Đang xử lý...' : 'Tiếp theo →'}
                        </Button>
                    )}
                    {currentStep === 3 && (
                        <Button
                            onClick={handleStep3Complete}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? 'Đang hoàn thành...' : '✅ Hoàn thành'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
