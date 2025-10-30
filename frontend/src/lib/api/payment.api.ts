import { paymentAxiosClient } from '@/lib/axios';

export const paymentApi = {
    // Create new payment
    createPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => paymentAxiosClient.post('/v1/payments', data),

    // Get payment by ID
    getPayment: (id: string) => paymentAxiosClient.get(`/v1/payments/${id}`),

    // Get payments by user
    getPaymentsByUser: (userId: string, params?: { status?: string; limit?: number; offset?: number }) =>
        paymentAxiosClient.get(`/v1/payments/user/${userId}`, { params }),

    // Update payment status (Staff/Admin)
    updatePaymentStatus: (id: string, status: string, failure_reason?: string) =>
        paymentAxiosClient.put(`/v1/payments/${id}/status`, { status, failure_reason }),

    // Refund payment (Staff/Admin)
    refundPayment: (id: string, reason?: string) =>
        paymentAxiosClient.post(`/v1/payments/${id}/refund`, { reason }),

    // Confirm cash payment (Staff/Admin)
    confirmCashPayment: (id: string) => paymentAxiosClient.post(`/v1/payments/${id}/cash/confirm`),
};

