import { paymentAxiosClient } from '@/lib/axios';

export const paymentApi = {

    createPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => paymentAxiosClient.post('/v1/payments', data),

    // VNPay: create payment and receive redirect URL
    createVNPayPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => paymentAxiosClient.post('/v1/payments/vnpay', data),

    // MoMo: create payment and receive redirect URL
    createMoMoPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => paymentAxiosClient.post('/v1/payments/momo', data),


    getPayment: (id: string) => paymentAxiosClient.get(`/v1/payments/${id}`),


    getPaymentsByUser: (userId: string, params?: { status?: string; limit?: number; offset?: number }) =>
        paymentAxiosClient.get(`/v1/payments/user/${userId}`, { params }),


    updatePaymentStatus: (id: string, status: string, failure_reason?: string) =>
        paymentAxiosClient.put(`/v1/payments/${id}/status`, { status, failure_reason }),


    refundPayment: (id: string, reason?: string) =>
        paymentAxiosClient.post(`/v1/payments/${id}/refund`, { reason }),

    confirmCashPayment: (id: string) => paymentAxiosClient.post(`/v1/payments/${id}/cash/confirm`),
};

