'use client';

import { useState, useEffect, useMemo } from 'react';
import { searchStores } from '@/services/api-new';
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchValue, setSearchValue] = useState("");
  const [stores, setStores] = useState<StoreSearchItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalStores, setTotalStores] = useState(0); // Tổng số stores từ backend
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({});

  // Fetch stores khi filters hoặc page thay đổi
  useEffect(() => {
    async function fetchStores() {
      setLoading(true);
      try {
        // Call API với filters (page - 1 vì API dùng 0-indexed)
        const apiStores = await searchStores(selectedFilters, currentPage - 1, itemsPerPage);
        setStores(apiStores);
        // TODO: Backend should return total count, for now use length
        // Nếu trả về ít hơn itemsPerPage => đây là trang cuối
        if (apiStores.length < itemsPerPage) {
          setTotalStores((currentPage - 1) * itemsPerPage + apiStores.length);
        } else {
          // Giả định còn nhiều stores hơn
          setTotalStores(currentPage * itemsPerPage + 1);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStores([]);
        setTotalStores(0);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, [selectedFilters, currentPage, itemsPerPage]);

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
          <p className="text-gray-600 text-lg">Đang tải cửa hàng...</p>
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
              { label: 'Danh sách cửa hàng', isActive: true }
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
        />

        {/* Content Display */}
        <StoresContent
          stores={paginatedStores}
          viewMode={viewMode}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <StoresPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredStores.length}
          />
        )}
      </div>
    </div>
  );
}
