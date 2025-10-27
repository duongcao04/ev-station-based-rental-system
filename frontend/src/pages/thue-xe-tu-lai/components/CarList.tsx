import { CarRentalCard } from '@/components/cards/CarCard';
import type { TCar } from '@/lib/types/car.type';

type Props = {
  data: TCar[];
};

export default function CarList({ data }: Props) {
  return (
    <div className='size-full grid grid-cols-3 gap-8'>
      {data
        .concat(data)
        .concat(data)
        .concat(data)
        .concat(data)
        .concat(data)
        .concat(data)
        .concat(data)
        .map((car) => {
          return <CarRentalCard key={car.id} data={car} />;
        })}
    </div>
  );
}
