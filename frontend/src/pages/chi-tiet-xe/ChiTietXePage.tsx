import { Button } from '@/components/ui/button';
import { Image } from 'antd';
import { ChevronLeft, ChevronRight, Gauge, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { useVehicleDetail } from '../../lib/queries/useVehicles';

export default function ChiTietXePage() {
  const { slug } = useParams();
  const { data, isLoading } = useVehicleDetail(slug);

  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === data?.featuredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? data?.featuredImages.length - 1 : prev - 1
    );
  };

  const discount = (
    ((Number.parseFloat(data?.regularPrice) -
      Number.parseFloat(data?.salePrice || '0')) /
      Number.parseFloat(data?.regularPrice)) *
    100
  ).toFixed(0);

  const datXeUrl = `/dat-xe/${data?.id}`;

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            <div className='relative bg-card rounded-lg overflow-hidden aspect-video'>
              <Image
                src={
                  data?.featuredImages[currentImageIndex].url ||
                  '/placeholder.svg'
                }
                alt={`${data?.displayName} view ${currentImageIndex + 1}`}
                className='object-cover'
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition'
                aria-label='Previous image'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition'
                aria-label='Next image'
              >
                <ChevronRight className='w-6 h-6' />
              </button>

              {/* Image Counter */}
              <div className='absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm'>
                {currentImageIndex + 1} / {data?.featuredImages.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className='grid grid-cols-4 gap-2'>
              {data?.featuredImages.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-video rounded overflow-hidden border-2 transition ${
                    currentImageIndex === index
                      ? 'border-primary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <Image
                    src={image.url || '/placeholder.svg'}
                    alt={`Thumbnail ${index + 1}`}
                    className='object-cover'
                    preview={false}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details */}
          <div className='space-y-6'>
            {/* Brand */}
            <div className='flex items-center gap-2'>
              {isLoading ? (
                <Skeleton className='mt-2 w-20 h-6' />
              ) : (
                <p className='text-sm font-semibold text-primary uppercase tracking-wider'>
                  {data?.brand.displayName}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              {isLoading ? (
                <Skeleton className='w-[400px] h-16' />
              ) : (
                <h1 className='text-4xl lg:text-5xl font-bold text-balance mb-2'>
                  {data?.displayName}
                </h1>
              )}

              {isLoading ? (
                <Skeleton className='mt-2 w-[100px] h-6' />
              ) : (
                <p className='text-muted-foreground'>{data?.sku}</p>
              )}
            </div>

            {/* Description */}
            {isLoading ? (
              <div className='space-y-0.5'>
                <Skeleton className='mt-2 w-[610px] h-5' />
                <Skeleton className='mt-2 w-[610px] h-5' />
              </div>
            ) : (
              <p className='text-foreground/90 leading-relaxed'>
                {data?.description}
              </p>
            )}

            {/* Pricing */}
            <div className='bg-card border border-border rounded-lg p-6 space-y-3'>
              {isLoading ? (
                <Skeleton className='mt-2 w-[270px] h-14' />
              ) : (
                <div className='flex items-baseline gap-3'>
                  <div className='text-3xl font-bold text-primary'>
                    $
                    {(
                      Number.parseFloat(data?.salePrice || data?.regularPrice) /
                      1000
                    ).toFixed(0)}
                    k
                  </div>
                  <div className='text-lg text-muted-foreground line-through'>
                    ${(Number.parseFloat(data?.regularPrice) / 1000).toFixed(0)}
                    k
                  </div>
                  {data?.salePrice && (
                    <div className='bg-primary/20 text-primary px-3 py-1 rounded text-sm font-semibold'>
                      Save {discount}%
                    </div>
                  )}
                </div>
              )}

              <p className='text-sm text-muted-foreground'>
                Deposit: ${data?.depositPrice}
              </p>
              <p
                className={`text-sm font-medium ${
                  data?.isInStock ? 'text-green-500' : 'text-destructive'
                }`}
              >
                {data?.isInStock
                  ? `${data?.quantity} in stock`
                  : 'Out of stock'}
              </p>
            </div>

            {/* Quick Specs */}
            <div className='grid grid-cols-3 gap-3'>
              <div className='bg-card border border-border rounded-lg p-4 text-center'>
                <Zap className='w-6 h-6 mx-auto mb-2 text-primary' />
                <div className='text-sm font-semibold'>503 HP</div>
                <div className='text-xs text-muted-foreground'>Power</div>
              </div>
              <div className='bg-card border border-border rounded-lg p-4 text-center'>
                <Gauge className='w-6 h-6 mx-auto mb-2 text-primary' />
                <div className='text-sm font-semibold'>3.8s</div>
                <div className='text-xs text-muted-foreground'>0-100 km/h</div>
              </div>
              <div className='bg-card border border-border rounded-lg p-4 text-center'>
                <Users className='w-6 h-6 mx-auto mb-2 text-primary' />
                <div className='text-sm font-semibold'>5</div>
                <div className='text-xs text-muted-foreground'>Seats</div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className='space-y-3'>
              <Button
                disabled={!data?.isInStock}
                className='w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg transition'
                onClick={() => navigate(datXeUrl)}
              >
                {data?.isInStock ? 'Thuê xe ngay' : 'Xe không khả dụng'}
              </Button>

              <Button
                variant='outline'
                className='w-full border-border hover:bg-muted py-6 text-lg font-semibold bg-transparent'
              >
                Liên hệ
              </Button>
            </div>

            {/* Categories */}
            <div className='flex gap-2 flex-wrap'>
              {data?.categories.map((category: any) => (
                <span
                  key={category.id}
                  className='px-3 py-1 bg-muted/50 text-muted-foreground text-xs font-semibold rounded-full'
                >
                  {category.displayName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Full Specifications */}
        <div className='bg-card border border-border rounded-lg p-8 mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Specifications</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
            {data?.specifications.map((spec: any) => (
              <div key={spec.id} className='border-b border-border pb-4'>
                <div className='text-sm text-muted-foreground mb-1'>
                  {spec.label}
                </div>
                <div className='text-lg font-semibold text-foreground'>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-card border border-border rounded-lg p-6'>
            <h3 className='text-lg font-bold mb-3'>Available Stations</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              {data?.stationIds.map((station: any) => (
                <li key={station} className='flex items-center gap-2'>
                  <span className='w-2 h-2 bg-primary rounded-full'></span>
                  {station === 'station-001' && 'Downtown Showroom'}
                  {station === 'station-002' && 'Airport Branch'}
                </li>
              ))}
            </ul>
          </div>

          <div className='bg-card border border-border rounded-lg p-6'>
            <h3 className='text-lg font-bold mb-3'>Why Choose This Car?</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-primary rounded-full'></span>
                Premium German Engineering
              </li>
              <li className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-primary rounded-full'></span>
                Advanced Safety Features
              </li>
              <li className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-primary rounded-full'></span>
                Exceptional Performance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
