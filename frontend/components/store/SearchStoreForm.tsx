'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, DollarSign, X } from 'lucide-react';
import { useProvinces, useWards, useSportsOptions } from '@/hooks/use-search-options';
import type { ProvinceResponse, WardResponse, Sport } from '@/types';

interface SearchStoreFormProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  name?: string;
  wardId?: string;
  provinceId?: string;
  sportId?: string;
  price?: {
    min?: number;
    max?: number;
  };
}

export function SearchStoreForm({ onSearch, initialFilters }: SearchStoreFormProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const [isExpanded] = useState(true); // Luôn hiển thị, không cần toggle

  // Sử dụng React Query hooks - tự động cache, không fetch lại
  const { data: provinces = [] } = useProvinces();
  const { data: wards = [] } = useWards(filters.provinceId);
  const { data: sports = [] } = useSportsOptions();

  // Debounce cho input tên sân (800ms) - CHỈ khi name thay đổi
  // Aligned với list-store/page.tsx debounce time (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 800);

    return () => clearTimeout(timer);
  }, [filters.name, onSearch]); // Trigger ONLY khi name thay đổi

  // Gọi onSearch NGAY lập tức cho select dropdowns (provinceId, wardId, sportId)
  // Vì người dùng chỉ thay đổi 1 lần, không cần debounce
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Gọi onSearch ngay cho select (provinceId, wardId, sportId)
    if (key !== 'name') {
      onSearch(newFilters);
    }
  }, [filters, onSearch]);

  useEffect(() => {
    if (!filters.provinceId) {
      // Reset ward khi xóa province
      setFilters(prev => ({ ...prev, wardId: undefined }));
    }
  }, [filters.provinceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Không cần làm gì
  };

  const handleReset = useCallback(() => {
    setFilters({});
    onSearch({}); // Gọi ngay khi xóa bộ lọc
  }, [onSearch]);

  return (
    <Card className="shadow-lg border-2">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sân..."
                value={filters.name || ''}
                onChange={(e) => updateFilter('name', e.target.value)}
                className="h-12 text-base"
              />
            </div>

          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              {/* Province */}
              <div>
                <Label htmlFor="province" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Tỉnh/Thành phố
                </Label>
                <select
                  id="province"
                  value={filters.provinceId || ''}
                  onChange={(e) => updateFilter('provinceId', e.target.value || undefined)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Tất cả tỉnh/thành</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div>
                <Label htmlFor="ward" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Quận/Huyện
                </Label>
                <select
                  id="ward"
                  value={filters.wardId || ''}
                  onChange={(e) => updateFilter('wardId', e.target.value || undefined)}
                  disabled={!filters.provinceId}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm disabled:opacity-50"
                >
                  <option value="">Tất cả quận/huyện</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sport */}
              <div>
                <Label htmlFor="sport" className="mb-2 block">
                  Môn thể thao
                </Label>
                <select
                  id="sport"
                  value={filters.sportId || ''}
                  onChange={(e) => updateFilter('sportId', e.target.value || undefined)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Tất cả môn</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>



              {/* Reset Button */}
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
