import { bookingAxiosClient } from '@/lib/axios';

export const bookingApi = {
    // Create new booking
    createBooking: (data: {
        vehicle_id: string;
        start_station_id: string;
        end_station_id: string;
        start_date: string;
        end_date: string;
        total_amount: number;
        calculated_price_details?: any;
        payment_id?: string;
    }) => bookingAxiosClient.post('/v1/bookings', data),

    // Get booking by ID
    getBooking: (id: string) => bookingAxiosClient.get(`/v1/bookings/${id}`),

    // Get my bookings
    getMyBookings: () => bookingAxiosClient.get('/v1/bookings/me/history'),

    // Cancel booking
    cancelBooking: (id: string) => bookingAxiosClient.put(`/v1/bookings/${id}/cancel`),

    // Staff/Admin: Get all bookings
    getAllBookings: (params?: { status?: string; station_id?: string; limit?: number; offset?: number }) =>
        bookingAxiosClient.get('/v1/bookings/all', { params }),

    // Staff: Check-in booking
    checkinBooking: (id: string) => bookingAxiosClient.put(`/v1/bookings/${id}/checkin`),

    // Staff: Return vehicle
    returnVehicle: (id: string, data: {
        actual_return_date: string;
        actual_return_station_id: string;
        penalty_fee?: number;
    }) => bookingAxiosClient.put(`/v1/bookings/${id}/return`, data),
};

