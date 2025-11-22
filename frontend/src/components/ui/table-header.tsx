'use client';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TableHeaderProps {
  title: string;
  description?: string;
  createHref: string;
}

export function TableHeader({
  title,
  description,
  createHref,
}: TableHeaderProps) {
  return (
    <div className='flex justify-between items-center mb-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>{title}</h1>
        {description && (
          <p className='text-muted-foreground text-sm mt-1'>{description}</p>
        )}
      </div>
      <Link to={createHref}>
        <Button className='bg-primary hover:bg-primary/90'>Add New</Button>
      </Link>
    </div>
  );
}
