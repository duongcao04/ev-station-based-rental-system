import { ArrowUpDown } from 'lucide-react';
import CarCard from './components/CarCard';
import FilterBar from './components/FilterBar';
import LocationCard from './components/LocationCard';

const vehicles = [
  {
    id: 1,
    name: 'Tesla Model 3',
    type: 'Sedan',
    range: '500km',
    price: '2,500,000đ/ngày',
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=300&fit=crop',
    features: ['Tự lái', 'Sạc nhanh', 'Premium'],
  },
  {
    id: 2,
    name: 'BMW i3',
    type: 'Hatchback',
    range: '300km',
    price: '1,800,000đ/ngày',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
    features: ['Eco-friendly', 'Compact', 'Urban'],
  },
  {
    id: 3,
    name: 'VinFast VF8',
    type: 'SUV',
    range: '450km',
    price: '2,200,000đ/ngày',
    image:
      'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=500&h=300&fit=crop',
    features: ['Spacious', 'Luxury', 'Vietnamese'],
  },
];

export default function ThueXeTuLaiPage() {
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
          <div className='size-full grid grid-cols-3 gap-8'>
            {vehicles.map((car) => {
              return <CarCard key={car.id} data={car} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
