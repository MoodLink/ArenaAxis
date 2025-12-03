'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStores, searchStores } from '@/services/api-new';
import type { StoreSearchItemResponse } from '@/types';
import { Loader2 } from 'lucide-react';

// Import các components giống fields
import StoresHeader from '@/components/store/StoresHeader';
import StoresBreadcrumb from '@/components/store/StoresBreadcrumb';
import StoresStats from '@/components/store/StoresStats';
import StoresSearchSection from '@/components/store/StoresSearchSection';
import StoresContent from '@/components/store/StoresContent';
import StoresPagination from '@/components/store/StoresPagination';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { SearchFilters } from '@/components/store/SearchStoreForm';

export default function ListStorePage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({});
  // Debounced filters - used for actual API calls
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>({});

  // Khởi tạo filter từ URL query params
  useEffect(() => {
    const sportId = searchParams.get('sportId');
    const provinceId = searchParams.get('provinceId');
    const wardId = searchParams.get('wardId');
    const name = searchParams.get('name');

    if (sportId || provinceId || wardId || name) {
      setSelectedFilters({
        sportId: sportId || undefined,
        provinceId: provinceId || undefined,
        wardId: wardId || undefined,
        name: name || undefined,
      });
      console.log('📌 Filters from URL:', { sportId, provinceId, wardId, name });
    }
  }, [searchParams]);

  // Debounce filters changes - 800ms để tránh gọi API quá nhiều lần
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(selectedFilters);
      setCurrentPage(1); // Reset về trang 1 khi filters thay đổi
    }, 800); // Tăng debounce lên 800ms

    return () => clearTimeout(timer);
  }, [selectedFilters]);

  // Kiểm tra xem có filter nào hay không
  const hasFilters = Object.keys(debouncedFilters).length > 0 &&
    Object.values(debouncedFilters).some(value =>
      value !== undefined && value !== '' &&
      (typeof value !== 'object' || Object.keys(value).length > 0)
    );

  // Sử dụng React Query để fetch stores - tự động cache & revalidate
  // Sử dụng debouncedFilters thay vì selectedFilters để tránh gọi API quá nhiều lần
  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['stores', debouncedFilters, currentPage],
    queryFn: async () => {
      let apiStores: StoreSearchItemResponse[];

      if (hasFilters) {
        apiStores = await searchStores(debouncedFilters, currentPage - 1, itemsPerPage);
        console.log('🔍 Using searchStores (has filters)');
      } else {
        apiStores = await getStores(currentPage - 1, itemsPerPage);
        console.log('📦 Using getStores (no filters)');
      }

      return apiStores;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
    gcTime: 10 * 60 * 1000,
    // Optimistic UI: không refetch khi window focus, user not needed to wait
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Không show loading saat paginate khi dữ liệu đã cached
    placeholderData: (previousData) => previousData,
  });

  // Fetch tất cả pages để lấy total count - ONLY khi cần (pagination)
  const { data: totalStores = 0 } = useQuery({
    queryKey: ['storesTotalCount', debouncedFilters],
    queryFn: async () => {
      // Lấy page đầu tiên để tính total
      let pageStores: StoreSearchItemResponse[];
      if (hasFilters) {
        pageStores = await searchStores(debouncedFilters, 0, itemsPerPage);
      } else {
        pageStores = await getStores(0, itemsPerPage);
      }

      // Nếu page đầu có < 12 items, đó chính là total
      if (pageStores.length < itemsPerPage) {
        return pageStores.length;
      }

      // Nếu page đầu đầy, fetch thêm pages để tính total
      // Giới hạn chỉ fetch tối đa 5 pages để tránh quá chậm
      let total = pageStores.length;
      for (let i = 1; i < 5; i++) {
        let nextPageStores: StoreSearchItemResponse[];
        if (hasFilters) {
          nextPageStores = await searchStores(debouncedFilters, i, itemsPerPage);
        } else {
          nextPageStores = await getStores(i, itemsPerPage);
        }

        if (nextPageStores.length === 0) break;
        total += nextPageStores.length;

        if (nextPageStores.length < itemsPerPage) break;
      }

      console.log(`📊 Total stores: ${total}`);
      return total;
    },
    staleTime: 10 * 60 * 1000, // Cache 10 minutes
  });

  // Filter stores theo search value (client-side) - CHỈ filter stores của page hiện tại
  const filteredStores = useMemo(() => {
    if (!searchValue.trim()) return stores;

    return stores.filter(store => {
      const searchLower = searchValue.toLowerCase();
      return (
        store.name.toLowerCase().includes(searchLower) ||
        (store.ward?.name.toLowerCase().includes(searchLower)) ||
        (store.province?.name.toLowerCase().includes(searchLower))
      );
    });
  }, [stores, searchValue]);

  // Tính tổng số trang dựa trên total stores
  const totalPages = Math.ceil(totalStores / itemsPerPage);

  // KHÔNG cần slice nữa vì backend đã paginate rồi
  const paginatedStores = filteredStores;

  // Reset về trang 1 khi search hoặc filters thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedFilters]);

  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    setSelectedFilters(filters);
    // Không cần reset currentPage ở đây - sẽ được reset trong debounce effect
  }, []);

  // Optimistic UI: Hiển thị dữ liệu ngay, không có loading overlay
  // Chỉ show loading nếu không có dữ liệu trước đó
  const showLoadingOverlay = isLoading && stores.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Loading overlay chỉ hiển thị lần đầu, không lần sau */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Đang tải Trung tâm thể thao...</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8">
        <div className="mb-6">
          <BreadcrumbNav
            items={[
              { label: 'Danh sách Trung tâm thể thao', isActive: true }
            ]}
          />
        </div>
      </div>

      {/* Header */}
      {/* <StoresHeader totalStores={stores.length} /> */}

      <div className="container mx-auto px-4 pb-8">
        {/* Stats Overview */}
        {/* <StoresStats stores={stores} /> */}

        {/* Search and Filter Section */}
        <StoresSearchSection
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedFilters={selectedFilters}
          onFiltersChange={handleFiltersChange}
          filteredCount={filteredStores.length}
          totalStores={totalStores}
        />

        {/* Content Display - Optimistic: show data ngay, dù đang loading*/}
        {paginatedStores.length > 0 ? (
          <>
            <StoresContent
              stores={paginatedStores}
              viewMode={viewMode}
              selectedSportId={selectedFilters.sportId}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <StoresPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalStores}
              />
            )}
          </>
        ) : !showLoadingOverlay ? (
          // Không có dữ liệu và không loading - show empty state
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy trung tâm thể thao</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
