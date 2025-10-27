import { Button } from '@/components/ui/button';
import type { TCar } from '@/lib/types/car.type';
import { Image } from 'antd';
import { Heart } from 'lucide-react';

interface CarRentalCardProps {
  data: TCar;
  onFavoriteClick?: () => void;
  onRentClick?: () => void;
}

export function CarRentalCard({
  data,
  onFavoriteClick,
  onRentClick,
}: CarRentalCardProps) {
  return (
    <div className='w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      {/* Header with title and favorite button */}
      <div className='p-6 pb-4 flex justify-between items-start'>
        <div>
          <h3 className='text-xl font-bold text-gray-900'>
            {data.displayName}
          </h3>
          <p className='text-sm text-gray-400 mt-1'>
            {data?.categories?.[0]?.displayName}
          </p>
        </div>
        <button
          onClick={onFavoriteClick}
          className='text-red-500 hover:scale-110 transition-transform'
          aria-label='Add to favorites'
        >
          <Heart
            size={24}
            fill={true ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Car image */}
      <div className='px-6 py-4 bg-gray-50 flex items-center justify-center min-h-48'>
        <Image
          src={data.thumbnailUrl || '/placeholder.svg'}
          alt={data.displayName}
          width={300}
          height={200}
          className='object-contain'
          preview={false}
        />
      </div>

      {/* Specs */}
      {/* <div className='px-6 py-4 flex gap-6 text-sm text-gray-500 border-t border-gray-100'>
        <div className='flex items-center gap-2'>
          <Fuel size={18} className='text-gray-400' />
          <span>{fuel}L</span>
        </div>
        <div className='flex items-center gap-2'>
          <Zap size={18} className='text-gray-400' />
          <span>{transmission}</span>
        </div>
        <div className='flex items-center gap-2'>
          <Users size={18} className='text-gray-400' />
          <span>{capacity} People</span>
        </div>
      </div> */}

      {/* Footer with price and button */}
      <div className='px-6 py-4 flex justify-between items-center border-t border-gray-100'>
        <div>
          <p className='text-2xl font-bold text-gray-900'>
            ${data.regularPrice.toFixed(2)}
            <span className='text-sm font-normal text-gray-500'>/day</span>
          </p>
        </div>
        <Button
          onClick={onRentClick}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium'
        >
          Rent Now
        </Button>
      </div>
    </div>
  );
}
