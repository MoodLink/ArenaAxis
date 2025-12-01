'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const [stores, setStores] = useState<StoreSearchItemResponse[]>([]);
  const [loading, setLoading] = useState(false); // Chỉ true lần đầu tiên (nếu cần)
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag để detect lần đầu
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalStores, setTotalStores] = useState(0); // Tổng số stores từ backend
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({});

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

  // Fetch stores khi filters hoặc page thay đổi
  useEffect(() => {
    async function fetchStores() {
      // Chỉ show loading spinner lần đầu tiên
      if (isInitialLoad) {
        setLoading(true);
      }

      try {
        let apiStores: StoreSearchItemResponse[];

        // Kiểm tra xem có filter nào hay không
        const hasFilters = Object.keys(selectedFilters).length > 0 &&
          Object.values(selectedFilters).some(value =>
            value !== undefined && value !== '' &&
            (typeof value !== 'object' || Object.keys(value).length > 0)
          );

        if (hasFilters) {
          // Có filter → dùng searchStores (POST /stores/search)
          apiStores = await searchStores(selectedFilters, currentPage - 1, itemsPerPage);
          console.log('📍 Using searchStores (has filters)');
        } else {
          // Không có filter → dùng getStores (GET /stores)
          apiStores = await getStores(currentPage - 1, itemsPerPage);
          console.log('📍 Using getStores (no filters)');
        }

        setStores(apiStores);

        // Tính tổng số stores bằng cách fetch tất cả các trang
        const calculateTotalStores = async () => {
          let total = 0;
          let pageNum = 0;
          let hasMore = true;

          while (hasMore) {
            let pageStores: StoreSearchItemResponse[] = [];
            try {
              if (hasFilters) {
                pageStores = await searchStores(selectedFilters, pageNum, itemsPerPage);
              } else {
                pageStores = await getStores(pageNum, itemsPerPage);
              }

              if (pageStores.length === 0) {
                hasMore = false;
              } else {
                total += pageStores.length;
                pageNum++;
              }
            } catch (error) {
              hasMore = false;
            }
          }

          return total;
        };

        const total = await calculateTotalStores();
        setTotalStores(total);
        console.log(`📊 Total stores: ${total}`);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStores([]);
        setTotalStores(0);
      } finally {
        setLoading(false);
        setIsInitialLoad(false); // Sau lần đầu, không show loading nữa
      }
    }

    fetchStores();
  }, [selectedFilters, currentPage, itemsPerPage, isInitialLoad]);

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

  const handleFiltersChange = (filters: SearchFilters) => {
    setSelectedFilters(filters);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải Trung tâm thể thao...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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

        {/* Content Display */}
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
      </div>
    </div>
  );
}
