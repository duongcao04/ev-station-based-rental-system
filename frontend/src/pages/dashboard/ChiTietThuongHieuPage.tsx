'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import {
  useBrandDetail,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from '../../lib/queries/useBrand';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CreateBrandSchema,
  type CreateBrandFormData,
} from '../../lib/schemas/brand.schema';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

export default function BrandForm() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.brandId as string;
  const isNew = id === 'new';

  const { data: brand, isLoading } = useBrandDetail(!isNew ? id : undefined);
  const createMutation = useCreateBrandMutation();
  const updateMutation = useUpdateBrandMutation();
  console.log(brand);

  const formik = useFormik<CreateBrandFormData>({
    initialValues: {
      displayName: '',
      thumbnailUrl: '',
      description: '',
    },
    validationSchema: toFormikValidationSchema(CreateBrandSchema),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await createMutation.mutateAsync(values);
        } else {
          await updateMutation.mutateAsync({ id, ...values });
        }
        navigate('/dashboard/thuong-hieu');
      } catch (error) {
        console.error(error);
        toast.error('Failed to save brand');
      }
    },
  });

  useEffect(() => {
    if (brand && !isNew) {
      formik.setValues({
        displayName: brand.displayName || '',
        description: brand.description || '',
        thumbnailUrl: brand.thumbnailUrl || '',
      });
    }
  }, [brand, isNew]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading && !isNew) {
    return <div className='p-8'>Loading...</div>;
  }
  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? String(formik.errors[fieldName])
      : '';
  };

  return (
    <div className='p-8 max-w-2xl'>
      <h1 className='text-3xl font-bold text-foreground mb-6'>
        {isNew ? 'Create Brand' : 'Edit Brand'}
      </h1>

      <form onSubmit={formik.handleSubmit} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='displayName'>
            Tên thương hiệu <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='displayName'
            placeholder='Nhập tên thương hiệu'
            {...formik.getFieldProps('displayName')}
            aria-invalid={!!getFieldError('displayName')}
          />
          {getFieldError('displayName') && (
            <p className='text-sm text-destructive'>
              {getFieldError('displayName')}
            </p>
          )}
        </div>
        {/* Description */}
        <div className='space-y-2'>
          <Label htmlFor='description'>Mô tả</Label>
          <Textarea
            id='description'
            placeholder='Nhập mô tả chi tiết về xe'
            rows={4}
            {...formik.getFieldProps('description')}
          />
          {getFieldError('description') && (
            <p className='text-sm text-destructive'>
              {getFieldError('description')}
            </p>
          )}
        </div>
        {/* Thumbnail URL */}
        <div className='space-y-2'>
          <Label htmlFor='thumbnailUrl'>
            URL hình ảnh <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='thumbnailUrl'
            type='url'
            placeholder='https://...'
            {...formik.getFieldProps('thumbnailUrl')}
            aria-invalid={!!getFieldError('thumbnailUrl')}
          />
          {getFieldError('thumbnailUrl') && (
            <p className='text-sm text-destructive'>
              {getFieldError('thumbnailUrl')}
            </p>
          )}
        </div>

        <div className='flex gap-4'>
          <Button
            type='submit'
            className='bg-primary hover:bg-primary/90'
            disabled={isSubmitting || !formik.dirty}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/dashboard/thuong-hieu')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
