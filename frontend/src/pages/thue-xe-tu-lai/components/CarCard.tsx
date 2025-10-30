import { Link } from 'react-router-dom';
import type { TCar } from '@/lib/types/car.type';
import { currencyFormatter } from '../../../lib/number';

type Props = {
  data: TCar;
};
export default function CarCard({ data }: Props) {
  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-fit'>
      <img
        src={data.thumbnailUrl}
        alt={data.displayName}
        className='w-full h-48 object-cover'
      />
      <div className='p-6'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-xl font-semibold text-gray-900'>
            {data.displayName}
          </h3>
          <span className='text-sm text-gray-500'>
            {data.brand?.displayName}
          </span>
        </div>
        <p className='text-gray-600 mb-4'>Tầm hoạt động: {data.depositPrice}</p>
        <div className='flex flex-wrap gap-2 mb-4'>
          {/* {data.features.map((feature, index) => (
            <span
              key={index}
              className='px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'
            >
              {feature}
            </span>
          ))} */}
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-2xl font-bold text-green-600'>
            {currencyFormatter(data.regularPrice, 'Vietnamese')}{' '}
            <span className='text-sm font-bold !text-foreground'>/ ngày</span>
          </span>
          <Link
            to={`/dat-xe/${data.id}`}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
          >
            Thuê ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
