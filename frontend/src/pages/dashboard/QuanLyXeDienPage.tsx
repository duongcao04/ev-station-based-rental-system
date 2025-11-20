'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBrands } from '@/lib/queries/useBrand';
import { useCategories } from '@/lib/queries/useCategory';
import {
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useVehicles,
} from '@/lib/queries/useVehicles';
import { useState } from 'react';
import { DataTable } from './components/VehicleDataTable';
import { ThemXeModal } from './components/ThemXeModal';
import type { TCar } from '../../lib/types/car.type';

export default function QuanLyXeDienPage() {
  const { data, isLoading } = useVehicles();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { mutateAsync: createVehicleMutate, isPending: isCreating } =
    useCreateVehicleMutation();
  const { mutateAsync: deleteVehicleMutation, isPending: isDeleting } =
    useDeleteVehicleMutation();

  const [editingVehicle, setEditingVehicle] = useState<TCar | null>(null);

  const handleEdit = (vehicle: TCar) => {
    setEditingVehicle(vehicle);
    console.log('Edit vehicle:', vehicle);
    // TODO: Implement edit modal/form
  };

  const handleDelete = async (vehicleId: string) => {
    deleteVehicleMutation({ id: vehicleId });
    console.log('Delete vehicle:', vehicleId);
    // TODO: Implement delete API call
  };

  return (
    <div className='space-y-6 p-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold text-foreground'>
            Quản lý Xe điện
          </h2>
          <p className='text-muted-foreground'>
            Theo dõi số lượng xe và hành động
          </p>
        </div>

        <ThemXeModal
          brands={!isLoading ? brands : []}
          categories={!isLoading ? categories : []}
          onSubmit={async (data) => {
            await createVehicleMutate(data);
          }}
          loading={isCreating}
        />
      </div>

      <Card className='border border-border'>
        <CardHeader>
          <CardTitle>Danh Sách Xe</CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái các xe trong đội
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data ?? []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
