import { Checkbox, Slider } from 'antd';
import type { TCategory } from '../../../lib/types/category.type';

const mock: TCategory[] = [
  {
    id: 'cat_001',
    displayName: 'Sedan',
    description:
      'A passenger car in a three-box configuration with separate compartments for engine, passenger, and cargo.',
    thumbnailUrl: 'https://www.svgrepo.com/show/521829/sedan.svg',
  },
  {
    id: 'cat_002',
    displayName: 'Family Car',
    description: 'Vehicles suitable for families, offering space and safety.',
    thumbnailUrl: 'https://www.svgrepo.com/show/493847/car-family.svg',
  },
];

type Props = {};
export default function FilterBar({}: Props) {
  return (
    <div className='p-8 space-y-5'>
      <div>
        <p className='text-xs font-semibold'>Danh mục</p>
        <div className='mt-3 space-y-2'>
          {mock.map((item) => {
            return (
              <div key={item.id} className='text-base'>
                <Checkbox onChange={() => {}}>
                  <p className='font-semibold'>{item.displayName}</p>
                </Checkbox>
              </div>
            );
          })}
        </div>
      </div>
      <hr />
      <div>
        <p className='text-xs font-semibold'>Giá</p>
        <div className='mt-3 space-y-2'>
          <Slider
            range
            step={10}
            defaultValue={[20, 50]}
            onChange={() => {}}
            onChangeComplete={() => {}}
          />
        </div>
        <p className='font-semibold text-sm'>Cao nhất 200 000 000 VNĐ</p>
      </div>
    </div>
  );
}
