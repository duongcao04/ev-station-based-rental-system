'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import {
  useFaceVerification,
  useKYCSubmit,
  useOCRProcess,
} from '../../lib/queries/useKyc';
import { ImageUpload } from './components/kyc/ImageUpload';
import { OCRResults } from './components/kyc/OcrResults';

interface OCRData {
  idNumber?: string;
  fullName?: string;
  birthDate?: string;
  permanentAddress?: string;
  districtCode?: string;
  wardCode?: string;
  provinceCode?: string;
  expiryDate?: string;
}

interface BackOCRData {
  issuedBy?: string;
  issueDate?: string;
  ethnicity?: string;
  religion?: string;
}

export default function XacThucKYC() {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);

  const [frontOCR, setFrontOCR] = useState<OCRData | null>(null);
  const [backOCR, setBackOCR] = useState<BackOCRData | null>(null);
  const [faceStatus, setFaceStatus] = useState<
    'pending' | 'verified' | 'failed'
  >('pending');

  const ocrMutation = useOCRProcess();
  const faceMutation = useFaceVerification();
  const submitMutation = useKYCSubmit();

  const handleFrontImageSelect = async (file: File) => {
    setFrontImage(file);
    // Simulate OCR processing
    ocrMutation.mutate(
      { file, type: 'front' },
      {
        onSuccess: (response) => {
          setFrontOCR(response.data.ocrResult || {});
        },
      }
    );
  };

  const handleBackImageSelect = async (file: File) => {
    setBackImage(file);
    // Simulate OCR processing
    ocrMutation.mutate(
      { file, type: 'back' },
      {
        onSuccess: (response) => {
          setBackOCR(response.data.ocrResult || {});
        },
      }
    );
  };

  const handleFaceImageSelect = async (file: File) => {
    setFaceImage(file);
    // Simulate face verification
    faceMutation.mutate(file, {
      onSuccess: (response) => {
        setFaceStatus(response.data.status || 'verified');
      },
    });
  };

  const handleSubmit = () => {
    if (!frontImage || !backImage || !faceImage) {
      alert('Vui lòng cung cấp tất cả các ảnh cần thiết');
      return;
    }

    submitMutation.mutate(
      {
        frontImage,
        backImage,
        faceImage,
        frontOCR: frontOCR || undefined,
        backOCR: backOCR || undefined,
        faceVerification: { status: faceStatus },
      },
      {
        onSuccess: () => {
          alert('Xác thực KYC thành công!');
        },
        onError: () => {
          alert('Xác thực KYC thất bại');
        },
      }
    );
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Xác thực thông tin tài khoản của khách hàng
          </h1>
          <p className='text-red-600 text-sm'>
            * Hình ảnh CMT/CCCD của Quý khách được bảo mật
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column - Image Upload */}
          <div className='space-y-6'>
            <ImageUpload
              title='1. Ảnh CCCD/Hộ chiếu mặt trước'
              onImageSelect={handleFrontImageSelect}
              preview={frontImage ? URL.createObjectURL(frontImage) : undefined}
              isLoading={ocrMutation.isPending}
            />

            <ImageUpload
              title='2. Ảnh CMT/CCCD mặt sau'
              onImageSelect={handleBackImageSelect}
              preview={backImage ? URL.createObjectURL(backImage) : undefined}
              isLoading={ocrMutation.isPending}
            />

            <ImageUpload
              title='3. Ảnh khuôn mặt'
              onImageSelect={handleFaceImageSelect}
              preview={faceImage ? URL.createObjectURL(faceImage) : undefined}
              isLoading={faceMutation.isPending}
            />
          </div>

          {/* Right Column - OCR Results */}
          <div className='space-y-6'>
            <OCRResults
              title='Kết quả OCR mặt trước'
              data={frontOCR || undefined}
              isLoading={ocrMutation.isPending}
            />

            <OCRResults
              title='Kết quả OCR mặt sau'
              data={backOCR || undefined}
              isLoading={ocrMutation.isPending}
            />

            {/* <FaceVerification status={faceStatus} /> */}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={
                !frontImage ||
                !backImage ||
                !faceImage ||
                submitMutation.isPending
              }
              className='w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base'
            >
              <ArrowRight className='w-5 h-5 mr-2' />
              Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
