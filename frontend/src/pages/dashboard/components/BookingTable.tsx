import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatVNDCurrency } from '@/lib/number';

export function BookingTable({ bookings, isLoading, error, onRetry }: any) {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    border: '3px solid #f3f4f6',
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '16px', color: '#666' }}>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
                <p>{error}</p>
                <button
                    onClick={onRetry}
                    style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>Không tìm thấy booking nào</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Mã Booking</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>User ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Vehicle ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Ngày bắt đầu</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Ngày kết thúc</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Tổng tiền</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Trạng thái</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking: any) => (
                            <tr key={booking.booking_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>
                                    {booking.booking_id ? booking.booking_id.substring(0, 8).toUpperCase() : '-'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                    {booking.user_id || '-'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>
                                    {booking.vehicle_id ? booking.vehicle_id.substring(0, 8).toUpperCase() : '-'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                    {formatDate(booking.start_date)}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                    {formatDate(booking.end_date)}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>
                                    {formatVNDCurrency(booking.total_amount || 0)}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <StatusBadge status={booking.status} />
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => navigate(`/dashboard/bookings/${booking.booking_id}`)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}
