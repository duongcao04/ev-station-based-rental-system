import { AlertCircle } from 'lucide-react';

export function CashPaymentInfo() {
    return (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                    Bạn sẽ thanh toán tiền mặt khi nhận xe tại trạm. Vui lòng mang đủ tiền và các giấy tờ
                    cần thiết.
                </span>
            </p>
        </div>
    );
}
