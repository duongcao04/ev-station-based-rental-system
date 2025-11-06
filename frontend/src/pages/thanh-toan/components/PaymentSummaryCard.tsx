import { Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatVNDCurrency } from '@/lib/number';
import type { PaymentMethod } from './PaymentMethodCard';

interface PaymentSummaryCardProps {
    totalAmount: number;
    selectedMethod: PaymentMethod | '';
    isProcessing: boolean;
    onSubmit: () => void;
}

export function PaymentSummaryCard({
    totalAmount,
    selectedMethod,
    isProcessing,
    onSubmit,
}: PaymentSummaryCardProps) {
    return (
        <div className="sticky top-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Banknote className="w-6 h-6" />
                    Tổng thanh toán
                </h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-lg">{formatVNDCurrency(totalAmount)}</span>
                </div>
                {selectedMethod === 'cash' && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        Thanh toán khi nhận xe
                    </div>
                )}
                <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105"
                    onClick={onSubmit}
                    disabled={!selectedMethod || isProcessing}
                >
                    {isProcessing ? '⏳ Đang xử lý...' : '💳 Xác nhận thanh toán'}
                </Button>
                <div className="text-xs text-center text-gray-500 mt-4">
                    <p>🛡️ Bảo mật tuyệt đối</p>
                    <p>🔒 Không lưu thông tin thẻ</p>
                </div>
            </div>
        </div>
    );
}
