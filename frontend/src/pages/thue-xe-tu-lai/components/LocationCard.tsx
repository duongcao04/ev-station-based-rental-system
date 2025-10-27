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
      className='rounded-lg p-6 bg-background'
      style={{
        boxShadow:
          'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
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
