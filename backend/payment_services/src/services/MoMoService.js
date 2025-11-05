import axios from 'axios';
import crypto from 'crypto';

function createMoMoService() {
    const required = ['MOMO_PARTNER_CODE', 'MOMO_ACCESS_KEY', 'MOMO_SECRET_KEY', 'MOMO_RETURN_URL', 'MOMO_NOTIFY_URL'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) {
        const message = `Missing MoMo env: ${missing.join(', ')}`;
        console.error(message);
        throw new Error(message);
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction
        ? 'https://payment.momo.vn'
        : 'https://test-payment.momo.vn';

    const createPaymentUrl = async (
        amount,
        orderId,
        orderInfo = 'Thanh toán đơn hàng',
        requestType = 'captureWallet'
    ) => {
        try {
            const numericAmount = Number(amount);
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                throw new Error('Invalid amount value');
            }

            const partnerCode = process.env.MOMO_PARTNER_CODE;
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretKey = process.env.MOMO_SECRET_KEY;

            const rawSignature = `accessKey=${accessKey}&amount=${Math.round(numericAmount)}&extraData=&ipnUrl=${process.env.MOMO_NOTIFY_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${process.env.MOMO_RETURN_URL}&requestId=${orderId}&requestType=${requestType}`;

            const signature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

           
            const requestBody = {
                partnerCode: partnerCode,
                partnerName: process.env.MOMO_PARTNER_NAME || 'Test',
                storeId: process.env.MOMO_STORE_ID || 'MomoTestStore',
                requestId: orderId,
                amount: Math.round(numericAmount),
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: process.env.MOMO_RETURN_URL,
                ipnUrl: process.env.MOMO_NOTIFY_URL,
                lang: 'vi',
                extraData: '',
                requestType: requestType,
                signature: signature
            };

            console.log('MoMo Payment Request:', JSON.stringify(requestBody, null, 2));

            const response = await axios.post(`${baseUrl}/v2/gateway/api/create`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.payUrl) {
                return response.data.payUrl;
            } else {
                throw new Error('MoMo did not return a payment URL');
            }
        } catch (error) {
            console.error('Error generating MoMo payment URL:', error);
            if (error.response) {
                console.error('MoMo API Error:', error.response.data);
            }
            throw error;
        }
    };

    const verifyPayment = async (momoParams) => {
        try {
            const params = { ...momoParams };
            const signature = String(params.signature || '');
            delete params.signature;

            const sortedKeys = Object.keys(params).sort();
            const rawSignature = sortedKeys
                .map((key) => `${key}=${params[key]}`)
                .join('&');

            // Create signature using HMAC SHA256
            const hmac = crypto.createHmac('sha256', process.env.MOMO_SECRET_KEY || '');
            const signed = hmac.update(rawSignature).digest('hex');

            return signed.toLowerCase() === signature.toLowerCase();
        } catch (error) {
            console.error('Error verifying MoMo payment:', error);
            throw error;
        }
    };

    return { createPaymentUrl, verifyPayment };
}

export { createMoMoService };

