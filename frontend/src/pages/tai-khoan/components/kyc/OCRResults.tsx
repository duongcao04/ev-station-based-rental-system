import { Card } from '@/components/ui/card';

interface OCRData {
  idNumber?: string;
  fullName?: string;
  birthDate?: string;
  permanentAddress?: string;
  districtCode?: string;
  wardCode?: string;
  provinceCode?: string;
  expiryDate?: string;
  issuedBy?: string;
  issueDate?: string;
  ethnicity?: string;
  religion?: string;
}

interface OCRResultsProps {
  title: string;
  data?: OCRData;
  isLoading?: boolean;
}

export function OCRResults({ title, data, isLoading }: OCRResultsProps) {
  const renderField = (label: string, value?: string) => (
    <div key={label} className='mb-3'>
      <label className='text-sm text-gray-600 block mb-1'>{label}</label>
      <div className='h-8 bg-gray-100 rounded px-3 flex items-center'>
        {isLoading ? (
          <div className='animate-pulse w-full h-full bg-gray-300 rounded' />
        ) : (
          <span className='text-sm text-gray-800'>{value || '-'}</span>
        )}
      </div>
    </div>
  );

  return (
    <Card className='p-6'>
      <h3 className='text-lg font-semibold mb-4'>{title}</h3>
      <div className='grid grid-cols-2 gap-4'>
        {title.includes('trước') && (
          <>
            {renderField('Số CMND', data?.idNumber)}
            {renderField('Họ và tên', data?.fullName)}
            {renderField('Ngày sinh', data?.birthDate)}
            {renderField('Nơi thường trú', data?.permanentAddress)}
            {renderField('Mã phường', data?.wardCode)}
            {renderField('Mã quận', data?.districtCode)}
            {renderField('Mã tỉnh', data?.provinceCode)}
            {renderField('Ngày hết hạn', data?.expiryDate)}
          </>
        )}
        {title.includes('sau') && (
          <>
            {renderField('Cấp bởi', data?.issuedBy)}
            {renderField('Ngày cấp', data?.issueDate)}
            {renderField('Dân tộc', data?.ethnicity)}
            {renderField('Tôn giáo', data?.religion)}
          </>
        )}
      </div>
    </Card>
  );
}
