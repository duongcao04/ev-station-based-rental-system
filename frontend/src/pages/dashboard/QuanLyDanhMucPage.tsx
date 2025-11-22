'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TableHeader } from '../../components/ui/table-header';
import { useCategories } from '../../lib/queries/useCategory';

export default function QuanLyDanhMucPage() {
  const [error, setError] = useState('');
  const { data: categories, isLoading } = useCategories();

  return (
    <div className='p-8'>
      <TableHeader
        title='Danh mục'
        description='Manage vehicle categories'
        createHref='/dashboard/danh-muc/them-moi'
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
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className='border-b border-border hover:bg-muted/50'
                >
                  <td className='py-3 px-4'>{category.displayName}</td>
                  <td className='py-3 px-4 text-muted-foreground'>
                    {category.description}
                  </td>
                  <td className='py-3 px-4 flex gap-2'>
                    <Link to={`/dashboard/danh-muc/${category.id}`}>
                      <Button variant='outline' size='sm'>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant='destructive'
                      size='sm'
                      // onClick={() => deleteCategory(category.id)}
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
