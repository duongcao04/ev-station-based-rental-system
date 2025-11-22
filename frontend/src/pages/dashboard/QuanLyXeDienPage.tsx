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
  useUpdateVehicleMutation,
  useVehicles,
} from '@/lib/queries/useVehicles';
import { useState } from 'react';
import { DataTable } from './components/VehicleDataTable';
import { ThemXeModal } from './components/ThemXeModal';
import type { TCar } from '../../lib/types/car.type';
import { SuaXeModal } from './components/SuaXeModal';

export default function QuanLyXeDienPage() {
  const { data, isLoading } = useVehicles();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { mutateAsync: createVehicleMutate, isPending: isCreating } =
    useCreateVehicleMutation();
  const { mutateAsync: deleteVehicleMutation, isPending: isDeleting } =
    useDeleteVehicleMutation();
  const { mutateAsync: updateVehicleMutate, isPending: isUpdating } =
    useUpdateVehicleMutation();

  const [editingVehicle, setEditingVehicle] = useState<TCar | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (vehicle: TCar) => {
    setEditingVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (vehicleId: string) => {
    deleteVehicleMutation({ id: vehicleId });
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
          brands={brands}
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

      <SuaXeModal
        brands={!isLoading ? brands : []}
        categories={!isLoading ? categories : []}
        onSubmit={async (data) => {
          await updateVehicleMutate(data);
        }}
        loading={isUpdating}
        editingVehicle={editingVehicle}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingVehicle(null);
          }
          setIsEditModalOpen(open);
        }}
      />
    </div>
  );
}
