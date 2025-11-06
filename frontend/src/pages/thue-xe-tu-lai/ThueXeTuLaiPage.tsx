import { useVehicles } from '@/lib/queries/useVehicles';
import { ArrowUpDown } from 'lucide-react';
import FilterBar from './components/FilterBar';
import LocationCard from './components/LocationCard';
import CarCard from './components/CarCard';

export default function ThueXeTuLaiPage() {
  const { data: vehicles } = useVehicles();

  return (
    <div className='mt-20 max-w-[1440px] mx-auto pb-20'>
      <div className='grid grid-cols-12 gap-8'>
        <div
          className='col-span-3 bg-background rounded-lg h-fit sticky top-[100px]'
          style={{
            boxShadow:
              'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
          }}
        >
          <FilterBar />
        </div>
        <div className='w-full col-span-9 space-y-9'>
          <div className='relative w-full h-[150px] rounded-lg grid grid-cols-2 gap-8'>
            <LocationCard title={'Điểm thuê'} />
            <div className='absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]'>
              <button className='cursor-pointer'>
                <div
                  className='size-14 rounded-lg bg-primary text-white flex items-center justify-center'
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                  }}
                >
                  <ArrowUpDown size={24} />
                </div>
              </button>
            </div>
            <LocationCard title={'Điểm trả'} />
          </div>
          <div className='w-full h-fit grid grid-cols-3 gap-8'>
            {vehicles?.map((car) => {
              return <CarCard key={car.id} data={car} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
