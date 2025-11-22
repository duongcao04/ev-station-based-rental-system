'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import {
  useCategoryDetail,
  useUpdateCategoryMutation,
} from '../../lib/queries/useCategory';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CreateCategorySchema,
  type CreateCategoryFormData,
} from '../../lib/schemas/category.schema';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useCreateCategoryMutation } from '../../lib/queries/useCategory';

export default function ChiTietDanhMucPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.categoryId as string;
  const isNew = id === 'new';

  const { data: category, isLoading } = useCategoryDetail(
    !isNew ? id : undefined
  );
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  console.log(category);

  const formik = useFormik<CreateCategoryFormData>({
    initialValues: {
      displayName: '',
      thumbnailUrl: '',
      description: '',
    },
    validationSchema: toFormikValidationSchema(CreateCategorySchema),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await createMutation.mutateAsync(values);
        } else {
          await updateMutation.mutateAsync({ id, ...values });
        }
        navigate('/dashboard/danh-muc');
      } catch (error) {
        console.error(error);
        toast.error('Failed to save category');
      }
    },
  });

  useEffect(() => {
    if (category && !isNew) {
      formik.setValues({
        displayName: category.displayName || '',
        description: category.description || '',
        thumbnailUrl: category.thumbnailUrl || '',
      });
    }
  }, [category, isNew]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? String(formik.errors[fieldName])
      : '';
  };

  return (
    <div className='p-8 max-w-2xl'>
      <h1 className='text-3xl font-bold text-foreground mb-6'>
        {isNew ? 'Create Category' : 'Edit Category'}
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
            onClick={() => navigate('/dashboard/danh-muc')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
