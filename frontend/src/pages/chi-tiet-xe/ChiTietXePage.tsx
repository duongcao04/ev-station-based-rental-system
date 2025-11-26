import { Button } from '@/components/ui/button';
import { Image } from 'antd';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { useVehicleDetail } from '../../lib/queries/useVehicles';

// Định nghĩa Type dựa trên Prisma Include
type TCarDetail = {
  id: string;
  displayName: string;
  sku: string;
  description: string | null;
  regularPrice: string | number;
  salePrice: string | number | null;
  depositPrice: string | number | null;
  isInStock: boolean;
  quantity: number | null;
  thumbnailUrl: string;
  brand: { displayName: string };
  categories: { id: string; displayName: string }[];
  featuredImages: { id: string; url: string }[];
  // Quan trọng: Cấu trúc nested của Specification
  specifications: {
    id: string;
    value: string;
    specificationType: {
      id: string;
      label: string;
      icon: string | null;
    };
  }[];
};

export default function ChiTietXePage() {
  const { slug } = useParams();
  // Ép kiểu data trả về
  const { data, isLoading } = useVehicleDetail(slug) as {
    data: TCarDetail;
    isLoading: boolean;
  };

  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    data?.featuredImages.concat({
      id: 'thumbnailUrl',
      url: data?.thumbnailUrl,
    }) || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Tính toán giảm giá an toàn
  const regularPrice = Number(data?.regularPrice || 0);
  const salePrice = Number(data?.salePrice || 0);
  const displayPrice = salePrice > 0 ? salePrice : regularPrice;

  const discountPercentage =
    regularPrice > 0 && salePrice > 0
      ? (((regularPrice - salePrice) / regularPrice) * 100).toFixed(0)
      : 0;

  const datXeUrl = `/dat-xe/${data?.id}`;

  return (
    <div className='min-h-screen bg-background pb-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb / Back button could go here */}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12'>
          {/* --- LEFT COLUMN: IMAGES --- */}
          <div className='space-y-4'>
            {/* Main Image View */}
            <div className='relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3] border border-border'>
              {isLoading ? (
                <Skeleton className='w-full h-full' />
              ) : (
                <>
                  <Image
                    // Sử dụng mảng images đã gộp
                    src={
                      hasImages
                        ? images[currentImageIndex].url
                        : '/placeholder.svg'
                    }
                    alt={`${data?.displayName} view`}
                    className='object-cover w-full h-full'
                    wrapperClassName='w-full h-full'
                  />

                  {hasImages && images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition backdrop-blur-sm z-10'
                      >
                        <ChevronLeft className='w-6 h-6' />
                      </button>
                      <button
                        onClick={nextImage}
                        className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition backdrop-blur-sm z-10'
                      >
                        <ChevronRight className='w-6 h-6' />
                      </button>
                      <div className='absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md z-10'>
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasImages && images.length > 1 && (
              <div className='flex gap-3 overflow-x-auto pb-2 custom-scrollbar'>
                {images.map((image, index) => (
                  <button
                    key={image.id} // Key id là 'main-thumbnail' hoặc uuid
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-24 aspect-video flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt='thumbnail'
                      rootClassName='object-cover w-full h-full'
                      className='object-cover w-full h-full'
                      preview={false}
                    />
                    {/* Đánh dấu ảnh nào là Thumbnail chính (Optional) */}
                    {image.id === 'main-thumbnail' && (
                      <div className='absolute top-0 left-0 bg-primary/80 text-[8px] text-white px-1'>
                        MAIN
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: INFO --- */}
          <div className='space-y-8'>
            {/* Header Info */}
            <div>
              {isLoading ? (
                <div className='space-y-2'>
                  <Skeleton className='w-20 h-4' />
                  <Skeleton className='w-3/4 h-10' />
                </div>
              ) : (
                <>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-sm font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded'>
                      {data?.brand?.displayName}
                    </span>
                    {data?.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className='text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded'
                      >
                        {cat.displayName}
                      </span>
                    ))}
                  </div>
                  <h1 className='text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900'>
                    {data?.displayName}
                  </h1>
                  <p className='text-sm text-muted-foreground mt-1 font-mono'>
                    SKU: {data?.sku}
                  </p>
                </>
              )}
            </div>

            {/* Pricing Section */}
            <div className='bg-card border border-border rounded-xl p-6 shadow-sm space-y-4'>
              {/* Giữ nguyên logic Pricing cũ */}
              {/* ... */}
              <div className='text-4xl font-bold text-primary'>
                {(displayPrice / 1000).toLocaleString('vi-VN')}k
                <span className='text-lg text-muted-foreground font-normal ml-1'>
                  / ngày
                </span>
              </div>
              {/* ... */}
              <div
                className={`flex items-center gap-2 text-sm font-medium ${
                  data?.isInStock ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data?.isInStock ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Info size={16} />
                )}
                {data?.isInStock
                  ? `Còn ${data?.quantity} xe sẵn sàng`
                  : 'Tạm hết xe'}
              </div>
            </div>

            {/* Quick Specs */}
            {!isLoading &&
              data?.specifications &&
              data.specifications.length > 0 && (
                <div className='grid grid-cols-3 gap-3'>
                  {data.specifications.slice(0, 3).map((spec) => (
                    <div
                      key={spec.id}
                      className='bg-secondary/30 border border-border rounded-lg p-3 text-center'
                    >
                      <div className='text-xs text-muted-foreground uppercase mb-1 truncate'>
                        {spec.specificationType.label}
                      </div>
                      <div className='text-sm font-bold text-foreground truncate'>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Buttons */}
            <div className='flex gap-3'>
              <Button
                disabled={!data?.isInStock || isLoading}
                className='flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold rounded-lg shadow-md'
                onClick={() => navigate(datXeUrl)}
              >
                {isLoading
                  ? 'Loading...'
                  : data?.isInStock
                  ? 'ĐẶT XE NGAY'
                  : 'LIÊN HỆ KHI CÓ XE'}
              </Button>
              <Button variant='outline' className='h-12 px-6'>
                Tư vấn
              </Button>
            </div>

            <div className='prose prose-sm text-muted-foreground'>
              <p>{data?.description}</p>
            </div>
          </div>
        </div>

        {/* --- FULL SPECIFICATIONS TABLE --- */}
        {data?.specifications && data.specifications.length > 0 && (
          <div className='mb-12'>
            <div className='flex items-center gap-2 mb-6'>
              <Trophy className='text-primary' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Thông số kỹ thuật chi tiết
              </h2>
            </div>
            <div className='bg-white border border-border rounded-xl overflow-hidden shadow-sm'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0'>
                {data.specifications.map((spec, index) => (
                  <div
                    key={spec.id}
                    className={`p-4 flex flex-col justify-center ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } md:border-b md:border-r border-gray-100`}
                  >
                    <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1'>
                      {spec.specificationType.label}
                    </span>
                    <span className='text-base font-medium text-gray-900'>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- WHY CHOOSE US (Static Content for Marketing) --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-blue-50/50 border border-blue-100 rounded-xl p-6'>
            <h3 className='flex items-center gap-2 text-lg font-bold text-blue-900 mb-3'>
              <ShieldCheck className='text-blue-600' />
              Cam kết chất lượng
            </h3>
            <ul className='space-y-2 text-sm text-blue-800/80'>
              <li className='flex items-center gap-2'>
                • Xe được bảo dưỡng định kỳ chính hãng.
              </li>
              <li className='flex items-center gap-2'>
                • Vệ sinh sạch sẽ, khử khuẩn trước khi giao.
              </li>
              <li className='flex items-center gap-2'>
                • Hỗ trợ sự cố kỹ thuật 24/7.
              </li>
            </ul>
          </div>

          <div className='bg-green-50/50 border border-green-100 rounded-xl p-6'>
            <h3 className='flex items-center gap-2 text-lg font-bold text-green-900 mb-3'>
              <CheckCircle2 className='text-green-600' />
              Thủ tục đơn giản
            </h3>
            <ul className='space-y-2 text-sm text-green-800/80'>
              <li className='flex items-center gap-2'>
                • Chỉ cần CCCD gắn chip & GPLX.
              </li>
              <li className='flex items-center gap-2'>
                • Không giữ giấy tờ gốc (tuỳ dòng xe).
              </li>
              <li className='flex items-center gap-2'>
                • Giao xe tận nơi trong nội thành.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
