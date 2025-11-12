import { axiosClient } from '@/lib/axios';

export const bookingApi = {
    // Qua API Gateway: baseURL = http://localhost:8000/api, path = /v1/bookings
    createBooking: (data: {
        vehicle_id: string;
        start_station_id: string;
        end_station_id: string;
        start_date: string;
        end_date: string;
        total_amount: number;
        calculated_price_details?: any;
        payment_id?: string;
    }) => axiosClient.post('/v1/bookings', data),

    getBooking: (id: string) => axiosClient.get(`/v1/bookings/${id}`),

    getMyBookings: () => axiosClient.get('/v1/bookings/me/history'),

    cancelBooking: (id: string, penalty_fee?: number) =>
        axiosClient.put(`/v1/bookings/${id}/cancel`, penalty_fee !== undefined ? { penalty_fee } : {}),

    getAllBookings: (params?: { status?: string; station_id?: string; limit?: number; offset?: number }) =>
        axiosClient.get('/v1/bookings/all', { params }),

    checkinBooking: (id: string) => axiosClient.put(`/v1/bookings/${id}/checkin`),

    returnVehicle: (id: string, data: {
        actual_return_date: string;
        actual_return_station_id: string;
        penalty_fee?: number;
    }) => axiosClient.put(`/v1/bookings/${id}/return`, data),

    updateBookingPayment: (bookingId: string, paymentId: string) =>
        axiosClient.put(`/v1/bookings/${bookingId}/payment`, { payment_id: paymentId }),
};

