import CarList from './components/CarList';
import FilterBar from './components/FilterBar';
import LocationBar from './components/LocationBar';

const data = [
  {
    id: 'car_12345',
    displayName: 'Toyota Camry 2024', // <--- Added this field
    depositPrice: 50000000,
    regularPrice: 1100000000,
    salePrice: 1050000000,
    categories: [
      {
        id: 'cat_001',
        displayName: 'Sedan',
        description: 'A passenger car in a three-box configuration...',
        thumbnailUrl: 'https://www.svgrepo.com/show/521829/sedan.svg',
      },
      {
        id: 'cat_002',
        displayName: 'Family Car',
        description: 'Vehicles suitable for families...',
        thumbnailUrl: 'https://www.svgrepo.com/show/493847/car-family.svg',
      },
    ],
    brand: {
      id: 'brand_001',
      displayName: 'Toyota',
      description:
        'Toyota Motor Corporation is a Japanese multinational automotive manufacturer...',
      thumbnailUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/2560px-Toyota_carlogo.svg.png',
    },
    inStock: true,
    specifications: [
      {
        id: 'car_spec_001',
        label: {
          id: 'spec_type_001',
          label: 'Engine',
          icon: 'engine-icon.svg',
        },
        value: '2.5L Dynamic Force 4-Cylinder',
      },
      {
        id: 'car_spec_002',
        label: {
          id: 'spec_type_002',
          label: 'Transmission',
          icon: 'gearbox-icon.svg',
        },
        value: '8-speed Automatic',
      },
      {
        id: 'car_spec_003',
        label: {
          id: 'spec_type_003',
          label: 'Color',
          icon: 'color-palette-icon.svg',
        },
        value: 'Celestial Silver Metallic',
      },
      {
        id: 'car_spec_004',
        label: {
          id: 'spec_type_004',
          label: 'Mileage',
          icon: 'odometer-icon.svg',
        },
        value: '8.7 L/100km (Combined)',
      },
    ],
    description:
      'The 2024 Toyota Camry offers a compelling blend of comfort, reliability, and style. This mid-size sedan is perfect for families or commuters seeking a dependable and efficient vehicle.',
    uom: {
      id: 'uom_001',
      displayName: 'Chiếc',
      description: 'Unit of measurement for a single car.',
    },
    thumbnailUrl:
      'https://media.ed.edmunds-media.com/toyota/camry/2024/oem/2024_toyota_camry_sedan_trd_fq_oem_1_1600.jpg',
    featuredImageUrls: [
      'https://media.ed.edmunds-media.com/toyota/camry/2024/oem/2024_toyota_camry_sedan_trd_rq_oem_1_1600.jpg',
      'https://media.ed.edmunds-media.com/toyota/camry/2024/oem/2024_toyota_camry_sedan_trd_fint_oem_1_1600.jpg',
      'https://media.ed.edmunds-media.com/toyota/camry/2024/oem/2024_toyota_camry_sedan_trd_sint_oem_1_1600.jpg',
    ],
  },
];

export default function ThueXeTuLaiPage() {
  return (
    <div className='bg-background max-w-[1440px] mx-auto'>
      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-3'>
          <FilterBar />
        </div>
        <div className='col-span-9 p-8 space-y-9'>
          <LocationBar />
          <CarList data={data} />
        </div>
      </div>
    </div>
  );
}
