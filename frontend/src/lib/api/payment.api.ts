import { axiosClient } from '@/lib/axios';

export const paymentApi = {
    // Qua API Gateway: baseURL = http://localhost:8000/api, path = /v1/payments
    createPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => axiosClient.post('/v1/payments', data),

    // VNPay: create payment and receive redirect URL
    createVNPayPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => axiosClient.post('/v1/payments/vnpay', data),

    // MoMo: create payment and receive redirect URL
    createMoMoPayment: (data: {
        booking_id: string;
        amount: number;
        type: 'rental_fee' | 'deposit' | 'extra_fee' | 'refund';
        payment_method?: 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
        provider?: string;
        description?: string;
    }) => axiosClient.post('/v1/payments/momo', data),

    getPayment: (id: string) => axiosClient.get(`/v1/payments/${id}`),

    getPaymentsByUser: (userId: string, params?: { status?: string; limit?: number; offset?: number }) =>
        axiosClient.get(`/v1/payments/user/${userId}`, { params }),

    updatePaymentStatus: (id: string, status: string, failure_reason?: string) =>
        axiosClient.put(`/v1/payments/${id}/status`, { status, failure_reason }),

    refundPayment: (id: string, reason?: string) =>
        axiosClient.post(`/v1/payments/${id}/refund`, { reason }),

    confirmCashPayment: (id: string) => axiosClient.post(`/v1/payments/${id}/cash/confirm`),
};

