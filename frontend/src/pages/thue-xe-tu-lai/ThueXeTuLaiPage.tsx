import { useState } from 'react';
import { useVehicles } from '@/lib/queries/useVehicles';
import { ArrowUpDown } from 'lucide-react';

// Hooks & Components
import LocationCard from './components/LocationCard';
import CarCard from './components/CarCard';
import { useDebounce } from '../../hooks/useDebounces';
import type { TFilterState } from './components/FilterBarView';
import FilterBarView from './components/FilterBarView';

export default function ThueXeTuLaiPage() {
  // 1. State Filter Local (User thao tác trên này)
  const [filters, setFilters] = useState<TFilterState>({
    brands: [],
    categories: [],
    priceRange: { min: 0, max: 0 },
  });

  // 2. Debounce Filter (Delay 500ms để chờ user chọn xong mới gọi API)
  const debouncedFilters = useDebounce(filters, 500);

  // 3. Gọi API với filter đã debounce
  // Lúc này `filteredVehicles` chính là data trả về từ Server
  const { data: filteredVehicles, isLoading } = useVehicles(debouncedFilters);

  const resetFilters = () => {
    setFilters({ brands: [], categories: [], priceRange: { min: 0, max: 0 } });
  };

  return (
    <div className='mt-20 max-w-[1440px] mx-auto pb-20 px-4'>
      <div className='grid grid-cols-12 gap-8'>
        {/* Sidebar */}
        <div className='col-span-3 bg-background rounded-lg h-fit sticky top-[100px] border border-gray-100 shadow-sm'>
          <FilterBarView
            filters={filters} // Truyền state thực để UI phản hồi ngay lập tức
            setFilters={setFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Content */}
        <div className='w-full col-span-9 space-y-9'>
          {/* ... Location Card UI ... */}
          <div className='relative w-full h-[150px] rounded-lg grid grid-cols-2 gap-8'>
            {/* (Code Location giữ nguyên) */}
            <LocationCard title={'Điểm thuê'} />
            <div className='absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]'>
              <button className='cursor-pointer shadow-md rounded-lg'>
                <div className='size-14 rounded-lg bg-primary text-white flex items-center justify-center'>
                  <ArrowUpDown size={24} />
                </div>
              </button>
            </div>
            <LocationCard title={'Điểm trả'} />
          </div>

          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-bold'>
              {/* Kiểm tra length an toàn */}
              Danh sách xe ({filteredVehicles?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className='py-20 text-center'>Đang tải dữ liệu...</div>
          ) : (
            <div className='w-full h-fit grid grid-cols-3 gap-8'>
              {/* Render danh sách xe */}
              {filteredVehicles?.map((car) => (
                <CarCard key={car.id} data={car} />
              ))}

              {/* Empty State */}
              {(!filteredVehicles || filteredVehicles.length === 0) && (
                <div className='col-span-3 py-16 flex flex-col items-center justify-center border border-dashed rounded-lg bg-gray-50'>
                  <p className='text-gray-500 mb-4'>
                    Không tìm thấy xe nào phù hợp.
                  </p>
                  <button
                    onClick={resetFilters}
                    className='text-primary font-medium hover:underline'
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
