import { bookingAxiosClient } from '@/lib/axios';

export const bookingApi = {
  
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


    getBooking: (id: string) => bookingAxiosClient.get(`/v1/bookings/${id}`),

   
    getMyBookings: () => bookingAxiosClient.get('/v1/bookings/me/history'),

    
    cancelBooking: (id: string) => bookingAxiosClient.put(`/v1/bookings/${id}/cancel`),


    getAllBookings: (params?: { status?: string; station_id?: string; limit?: number; offset?: number }) =>
        bookingAxiosClient.get('/v1/bookings/all', { params }),

 
    checkinBooking: (id: string) => bookingAxiosClient.put(`/v1/bookings/${id}/checkin`),


    returnVehicle: (id: string, data: {
        actual_return_date: string;
        actual_return_station_id: string;
        penalty_fee?: number;
    }) => bookingAxiosClient.put(`/v1/bookings/${id}/return`, data),
};

