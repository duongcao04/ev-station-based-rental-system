import React from 'react';
import { Check, DollarSign, Tag, Layers } from 'lucide-react';
import type { TFilterState } from './FilterBarView';
import type { TBrand } from '../../../lib/types/brand.type';
import type { TCategory } from '../../../lib/types/category.type';

interface FilterBarProps {
  filters: TFilterState;
  onFilterChange: (newFilters: React.SetStateAction<TFilterState>) => void;
  onReset: () => void;
  brands: TBrand[] | undefined;
  categories: TCategory[] | undefined;
  isLoadingMeta: boolean;
}

export const FilterBar = ({
  filters,
  onFilterChange,
  onReset,
  brands = [],
  categories = [],
  isLoadingMeta,
}: FilterBarProps) => {
  const handleBrandChange = (brandId: string) => {
    onFilterChange((prev) => {
      const isSelected = prev.brands.includes(brandId);
      const newBrands = isSelected
        ? prev.brands.filter((id) => id !== brandId)
        : [...prev.brands, brandId];
      return { ...prev, brands: newBrands };
    });
  };

  const handleCategoryChange = (catId: string) => {
    onFilterChange((prev) => {
      const isSelected = prev.categories.includes(catId);
      const newCats = isSelected
        ? prev.categories.filter((id) => id !== catId)
        : [...prev.categories, catId];
      return { ...prev, categories: newCats };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [name]: Number(value) || 0,
      },
    }));
  };

  return (
    <div className='p-5 space-y-8'>
      <h3 className='text-xl font-bold border-b pb-2'>Bộ lọc tìm kiếm</h3>

      {/* --- Price --- */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2 font-semibold text-primary'>
          <DollarSign size={18} /> Khoảng giá
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <input
            type='number'
            name='min'
            value={filters.priceRange.min}
            onChange={handlePriceChange}
            className='w-full p-2 border rounded-md text-sm'
            placeholder='Min'
          />
          <input
            type='number'
            name='max'
            value={filters.priceRange.max}
            onChange={handlePriceChange}
            className='w-full p-2 border rounded-md text-sm'
            placeholder='Max'
          />
        </div>
      </div>

      {/* --- Brands --- */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2 font-semibold text-primary'>
          <Tag size={18} /> Thương hiệu
        </div>
        {isLoadingMeta ? (
          <div className='text-xs text-gray-500'>Đang tải...</div>
        ) : (
          <div className='space-y-2 max-h-[200px] overflow-y-auto pr-1'>
            {brands.map((brand) => (
              <label
                key={brand.id}
                className='flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded'
              >
                <div
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    filters.brands.includes(brand.id)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {filters.brands.includes(brand.id) && (
                    <Check size={12} className='text-white' />
                  )}
                </div>
                <input
                  type='checkbox'
                  className='hidden'
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                />
                <span className='text-sm'>{brand.displayName}</span>
              </label>
            ))}
            {brands.length === 0 && (
              <p className='text-xs text-gray-400'>Không có dữ liệu</p>
            )}
          </div>
        )}
      </div>

      {/* --- Categories --- */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2 font-semibold text-primary'>
          <Layers size={18} /> Loại xe
        </div>
        {isLoadingMeta ? (
          <div className='text-xs text-gray-500'>Đang tải...</div>
        ) : (
          <div className='space-y-2'>
            {categories.map((cat) => (
              <label
                key={cat.id}
                className='flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded'
              >
                <div
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    filters.categories.includes(cat.id)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {filters.categories.includes(cat.id) && (
                    <Check size={12} className='text-white' />
                  )}
                </div>
                <input
                  type='checkbox'
                  className='hidden'
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => handleCategoryChange(cat.id)}
                />
                <span className='text-sm'>{cat.displayName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className='w-full py-2 text-sm text-red-500 border border-red-200 rounded hover:bg-red-50 transition'
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};
