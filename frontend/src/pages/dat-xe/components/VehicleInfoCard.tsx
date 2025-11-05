import type { TCar } from '@/lib/types/car.type';
import { Shield, CreditCard } from 'lucide-react';
import { formatVNDCurrency } from '@/lib/number';

interface VehicleInfoCardProps {
    vehicle: TCar;
}

export function VehicleInfoCard({ vehicle }: VehicleInfoCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Thông tin xe
                </h2>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-6">
                    {vehicle.thumbnailUrl && (
                        <div className="relative">
                            <img
                                src={vehicle.thumbnailUrl}
                                alt={vehicle.displayName}
                                className="w-32 h-32 object-cover rounded-xl shadow-lg"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Có sẵn
                            </div>
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{vehicle.displayName}</h3>
                        <p className="text-gray-600 mb-2">{vehicle.brand?.displayName}</p>
						<div className="flex items-baseline gap-2">
							<span className="text-3xl font-bold text-green-600">
								{formatVNDCurrency(vehicle.salePrice || vehicle.regularPrice)}
							</span>
							<span className="text-gray-500">/ngày</span>
						</div>
						{vehicle.depositPrice && (
							<div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
								<CreditCard className="w-4 h-4" />
								<span>Phí đặt cọc: {formatVNDCurrency(vehicle.depositPrice)}</span>
							</div>
						)}
                    </div>
                </div>
            </div>
        </div>
    );
}

