'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  UpdateCarSchema,
  type UpdateCarFormData,
} from '@/lib/schemas/car.schema';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { TCategory } from '../../../lib/types/category.type';
import type { TBrand } from '../../../lib/types/brand.type';
import type { TCar } from '@/lib/types/car.type';

export interface Brand {
  id: string;
  name: string;
}

interface EditCarModalProps {
  brands: TBrand[];
  categories: TCategory[];
  onSubmit: (data: UpdateCarFormData) => Promise<void>;
  loading?: boolean;
  editingVehicle: TCar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuaXeModal({
  brands,
  categories,
  onSubmit,
  loading = false,
  editingVehicle,
  open,
  onOpenChange,
}: EditCarModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      displayName: '',
      regularPrice: '',
      salePrice: '',
      depositPrice: '',
      sku: '',
      slug: '',
      quantity: '',
      isInStock: true,
      description: '',
      thumbnailUrl: '',
      brandId: '',
      categoryIds: [] as string[],
    },
    validationSchema: toFormikValidationSchema(UpdateCarSchema),
    onSubmit: async (values) => {
      setSubmitError(null);
      if (!editingVehicle) return;
      try {
        const payload: UpdateCarFormData = {
          id: editingVehicle.id,
          displayName: values.displayName,
          regularPrice: parseFloat(values.regularPrice),
          salePrice: parseFloat(values.salePrice) || undefined,
          depositPrice: parseFloat(values.depositPrice) || undefined,
          sku: values.sku,
          slug: values.slug,
          quantity: values.quantity ? Number.parseInt(values.quantity) : 1,
          isInStock: values.isInStock,
          description: values.description || null,
          thumbnailUrl: values.thumbnailUrl,
          brandId: values.brandId || null,
          categoryIds: values.categoryIds,
        };

        await onSubmit(payload);
        onOpenChange(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Lỗi không xác định';
        setSubmitError(message);
      }
    },
  });

  useEffect(() => {
    if (editingVehicle) {
      formik.setValues({
        displayName: editingVehicle.displayName || '',
        regularPrice: editingVehicle.regularPrice?.toString() || '',
        salePrice: editingVehicle.salePrice?.toString() || '',
        depositPrice: editingVehicle.depositPrice?.toString() || '',
        sku: editingVehicle.sku || '',
        slug: editingVehicle.slug || '',
        quantity: editingVehicle.quantity?.toString() || '',
        isInStock: editingVehicle.isInStock || true,
        description: editingVehicle.description || '',
        thumbnailUrl: editingVehicle.thumbnailUrl || '',
        brandId: editingVehicle.brand?.id || '',
        categoryIds: editingVehicle.categories?.map((c) => c.id) || [],
      });
    }
  }, [editingVehicle]);

  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? String(formik.errors[fieldName])
      : '';
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = formik.values.categoryIds;
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    formik.setFieldValue('categoryIds', updatedCategories);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-h-[90vh] overflow-y-auto'
        style={{ maxWidth: 1000 }}
      >
        <DialogHeader>
          <DialogTitle>Chỉnh sửa xe</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin xe trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          {submitError && (
            <div className='p-3 text-sm text-destructive bg-destructive/10 rounded-md'>
              {submitError}
            </div>
          )}

          {/* Display Name */}
          <div className='space-y-2'>
            <Label htmlFor='displayName'>
              Tên xe <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='displayName'
              placeholder='Nhập tên xe'
              {...formik.getFieldProps('displayName')}
              aria-invalid={!!getFieldError('displayName')}
            />
            {getFieldError('displayName') && (
              <p className='text-sm text-destructive'>
                {getFieldError('displayName')}
              </p>
            )}
          </div>

          {/* SKU and Slug */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='sku'>
                SKU <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='sku'
                placeholder='Mã SKU'
                {...formik.getFieldProps('sku')}
                aria-invalid={!!getFieldError('sku')}
              />
              {getFieldError('sku') && (
                <p className='text-sm text-destructive'>
                  {getFieldError('sku')}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>
                Slug <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='slug'
                placeholder='URL slug'
                {...formik.getFieldProps('slug')}
                aria-invalid={!!getFieldError('slug')}
              />
              {getFieldError('slug') && (
                <p className='text-sm text-destructive'>
                  {getFieldError('slug')}
                </p>
              )}
            </div>
          </div>

          {/* Prices */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='regularPrice'>
                Giá bán <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='regularPrice'
                type='number'
                step='0.01'
                placeholder='0.00'
                {...formik.getFieldProps('regularPrice')}
                aria-invalid={!!getFieldError('regularPrice')}
              />
              {getFieldError('regularPrice') && (
                <p className='text-sm text-destructive'>
                  {getFieldError('regularPrice')}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='salePrice'>Giá khuyến mãi</Label>
              <Input
                id='salePrice'
                type='number'
                step='0.01'
                placeholder='0.00'
                {...formik.getFieldProps('salePrice')}
              />
              {getFieldError('salePrice') && (
                <p className='text-sm text-destructive'>
                  {getFieldError('salePrice')}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='depositPrice'>Giá cọc</Label>
              <Input
                id='depositPrice'
                type='number'
                step='0.01'
                placeholder='0.00'
                {...formik.getFieldProps('depositPrice')}
              />
              {getFieldError('depositPrice') && (
                <p className='text-sm text-destructive'>
                  {getFieldError('depositPrice')}
                </p>
              )}
            </div>
          </div>

          {/* Brand - Dropdown */}
          <div className='space-y-2'>
            <Label htmlFor='brandId'>Hãng xe</Label>
            <Select
              value={formik.values.brandId}
              onValueChange={(value) => formik.setFieldValue('brandId', value)}
            >
              <SelectTrigger
                id='brandId'
                aria-invalid={!!getFieldError('brandId')}
              >
                <SelectValue placeholder='Chọn hãng xe' />
              </SelectTrigger>
              <SelectContent>
                {brands?.map((brand) => (
                  <SelectItem key={brand?.id} value={brand.id}>
                    {brand?.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('brandId') && (
              <p className='text-sm text-destructive'>
                {getFieldError('brandId')}
              </p>
            )}
          </div>

          {/* Categories - Multi-select */}
          <div className='space-y-2'>
            <Label>
              Danh mục <span className='text-destructive'>*</span>
            </Label>
            <div className='border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto'>
              {categories?.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  Không có danh mục nào
                </p>
              ) : (
                categories?.map((category) => (
                  <label
                    key={category?.id}
                    className='flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded'
                  >
                    <input
                      type='checkbox'
                      checked={formik.values.categoryIds.includes(category?.id)}
                      onChange={() => handleCategoryToggle(category?.id)}
                      className='rounded border-gray-300'
                    />
                    <span className='text-sm'>{category?.displayName}</span>
                  </label>
                ))
              )}
            </div>
            {getFieldError('categoryIds') && (
              <p className='text-sm text-destructive'>
                {getFieldError('categoryIds')}
              </p>
            )}
          </div>

          {/* Quantity and In Stock */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='quantity'>Số lượng</Label>
              <Input
                id='quantity'
                type='number'
                min='0'
                placeholder='0'
                {...formik.getFieldProps('quantity')}
              />
              {getFieldError('quantity') && (
                <p className='text-sm text-destructive'>
                  {getFieldError('quantity')}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='isInStock' className='flex items-center'>
                <input
                  id='isInStock'
                  type='checkbox'
                  checked={formik.values.isInStock}
                  onChange={(e) =>
                    formik.setFieldValue('isInStock', e.target.checked)
                  }
                  className='mr-2 rounded border-gray-300'
                />
                Còn hàng
              </Label>
            </div>
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

          {/* Form Actions */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type='submit' disabled={loading || formik.isSubmitting}>
              {loading || formik.isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
