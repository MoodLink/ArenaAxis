'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, DollarSign, X } from 'lucide-react';
import { getProvinces, getWardsByProvinceId, getSports } from '@/services/api-new';
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
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [wards, setWards] = useState<WardResponse[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadProvinces();
    loadSports();
  }, []);

  useEffect(() => {
    if (filters.provinceId) {
      loadWards(filters.provinceId);
    } else {
      setWards([]);
      setFilters(prev => ({ ...prev, wardId: undefined }));
    }
  }, [filters.provinceId]);

  const loadProvinces = async () => {
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const loadWards = async (provinceId: string) => {
    try {
      const data = await getWardsByProvinceId(provinceId);
      setWards(data);
    } catch (error) {
      console.error('Error loading wards:', error);
    }
  };

  const loadSports = async () => {
    try {
      const data = await getSports();
      setSports(data);
    } catch (error) {
      console.error('Error loading sports:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    onSearch({});
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updatePriceFilter = (key: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    setFilters(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [key]: numValue
      }
    }));
  };

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
            <Button type="submit" size="lg" className="px-6">
              <Search className="w-5 h-5 mr-2" />
              Tìm kiếm
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Thu gọn' : 'Lọc thêm'}
            </Button>
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

              {/* Price Min */}
              <div>
                <Label htmlFor="priceMin" className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Giá tối thiểu (VNĐ)
                </Label>
                <Input
                  id="priceMin"
                  type="number"
                  placeholder="0"
                  value={filters.price?.min || ''}
                  onChange={(e) => updatePriceFilter('min', e.target.value)}
                  min="0"
                />
              </div>

              {/* Price Max */}
              <div>
                <Label htmlFor="priceMax" className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Giá tối đa (VNĐ)
                </Label>
                <Input
                  id="priceMax"
                  type="number"
                  placeholder="1000000"
                  value={filters.price?.max || ''}
                  onChange={(e) => updatePriceFilter('max', e.target.value)}
                  min="0"
                />
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
