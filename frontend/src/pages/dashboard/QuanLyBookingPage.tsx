import { useState, useEffect } from 'react';
import { bookingApi } from '@/lib/api/booking.api';
import { BookingStats } from './components/BookingStats';
import { BookingFilters } from './components/BookingFilters';
import { BookingTable } from './components/BookingTable';

export default function QuanLyBookingPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        loadBookings();
    }, [statusFilter, currentPage]);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params: any = {
                limit: itemsPerPage,
                offset: (currentPage - 1) * itemsPerPage,
            };

            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const response = await bookingApi.getAllBookings(params);
            const data = Array.isArray(response.data) ? response.data : [];
            setBookings(data);
        } catch (err: any) {
            console.error('Error loading bookings:', err);
            setError(err?.response?.data?.error || err?.message || 'Không thể tải danh sách booking');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBookings = searchQuery
        ? bookings.filter((booking) => {
            const query = searchQuery.toLowerCase();
            return (
                booking.booking_id?.toLowerCase().includes(query) ||
                booking.user_id?.toString().includes(query) ||
                booking.vehicle_id?.toLowerCase().includes(query)
            );
        })
        : bookings;

    const stats = {
        total: bookings.length,
        booked: bookings.filter((b) => b.status?.toLowerCase() === 'booked').length,
        ongoing: bookings.filter((b) => b.status?.toLowerCase() === 'ongoing').length,
        completed: bookings.filter((b) => b.status?.toLowerCase() === 'completed').length,
    };

    const handleReset = () => {
        setStatusFilter('all');
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Quản Lý Booking
                </h1>
                <p style={{ color: '#666' }}>
                    Xem và quản lý tất cả các booking trong hệ thống
                </p>
            </div>

            <BookingStats
                total={stats.total}
                booked={stats.booked}
                ongoing={stats.ongoing}
                completed={stats.completed}
            />

            <BookingFilters
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
                onReset={handleReset}
            />

            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Danh Sách Booking</h2>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        {searchQuery
                            ? `Tìm thấy: ${filteredBookings.length} booking`
                            : `Tổng cộng: ${bookings.length} booking`}
                    </p>
                </div>

                <BookingTable
                    bookings={filteredBookings}
                    isLoading={isLoading}
                    error={error}
                    onRetry={loadBookings}
                />
            </div>
        </div>
    );
}
