import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '@/lib/api/booking.api';
import { vehicleApi } from '@/lib/api/vehicle.api';
import { formatVNDCurrency } from '@/lib/number';
import { BookingInfoCard, InfoRow } from './components/BookingInfoCard';
import { StatusBadge } from './components/StatusBadge';
import { CheckinModal } from './components/CheckinModal';
import { CheckoutModal } from './components/CheckoutModal';

export default function QuanLyBookingDetailPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<any>(null);
    const [vehicle, setVehicle] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [actualReturnDate, setActualReturnDate] = useState('');
    const [actualReturnStationId, setActualReturnStationId] = useState('');
    const [penaltyFee, setPenaltyFee] = useState('');

    useEffect(() => {
        if (bookingId) {
            loadBookingDetails();
        }
    }, [bookingId]);

    const loadBookingDetails = async () => {
        if (!bookingId) return;

        try {
            setIsLoading(true);
            setError(null);

            const bookingResponse = await bookingApi.getBooking(bookingId);
            const bookingData = bookingResponse.data;
            setBooking(bookingData);

            if (bookingData.vehicle_id) {
                try {
                    const vehicleResponse = await vehicleApi.getVehicle(bookingData.vehicle_id);
                    setVehicle(vehicleResponse.data);
                } catch (err) {
                    console.error('Error loading vehicle:', err);
                }
            }
        } catch (err: any) {
            console.error('Error loading booking:', err);
            setError(err?.response?.data?.error || err?.message || 'Không thể tải thông tin booking');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckin = async () => {
        if (!bookingId) return;

        try {
            setIsProcessing(true);
            await bookingApi.checkinBooking(bookingId);
            alert('Check-in thành công!');
            setShowCheckinModal(false);
            await loadBookingDetails();
        } catch (err) {
            console.error('Error checking in:', err);
            alert((err as any)?.response?.data?.error || (err as any)?.message || 'Không thể check-in');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (!bookingId || !actualReturnDate || !actualReturnStationId) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setIsProcessing(true);
            const data: any = {
                actual_return_date: new Date(actualReturnDate).toISOString(),
                actual_return_station_id: actualReturnStationId,
            };

            if (penaltyFee) {
                data.penalty_fee = parseFloat(penaltyFee);
            }

            await bookingApi.returnVehicle(bookingId, data);
            alert('Check-out thành công!');
            setShowCheckoutModal(false);
            setActualReturnDate('');
            setActualReturnStationId('');
            setPenaltyFee('');
            await loadBookingDetails();
        } catch (err) {
            console.error('Error checking out:', err);
            alert((err as any)?.response?.data?.error || (err as any)?.message || 'Không thể check-out');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        width: '48px',
                        height: '48px',
                        border: '4px solid #f3f4f6',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ marginTop: '16px', color: '#666' }}>Đang tải...</p>
                </div>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error || 'Không tìm thấy booking'}</p>
                    <button
                        onClick={() => navigate('/dashboard/bookings')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const canCheckin = booking?.status?.toLowerCase() === 'booked';
    const canCheckout = booking?.status?.toLowerCase() === 'ongoing';

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/dashboard/bookings')}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        ← Quay lại
                    </button>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                            Chi Tiết Booking
                        </h1>
                        <p style={{ color: '#666' }}>
                            Mã booking: {booking?.booking_id?.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {canCheckin && (
                        <button
                            onClick={() => setShowCheckinModal(true)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#16a34a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Check-in
                        </button>
                    )}

                    {canCheckout && (
                        <button
                            onClick={() => setShowCheckoutModal(true)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Check-out
                        </button>
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '24px'
            }}>
                <BookingInfoCard title="Thông tin Booking">
                    <InfoRow
                        label="Mã booking"
                        value={booking?.booking_id?.substring(0, 8).toUpperCase() || '-'}
                        valueStyle={{ fontFamily: 'monospace', fontWeight: '600' }}
                    />
                    <InfoRow
                        label="Trạng thái"
                        value={<StatusBadge status={booking?.status} />}
                    />
                    <InfoRow label="Ngày bắt đầu" value={formatDate(booking?.start_date)} />
                    <InfoRow label="Ngày kết thúc" value={formatDate(booking?.end_date)} />
                    {booking?.actual_return_date && (
                        <InfoRow label="Ngày trả thực tế" value={formatDate(booking.actual_return_date)} />
                    )}
                </BookingInfoCard>

                <BookingInfoCard title="Thông tin Thanh toán">
                    <InfoRow
                        label="Tổng tiền"
                        value={formatVNDCurrency(booking?.total_amount || 0)}
                        valueStyle={{ fontWeight: '600', fontSize: '18px' }}
                    />
                    {booking?.deposit_amount && (
                        <InfoRow label="Tiền cọc" value={formatVNDCurrency(booking.deposit_amount)} />
                    )}
                    {booking?.late_fee && (
                        <InfoRow
                            label="Phí trễ"
                            value={formatVNDCurrency(booking.late_fee)}
                            valueStyle={{ color: '#ea580c' }}
                        />
                    )}
                    {booking?.refund_amount && (
                        <InfoRow
                            label="Tiền hoàn"
                            value={formatVNDCurrency(booking.refund_amount)}
                            valueStyle={{ color: '#16a34a' }}
                        />
                    )}
                    {booking?.payment_id && (
                        <InfoRow
                            label="Payment ID"
                            value={booking.payment_id.substring(0, 8).toUpperCase()}
                            valueStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                        />
                    )}
                </BookingInfoCard>

                <BookingInfoCard title="Thông tin Xe">
                    <InfoRow
                        label="Vehicle ID"
                        value={booking?.vehicle_id?.substring(0, 8).toUpperCase() || '-'}
                        valueStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    {vehicle && (
                        <>
                            <InfoRow
                                label="Tên xe"
                                value={vehicle.displayName || '-'}
                                valueStyle={{ fontWeight: '600' }}
                            />
                            {vehicle.brand && (
                                <InfoRow label="Hãng" value={vehicle.brand.displayName || '-'} />
                            )}
                            {vehicle.thumbnailUrl && (
                                <div style={{ marginTop: '16px' }}>
                                    <img
                                        src={vehicle.thumbnailUrl}
                                        alt={vehicle.displayName}
                                        style={{
                                            width: '100%',
                                            height: '192px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </BookingInfoCard>

                <BookingInfoCard title="Thông tin Trạm">
                    <InfoRow
                        label="Trạm nhận"
                        value={booking?.start_station_id?.substring(0, 8).toUpperCase() || '-'}
                        valueStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    <InfoRow
                        label="Trạm trả"
                        value={booking?.end_station_id?.substring(0, 8).toUpperCase() || '-'}
                        valueStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    {booking?.actual_return_station_id && (
                        <InfoRow
                            label="Trạm trả thực tế"
                            value={booking.actual_return_station_id.substring(0, 8).toUpperCase()}
                            valueStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                        />
                    )}
                </BookingInfoCard>
            </div>

            <BookingInfoCard title="Thông tin Khách hàng">
                <InfoRow
                    label="User ID"
                    value={booking?.user_id || '-'}
                    valueStyle={{ fontWeight: '600' }}
                />
            </BookingInfoCard>

            <CheckinModal
                isOpen={showCheckinModal}
                onClose={() => setShowCheckinModal(false)}
                onConfirm={handleCheckin}
                isProcessing={isProcessing}
            />

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onConfirm={handleCheckout}
                isProcessing={isProcessing}
                actualReturnDate={actualReturnDate}
                actualReturnStationId={actualReturnStationId}
                penaltyFee={penaltyFee}
                onActualReturnDateChange={setActualReturnDate}
                onActualReturnStationIdChange={setActualReturnStationId}
                onPenaltyFeeChange={setPenaltyFee}
            />
        </div>
    );
}
