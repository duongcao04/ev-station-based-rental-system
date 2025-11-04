import { PaymentModel } from '../models/PaymentModel.js';
import { createMoMoService } from '../services/MoMoService.js';


export const createPaymentMomo = async (req, res) => {
    const { booking_id, amount, type, payment_method, provider, description } = req.body;
    const user_id = req.user?.id;


    if (!booking_id || !amount || !type) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    try {
        const { createPaymentUrl } = createMoMoService();

        const payment = await PaymentModel.create({
            booking_id,
            user_id,
            amount,
            type,
            payment_method,
            provider,
            description,
            status: 'init'
        });

        const rawId = String(payment.payment_id);
        const orderId = rawId.replace(/-/g, ''); 
        const paymentUrl = await createPaymentUrl(
            amount,
            orderId,
            `Thanh toán cho đơn đặt ${booking_id}`
        );

        res.status(201).json({
            message: 'Payment created successfully',
            paymentUrl,
        });
    } catch (error) {
        console.error('createPayment error:', error);
        const message = (error && (error.message || error.error)) || 'Internal server error';
        res.status(500).json({ error: message });
    }
};


export const handleMomoReturn = async (req, res) => {
    const momoParams = req.query;

    try {
        const { verifyPayment } = createMoMoService();
        const isValid = await verifyPayment(momoParams);

        if (isValid && momoParams.resultCode === '0') {
           
            const ref = String(momoParams.orderId || '');
            const paymentId = ref.length === 32
                ? `${ref.substring(0, 8)}-${ref.substring(8, 12)}-${ref.substring(12, 16)}-${ref.substring(16, 20)}-${ref.substring(20)}`
                : ref;
            const payment = await PaymentModel.getById(paymentId);
            if (payment) {
                await PaymentModel.updateStatus(payment.payment_id, 'succeeded', {
                    processed_at: new Date(),
                    completed_at: new Date()
                });
                const feBase = process.env.PAYMENT_RETURN_URL || 'http://localhost:5173';
                const redirectUrl = `${feBase}/thanh-toan/ket-qua?status=success&paymentId=${encodeURIComponent(payment.payment_id)}&bookingId=${encodeURIComponent(payment.booking_id)}&amount=${encodeURIComponent(payment.amount)}`;
                return res.redirect(302, redirectUrl);
            } else {
                const feBase = process.env.PAYMENT_RETURN_URL || 'http://localhost:5173';
                const redirectUrl = `${feBase}/thanh-toan/ket-qua?status=not_found`;
                return res.redirect(302, redirectUrl);
            }
        } else {
            const feBase = process.env.PAYMENT_RETURN_URL || 'http://localhost:5173';
            const redirectUrl = `${feBase}/thanh-toan/ket-qua?status=failed`;
            return res.redirect(302, redirectUrl);
        }
    } catch (error) {
        console.error('Error processing MoMo return:', error);
        const message = (error && (error.message || error.error)) || 'Internal server error';
        res.status(500).json({ error: message });
    }
};

export const handleMomoNotify = async (req, res) => {
    const momoParams = req.body; // IPN dùng POST body, không phải query

    try {
        const { verifyPayment } = createMoMoService();
        const isValid = await verifyPayment(momoParams);

        if (isValid && momoParams.resultCode === '0') {
            // Reconstruct UUID from 32-char hex if needed
            const ref = String(momoParams.orderId || '');
            const paymentId = ref.length === 32
                ? `${ref.substring(0, 8)}-${ref.substring(8, 12)}-${ref.substring(12, 16)}-${ref.substring(16, 20)}-${ref.substring(20)}`
                : ref;
            const payment = await PaymentModel.getById(paymentId);
            if (payment && payment.status !== 'succeeded') {
                await PaymentModel.updateStatus(payment.payment_id, 'succeeded', {
                    processed_at: new Date(),
                    completed_at: new Date()
                });
                console.log(`MoMo IPN: Payment ${paymentId} updated to succeeded`);
            }
            // Trả về thành công cho MoMo
            return res.status(200).json({ message: 'Success' });
        } else {
            console.error('MoMo IPN: Invalid payment or failed resultCode');
            return res.status(400).json({ message: 'Invalid payment' });
        }
    } catch (error) {
        console.error('Error processing MoMo IPN:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

