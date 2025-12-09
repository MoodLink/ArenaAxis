// Component search section với view mode toggle
'use client';

import { Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchStoreForm, SearchFilters } from './SearchStoreForm';

interface StoresSearchSectionProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedFilters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  filteredCount: number;
  totalStores: number; // Tổng số stores
}

export default function StoresSearchSection({
  viewMode,
  onViewModeChange,
  selectedFilters,
  onFiltersChange,
  filteredCount,
  totalStores
}: StoresSearchSectionProps) {
  return (
    <div className="mb-6">
      {/* Search Form with Filters */}
      <SearchStoreForm
        onSearch={(filters) => {
          onFiltersChange(filters);
        }}
        initialFilters={selectedFilters}
      />

      {/* Results Count */}
      <div className="mt-3 text-sm text-gray-600">
        <span className="font-semibold text-primary">{filteredCount}</span> Trung tâm thể thao (Tổng: <span className="font-semibold text-primary">{totalStores}</span>)
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 mt-4">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewModeChange("grid")}
          className="px-4"
        >
          <Grid3x3 className="w-5 h-5" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewModeChange("list")}
          className="px-4"
        >
          <List className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
