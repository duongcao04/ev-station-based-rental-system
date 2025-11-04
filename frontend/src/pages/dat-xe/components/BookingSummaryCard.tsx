import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import type { TCar } from '@/lib/types/car.type';
import type { Dayjs } from 'dayjs';
import { formatVNDCurrency } from '@/lib/number';

interface BookingSummaryCardProps {
    vehicle: TCar;
    dateRange: [Dayjs | null, Dayjs | null];
    totalAmount: number;
    onSubmit: () => void;
    isSubmitting: boolean;
    isDisabled: boolean;
}

export function BookingSummaryCard({
    vehicle,
    dateRange,
    totalAmount,
    onSubmit,
    isSubmitting,
    isDisabled,
}: BookingSummaryCardProps) {
    const days = dateRange[0] && dateRange[1] ? dateRange[1].diff(dateRange[0], 'day') + 1 : 0;
    const pricePerDay = Number(vehicle.salePrice || vehicle.regularPrice);
    const deposit = vehicle.depositPrice ? Number(vehicle.depositPrice) : 0;

    return (
        <div className="sticky top-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        Tổng kết
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {/* Vehicle quick info merged here */}
                    <div className="flex items-center gap-4 pb-4 border-b">
                        {vehicle.thumbnailUrl && (
                            <img src={vehicle.thumbnailUrl} alt={vehicle.displayName} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">{vehicle.displayName}</div>
                            <div className="text-sm text-gray-600">{vehicle.brand?.displayName}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                        <span className="text-gray-600">Số ngày:</span>
                        <span className="font-bold text-lg">{days}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                        <span className="text-gray-600">Giá mỗi ngày:</span>
                        <span className="font-semibold">{formatVNDCurrency(pricePerDay)}</span>
                    </div>
                    {deposit > 0 && (
                        <div className="flex justify-between items-center pb-3 border-b text-blue-600">
                            <span className="text-gray-600">Tiền cọc:</span>
                            <span className="font-semibold">{formatVNDCurrency(deposit)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-gray-300">
                        <span className="text-xl font-bold">Tổng cộng:</span>
                        <span className="text-3xl font-bold text-green-600">{formatVNDCurrency(totalAmount)}</span>
                    </div>
                    <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105"
                        onClick={onSubmit}
                        disabled={isDisabled || isSubmitting}
                    >
                        {isSubmitting ? ' Đang xử lý...' : ' Xác nhận đặt xe'}
                    </Button>
                    <div className="text-xs text-center text-gray-500 mt-4">
                        <p>🛡️ Bảo mật thanh toán</p>
                        <p>✅ Đặt xe miễn phí, hủy dễ dàng</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

