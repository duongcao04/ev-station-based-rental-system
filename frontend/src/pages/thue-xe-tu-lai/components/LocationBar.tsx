import LocationCard from './LocationCard';

type Props = {};
export default function LocationBar({}: Props) {
  return (
    <div className='w-full h-[150px] rounded-lg grid grid-cols-2 gap-[43px]'>
      <LocationCard title={'Điểm đón'} />
      <LocationCard title={'Điểm trả'} />
    </div>
  );
}
