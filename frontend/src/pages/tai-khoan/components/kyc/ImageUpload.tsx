'use client';

import type React from 'react';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageIcon, Camera } from 'lucide-react';

interface ImageUploadProps {
  title: string;
  onImageSelect: (file: File) => void;
  preview?: string;
  isLoading?: boolean;
}

export function ImageUpload({
  title,
  onImageSelect,
  preview,
  isLoading = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [previewUrl, setPreviewUrl] = useState(preview);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Không thể truy cập camera');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', {
              type: 'image/jpeg',
            });
            onImageSelect(file);
            setPreviewUrl(canvasRef.current?.toDataURL());
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  return (
    <Card className='p-6'>
      <h3 className='text-lg font-semibold mb-4'>{title}</h3>

      {!isCameraActive ? (
        <>
          {previewUrl ? (
            <div className='mb-4'>
              <img
                src={previewUrl || '/placeholder.svg'}
                alt='Preview'
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>
          ) : (
            <div className='mb-4 w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300'>
              <div className='text-center'>
                <ImageIcon className='w-16 h-16 text-gray-400 mx-auto mb-2' />
                <p className='text-gray-500'>Chưa chọn ảnh</p>
              </div>
            </div>
          )}

          <div className='flex gap-2'>
            <Button
              variant='default'
              className='bg-red-500 hover:bg-red-600 text-white'
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Chọn Ảnh
            </Button>
            <Button
              variant='default'
              className='bg-red-500 hover:bg-red-600 text-white'
              onClick={startCamera}
              disabled={isLoading}
            >
              <Camera className='w-4 h-4 mr-2' />
              Mở Camera
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            className='w-full h-64 bg-black rounded-lg mb-4'
          />
          <canvas ref={canvasRef} className='hidden' width={640} height={480} />
          <div className='flex gap-2'>
            <Button
              className='bg-green-500 hover:bg-green-600 text-white flex-1'
              onClick={capturePhoto}
            >
              Chụp Ảnh
            </Button>
            <Button
              variant='outline'
              className='flex-1 bg-transparent'
              onClick={stopCamera}
            >
              Hủy
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
