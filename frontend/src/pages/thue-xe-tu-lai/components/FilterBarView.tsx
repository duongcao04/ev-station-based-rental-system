import React from 'react';
import { FilterBar } from './FilterBar';
import { useBrands } from '../../../lib/queries/useBrand';
import { useCategories } from '../../../lib/queries/useCategory';

export type TFilterState = {
  brands: string[];
  categories: string[];
  priceRange: {
    min: number;
    max: number; // 0 nghĩa là không giới hạn
  };
};

interface FilterBarViewProps {
  filters: TFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TFilterState>>;
  onReset: () => void;
}

const FilterBarView = ({
  filters,
  setFilters,
  onReset,
}: FilterBarViewProps) => {
  // Container chịu trách nhiệm lấy dữ liệu phụ trợ (Meta data)
  const { data: brands, isLoading: loadingBrands } = useBrands();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const isLoadingMeta = loadingBrands || loadingCategories;

  return (
    <FilterBar
      filters={filters}
      onFilterChange={setFilters}
      onReset={onReset}
      brands={brands}
      categories={categories}
      isLoadingMeta={isLoadingMeta}
    />
  );
};

export default FilterBarView;
