'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TableHeader } from '../../components/ui/table-header';
import { useBrands } from '../../lib/queries/useBrand';

interface Brand {
  id: string;
  displayName: string;
  description: string;
  thumbnailUrl?: string;
}

export default function QuanLyThuongHieuPage() {
  const [error, setError] = useState('');
  const { data: brands, isLoading } = useBrands();

  return (
    <div className='p-8'>
      <TableHeader
        title='Brands'
        description='Manage vehicle brands'
        createHref='/dashboard/thuong-hieu/them-moi'
      />

      {error && (
        <div className='bg-destructive/10 text-destructive p-4 rounded-md mb-4'>
          {error}
        </div>
      )}

      {isLoading ? (
        <p className='text-muted-foreground'>Loading...</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-border'>
                <th className='text-left py-3 px-4'>Name</th>
                <th className='text-left py-3 px-4'>Description</th>
                <th className='text-left py-3 px-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className='border-b border-border hover:bg-muted/50'
                >
                  <td className='py-3 px-4'>{brand.displayName}</td>
                  <td className='py-3 px-4 text-muted-foreground'>
                    {brand.description}
                  </td>
                  <td className='py-3 px-4 flex gap-2'>
                    <Link to={`/dashboard/thuong-hieu/${brand.id}`}>
                      <Button variant='outline' size='sm'>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant='destructive'
                      size='sm'
                      // onClick={() => deleteBrand(brand.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
