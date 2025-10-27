import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  title: string;
};
export default function LocationCard({ title }: Props) {
  return (
    <div
      className='rounded-lg p-6'
      style={{
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
    >
      <div className='flex items-center justify-start gap-3'>
        <span className='relative flex size-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
          <span className='relative inline-flex size-3 rounded-full bg-sky-500'></span>
        </span>
        <p className='text-base font-semibold'>{title}</p>
      </div>
      <div className='mt-4 grid grid-cols-3'>
        <div>
          <p className='text-sm font-bold'>Locations</p>
          <LocationSelection />
        </div>

        <div>
          <p className='text-sm font-bold'>Date</p>
          <LocationSelection />
        </div>

        <div>
          <p className='text-sm font-bold'>Locations</p>
          <LocationSelection />
        </div>
      </div>
    </div>
  );
}

function LocationSelection() {
  return (
    <Select>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Theme' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='light'>Light</SelectItem>
        <SelectItem value='dark'>Dark</SelectItem>
        <SelectItem value='system'>System</SelectItem>
      </SelectContent>
    </Select>
  );
}
