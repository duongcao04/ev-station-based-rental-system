import { CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { formatVNDCurrency } from '@/lib/number';

interface BookingInfoCardProps {
    bookingId: string;
    startDate: string | null;
    endDate: string | null;
    totalAmount: number;
    renterName?: string;
    renterPhone?: string;
    renterEmail?: string;
    renterNote?: string;
}

export function BookingInfoCard({
    bookingId,
    startDate,
    endDate,
    totalAmount,
    renterName,
    renterPhone,
    renterEmail,
    renterNote,
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
                {(renterName || renterPhone || renterEmail) && (
                    <div className="pt-4 mt-2 border-t border-gray-100">
                        <div className="text-sm text-gray-600 font-semibold mb-2">Người đặt</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            {renterName && <div><span className="text-gray-500">Tên: </span><span className="font-medium text-gray-800">{renterName}</span></div>}
                            {renterPhone && <div><span className="text-gray-500">SĐT: </span><span className="font-medium text-gray-800">{renterPhone}</span></div>}
                            {renterEmail && <div className="md:col-span-1"><span className="text-gray-500">Email: </span><span className="font-medium text-gray-800 break-all">{renterEmail}</span></div>}
                        </div>
                        {renterNote && (
                            <div className="mt-2 text-sm">
                                <span className="text-gray-500">Ghi chú: </span>
                                <span className="text-gray-800">{renterNote}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

