'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'url';
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
  error?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  defaultValue,
  error,
}: FormFieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={name}>
        {label}
        {required && <span className='text-destructive ml-1'>*</span>}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className={error ? 'border-destructive' : ''}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className={error ? 'border-destructive' : ''}
        />
      )}
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
