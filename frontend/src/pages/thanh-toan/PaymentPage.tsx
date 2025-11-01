import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api/booking.api';
import { paymentApi } from '@/lib/api/payment.api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingInfoCard } from './components/BookingInfoCard';
import { PaymentMethodCard, type PaymentMethod } from './components/PaymentMethodCard';
import { ProviderSelection } from './components/ProviderSelection';
import { CashPaymentInfo } from './components/CashPaymentInfo';
import { PaymentSummaryCard } from './components/PaymentSummaryCard';
import { LoadingState } from '../dat-xe/components/LoadingState';
import type { PaymentMethodOption } from './components/PaymentMethodCard';

const PAYMENT_METHODS: PaymentMethodOption[] = [
    {
        id: 'credit_card',
        name: 'Thẻ tín dụng/Ghi nợ',
        icon: <div>💳</div>,
        description: 'Visa, Mastercard, JCB',
        providers: ['Visa', 'Mastercard', 'JCB'],
    },
    {
        id: 'e_wallet',
        name: 'Ví điện tử',
        icon: <div>📱</div>,
        description: 'MoMo, ZaloPay, VNPay',
        providers: ['MoMo', 'ZaloPay', 'VNPay'],
    },
    {
        id: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        icon: <div>🏦</div>,
        description: 'Internet Banking',
        providers: ['Vietcombank', 'BIDV', 'VietinBank', 'ACB'],
    },
    {
        id: 'cash',
        name: 'Thanh toán tiền mặt',
        icon: <div>💰</div>,
        description: 'Trả trực tiếp tại ga',
    },
];

export default function PaymentPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | ''>('');
    const [selectedProvider, setSelectedProvider] = useState<string>('');

    // Get booking details
    const { data: bookingData, isLoading, error } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => bookingApi.getBooking(bookingId!),
        select: (res) => res.data,
        enabled: !!bookingId,
        retry: false,
    });

    // Create payment mutation
    const createPaymentMutation = useMutation({
        mutationFn: (data: Parameters<typeof paymentApi.createPayment>[0]) => {
            return paymentApi.createPayment(data);
        },
        onSuccess: () => {
            if (selectedMethod === 'cash') {
                alert('Đặt xe thành công! Vui lòng thanh toán tiền mặt khi nhận xe.');
            } else {
                alert('Thanh toán thành công! Đặt xe hoàn tất.');
            }
            navigate('/thue-xe-tu-lai');
        },
        onError: (error: any) => {
            console.error('Payment error:', error);
            alert(error?.error || 'Thanh toán thất bại. Vui lòng thử lại.');
        },
    });

    const handleSubmitPayment = () => {
        if (!selectedMethod || !bookingId || !bookingData) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        const paymentData = {
            booking_id: bookingId,
            amount: bookingData.total_amount,
            type: 'rental_fee' as const,
            payment_method: selectedMethod,
            provider: selectedProvider || undefined,
            description: `Thanh toán đặt xe ${bookingData.vehicle_id}`,
        };

        createPaymentMutation.mutate(paymentData);
    };

    const handleMethodSelect = (methodId: PaymentMethod) => {
        setSelectedMethod(methodId);
        const method = PAYMENT_METHODS.find((m) => m.id === methodId);
        if (method?.providers && method.providers.length > 0) {
            setSelectedProvider(method.providers[0]);
        } else {
            setSelectedProvider('');
        }
    };

    const selectedMethodOption = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

    // Loading state
    if (isLoading) {
        return <LoadingState message="Đang tải thông tin thanh toán..." />;
    }

    if (error || !bookingData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-white/80">
                        <ArrowLeft className="mr-2" size={20} />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
                        <p className="text-gray-600 mt-1">Hoàn tất thanh toán để xác nhận đặt xe</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Payment Methods */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Info */}
                        <BookingInfoCard
                            bookingId={bookingId!}
                            startDate={bookingData.start_date}
                            endDate={bookingData.end_date}
                            totalAmount={bookingData.total_amount}
                        />

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <span>💳</span>
                                    Chọn phương thức thanh toán
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PAYMENT_METHODS.map((method) => (
                                        <PaymentMethodCard
                                            key={method.id}
                                            method={method}
                                            isSelected={selectedMethod === method.id}
                                            onSelect={handleMethodSelect}
                                        />
                                    ))}
                                </div>

                                {/* Provider Selection */}
                                {selectedMethodOption?.providers && (
                                    <ProviderSelection
                                        providers={selectedMethodOption.providers}
                                        selectedProvider={selectedProvider}
                                        onProviderChange={setSelectedProvider}
                                    />
                                )}

                                {/* Cash payment info */}
                                {selectedMethod === 'cash' && <CashPaymentInfo />}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <PaymentSummaryCard
                            totalAmount={bookingData.total_amount}
                            selectedMethod={selectedMethod}
                            isProcessing={createPaymentMutation.isPending}
                            onSubmit={handleSubmitPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
a