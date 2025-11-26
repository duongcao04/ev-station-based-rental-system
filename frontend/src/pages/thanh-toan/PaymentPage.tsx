import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '@/lib/api/booking.api';
import { paymentApi } from '@/lib/api/payment.api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingInfoCard } from './components/BookingInfoCard';
import { PaymentMethodCard } from './components/PaymentMethodCard';
import { ProviderSelection } from './components/ProviderSelection';
import { CashPaymentInfo } from './components/CashPaymentInfo';
import { PaymentSummaryCard } from './components/PaymentSummaryCard';
import { LoadingState } from '../dat-xe/components/LoadingState';
import { useProfile } from '../../lib/queries/useAuth';
import { useNotifications } from '../../lib/queries/useNotifications';
import { vehicleApi } from '../../lib/api/vehicle.api';
import type { BookingData } from './PaymentResultPage';
import dayjs from 'dayjs';

const PAYMENT_METHODS = [
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
        description: 'MoMo,  VNPay',
        providers: ['MoMo', 'VNPay'],
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
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');
    const [renterInfo, setRenterInfo] = useState({});
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
  const { data: user } = useProfile();
  const { sendNotification } = useNotifications();

    // Load booking data
    useEffect(() => {
        if (!bookingId) {
            setIsLoading(false);
            return;
        }

        const loadBookingData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await bookingApi.getBooking(bookingId);
                setBookingData(response.data);
            } catch (err) {
                console.error('Error loading booking:', err);
                const errorMessage = (err as any)?.response?.data?.error || (err as any)?.message || 'Không thể tải thông tin booking';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadBookingData();
    }, [bookingId]);

    // Load renter info from localStorage saved at booking step
    useEffect(() => {
        if (!bookingId) return;
        try {
            const raw = localStorage.getItem(`booking:renter:${bookingId}`);
            if (raw) setRenterInfo(JSON.parse(raw));
        } catch (_) { }
    }, [bookingId]);

    const handleSubmitPayment = async () => {
        if (!selectedMethod || !bookingId || !bookingData) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        if (selectedMethod === 'cash') {
            const vehicle = await vehicleApi.getVehicle(bookingData?.vehicle_id).then(res=>res.data)
            sendNotification({
            userId: user.id,
            title: 'Đặt xe thành công!',
            message: `Bạn đã đặt thành công xe ${
              vehicle?.displayName
            } cho chuyến đi từ ${dayjs(bookingData.start_date).format(
              'DD/MM/YYYY'
            )} đến ${dayjs(bookingData.end_date).format(
              'DD/MM/YYYY'
            )}. Mã đặt xe của bạn là ${bookingId}.`,
            url: `/tai-khoan/lich-su-thue/${bookingId}`,
          });
            navigate('/thue-xe-tu-lai');
            return;
        }

        if (selectedMethod === 'credit_card' || selectedMethod === 'bank_transfer') {
            alert('Phương thức này đang được cập nhật. Vui lòng chọn Ví điện tử (MoMo/VNPay) hoặc Tiền mặt.');
            return;
        }

        const paymentData: any = {
            booking_id: bookingId,
            amount: (bookingData as any).total_amount,
            type: 'rental_fee',
            payment_method: selectedMethod,
            provider: selectedProvider || undefined,
            description: `Thanh toán đặt xe ${(bookingData as any).vehicle_id}`,
        };

        try {
            setIsProcessing(true);
            let response;

            // Branch: VNPay -> call VNPay endpoint to get paymentUrl
            if (selectedMethod === 'e_wallet' && selectedProvider === 'VNPay') {
                response = await paymentApi.createVNPayPayment(paymentData);
            }
            // Branch: MoMo -> call MoMo endpoint to get paymentUrl
            else if (selectedMethod === 'e_wallet' && selectedProvider === 'MoMo') {
                response = await paymentApi.createMoMoPayment(paymentData);
            }
          
            else {
                response = await paymentApi.createPayment(paymentData);
            }

            // If VNPay or MoMo, expect { paymentUrl } and redirect
            if (selectedMethod === 'e_wallet' && (selectedProvider === 'VNPay' || selectedProvider === 'MoMo')) {
                const paymentUrl = response?.data?.paymentUrl;
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                }
            }

            // Cash and other methods
            if (selectedMethod === 'cash') {
                alert('Đặt xe thành công! Vui lòng thanh toán tiền mặt khi nhận xe.');
                navigate('/thue-xe-tu-lai');
            } else {
                alert('Thanh toán thành công! Đặt xe hoàn tất.');
                navigate('/thue-xe-tu-lai');
            }
        } catch (err) {
            console.error('Payment error:', err);
            const errorMessage = (err as any)?.response?.data?.error || (err as any)?.error || (err as any)?.message || 'Thanh toán thất bại. Vui lòng thử lại.';
            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMethodSelect = (methodId: string) => {
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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!bookingData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

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

                    <div className="lg:col-span-2 space-y-6">

                        <BookingInfoCard
                            bookingId={bookingId || ''}
                            startDate={(bookingData as any)?.start_date}
                            endDate={(bookingData as any)?.end_date}
                            totalAmount={(bookingData as any)?.total_amount}
                            renterName={(renterInfo as any)?.name}
                            renterPhone={(renterInfo as any)?.phone}
                            renterEmail={(renterInfo as any)?.email}
                            renterNote={(renterInfo as any)?.note}
                        />


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
                                            method={method as any}
                                            isSelected={selectedMethod === method.id}
                                            onSelect={handleMethodSelect as any}
                                        />
                                    ))}
                                </div>


                                {selectedMethodOption?.providers && (
                                    <ProviderSelection
                                        providers={selectedMethodOption.providers}
                                        selectedProvider={selectedProvider}
                                        onProviderChange={setSelectedProvider}
                                    />
                                )}


                                {selectedMethod === 'cash' && <CashPaymentInfo />}
                            </div>
                        </div>
                    </div>


                    <div className="lg:col-span-1">
                        <PaymentSummaryCard
                            totalAmount={(bookingData as any)?.total_amount}
                            selectedMethod={selectedMethod as any}
                            isProcessing={isProcessing}
                            onSubmit={handleSubmitPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
