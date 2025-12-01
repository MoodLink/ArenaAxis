'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoresByOwnerId } from '@/services/api-new';
import { getMyProfile } from '@/services/get-my-profile';
import { Loader2 } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';

export default function StoreDetailPage() {
    const router = useRouter();

    useEffect(() => {
        const redirectToFirstStore = async () => {
            try {
                // Lấy thông tin user hiện tại
                const currentUser = getMyProfile();
                if (!currentUser?.id) {
                    router.push('/login');
                    return;
                }

                // Lấy danh sách Trung tâm thể thao
                const stores = await getStoresByOwnerId(currentUser.id);

                if (stores && stores.length > 0) {
                    // Redirect tới chi tiết Trung tâm thể thao đầu tiên
                    router.push(`/store/detail/${stores[0].id}`);
                } else {
                    // Nếu không có Trung tâm thể thao, redirect tới trang store
                    router.push('/store');
                }
            } catch (error) {
                console.error('Error redirecting:', error);
                router.push('/store');
            }
        };

        redirectToFirstStore();
    }, [router]);

    return (
        <StoreLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Đang tải thông tin Trung tâm thể thao...</p>
                </div>
            </div>
        </StoreLayout>
    );
}
