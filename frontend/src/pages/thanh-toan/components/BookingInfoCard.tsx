import { CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { formatVNDCurrency } from '@/lib/number';

interface BookingInfoCardProps {
    bookingId: string;
    startDate: string | null;
    endDate: string | null;
    totalAmount: number;
}

export function BookingInfoCard({
    bookingId,
    startDate,
    endDate,
    totalAmount,
}: BookingInfoCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Thông tin đặt xe
                </h2>
            </div>
            <div className="p-6 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Mã đặt xe:</span>
                    <span className="font-bold">{bookingId.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-semibold">
                        {startDate && endDate
                            ? `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}`
                            : 'Chưa có thông tin'}
                    </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-dashed border-gray-300">
                    <span className="text-lg font-bold">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-green-600">
                        {formatVNDCurrency(totalAmount)}
                    </span>
                </div>
            </div>
        </div>
    );
}

