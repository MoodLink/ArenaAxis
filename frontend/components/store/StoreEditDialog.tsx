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

type EditStep = 2;

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
    const [currentStep, setCurrentStep] = useState<EditStep>(2);
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
        medias?: File[];
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
            // Always start with step 2 (image upload only)
            setCurrentStep(2);
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

    const handleFileChange = (field: 'avatar' | 'coverImage' | 'businessLicense' | 'medias', file: File | null | FileList) => {
        if (field === 'medias' && file instanceof FileList) {
            setFiles((prev) => ({
                ...prev,
                medias: [...(prev.medias || []), ...Array.from(file)],
            }));
        } else if (file && !(file instanceof FileList)) {
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

    const removeMediaFile = (index: number) => {
        setFiles((prev) => ({
            ...prev,
            medias: prev.medias?.filter((_, i) => i !== index) || [],
        }));
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
            console.log('Form data validated (Backend update pending):', formData);
            console.log('Backend chưa implement PUT /stores/{storeId}');

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
            if (store?.id && (files.avatar || files.coverImage || files.businessLicense || files.medias?.length)) {
                console.log('🖼️ Starting image upload for store:', store.id);
                console.log('📦 Files to upload:', {
                    hasAvatar: !!files.avatar,
                    hasCoverImage: !!files.coverImage,
                    hasBusinessLicense: !!files.businessLicense,
                    mediasCount: files.medias?.length || 0,
                });

                const uploadResult = await updateStoreImages(store.id, {
                    avatar: files.avatar,
                    coverImage: files.coverImage,
                    businessLicenseImage: files.businessLicense,
                    medias: files.medias,
                });

                console.log('✅ Upload result:', uploadResult);

                if (!uploadResult.success) {
                    setError(uploadResult.message);
                    setIsLoading(false);
                    return;
                }

                console.log(' Upload request sent successfully!');
                console.log('⏳ Backend is processing images asynchronously...');
            } else {
                console.log(' No images selected - skipping upload');
            }

            // Close dialog and show success
            if (onSave) {
                onSave({});
            }
            onClose();
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
                    ` Registering plan: ${selectedPlanData?.name} for store: ${store.id}`
                );

                const planResult = await purchaseMainPlan(store.id, selectedPlanId);

                if (!planResult.success) {
                    setError(planResult.message);
                    setIsLoading(false);
                    return;
                }

                console.log(' Main plan registered successfully!');
                console.log('Plan Details:', planResult.data);
            }

            if (onSave) {
                onSave(formData);
            }

            console.log(' All steps completed!');
            console.log('Form data saved to state:', formData);
            console.log('Waiting for backend to implement PUT /stores/{storeId}');
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
                    <DialogTitle>Cập nhật ảnh Trung tâm thể thao</DialogTitle>
                    <DialogDescription>
                        Tải lên ảnh đại diện, ảnh bìa, giấy phép kinh doanh và các ảnh khác
                    </DialogDescription>
                </DialogHeader>

                {/* No progress indicator needed - single step only */}

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
                    {/* Step 1: Basic Info - HIDDEN (only step 2 is available) */}

                    {/* Step 2: Images */}
                    {currentStep === 2 && (
                        <>
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-4">
                                    <p className="text-sm text-blue-700">
                                        <strong>Step 2:</strong> Cập nhật các ảnh của Trung tâm thể thao (tuỳ chọn)
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Avatar */}
                            <div className="space-y-2">
                                <Label htmlFor="avatar" className="font-semibold">
                                    Ảnh đại diện Trung tâm thể thao
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
                                    Ảnh bìa Trung tâm thể thao
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

                            {/* Medias - Ảnh thêm */}
                            <div className="space-y-2">
                                <Label htmlFor="medias" className="font-semibold">
                                    Ảnh thêm của Trung tâm
                                </Label>
                                <div className="space-y-3">
                                    {files.medias && files.medias.length > 0 && (
                                        <div className="space-y-2">
                                            {files.medias.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <span className="text-sm text-gray-700 block truncate">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {(file.size / 1024).toFixed(1)} KB
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMediaFile(index)}
                                                        disabled={isLoading}
                                                        className="text-red-600 hover:text-red-800 flex-shrink-0 ml-2"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <label className="cursor-pointer block">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    Nhấp để chọn ảnh thêm
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Có thể chọn một hoặc nhiều ảnh
                                                </span>
                                            </div>
                                            <input
                                                id="medias"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) =>
                                                    handleFileChange('medias', e.target.files)
                                                }
                                                disabled={isLoading}
                                                className="hidden"
                                            />
                                        </div>
                                    </label>
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
                </div>

                <DialogFooter className="flex gap-2 pt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleStep2Next}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isLoading ? 'Đang tải lên...' : '💾 Lưu ảnh'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
