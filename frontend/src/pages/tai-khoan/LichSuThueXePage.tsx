import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '@/lib/api/booking.api';

export function LichSuThueXePage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await bookingApi.getMyBookings();

        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setBookings(data);
      } catch (err) {
        console.error('Error loading bookings:', err);

        const errorMessage = (err as any)?.response?.data?.error || (err as any)?.message || 'Không thể tải lịch sử thuê xe';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Hoàn thành';
      case 'ongoing':
        return 'Đang thuê';
      case 'booked':
        return 'Đã đặt';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
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

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt xe này không?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await bookingApi.cancelBooking(bookingId);
      alert('Hủy đặt xe thành công!');

      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await bookingApi.getMyBookings();
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setBookings(data);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      const errorMessage = (err as any)?.response?.data?.error || (err as any)?.message || 'Không thể hủy đặt xe';
      alert(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Lịch sử thuê xe</h2>
        <Button
          onClick={() => navigate('/thue-xe-tu-lai')}
          className='gap-2'
          style={{
            background: 'var(--color-blue-600)',
            cursor: 'pointer',
          }}
        >
          <Plus className='w-4 h-4' /> Thuê xe
        </Button>
      </div>

      {isLoading ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Đang tải lịch sử thuê xe...</p>
        </div>
      ) : error ? (
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant='outline'
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã booking</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Cọc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-center py-8 text-muted-foreground'
                  >
                    Chưa có lịch sử thuê xe nào
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.booking_id}>
                    <TableCell className='font-mono text-sm'>
                      {booking.booking_id ? booking.booking_id.substring(0, 8).toUpperCase() : '-'}
                    </TableCell>
                    <TableCell className='text-sm'>
                      {formatDate(booking.start_date)}
                    </TableCell>
                    <TableCell className='text-sm'>
                      {formatDate(booking.end_date)}
                    </TableCell>
                    <TableCell>
                      {Number(booking.total_amount).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </TableCell>
                    <TableCell>
                      {booking.deposit_amount
                        ? Number(booking.deposit_amount).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant={'outline'}
                          size='sm'
                          className='cursor-pointer'
                          onClick={() =>
                            navigate(`/tai-khoan/lich-su-thue/${booking.booking_id}`)
                          }
                          title='Xem chi tiết'
                        >
                          <EyeIcon className='w-4 h-4' />
                        </Button>
                        {(booking.status?.toLowerCase() === 'booked' || booking.status?.toLowerCase() === 'ongoing') && (
                          <Button
                            variant={'outline'}
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => handleCancelBooking(booking.booking_id)}
                            disabled={cancellingId === booking.booking_id}
                            title='Hủy đặt xe'
                          >
                            {cancellingId === booking.booking_id ? (
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
                            ) : (
                              <X className='w-4 h-4' />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
