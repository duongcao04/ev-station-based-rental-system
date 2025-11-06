import { VNPay } from 'vnpay';
import moment from 'moment';
import crypto from 'crypto';


function createVNPayService() {
    const required = ['VNPAY_TMN_CODE', 'VNPAY_SECURE_SECRET', 'VNPAY_HOST', 'VNPAY_RETURN_URL'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
        const message = `Missing VNPay env: ${missing.join(', ')}`;
        console.error(message);
        throw new Error(message);
    }

    const vnpay = new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE,
        secureSecret: process.env.VNPAY_SECURE_SECRET,
        vnpayHost: process.env.VNPAY_HOST,
        returnUrl: process.env.VNPAY_RETURN_URL,
        hashAlgorithm: process.env.VNPAY_HASH_ALGORITHM,
        testMode: process.env.VNPAY_TEST_MODE === 'true'
    });

    const createPaymentUrl = async (
        amount,
        txnRef,
        orderInfo = 'Thanh toán đơn hàng',
        clientIp = '127.0.0.1',
        locale = 'vn',
        orderType = 'other',
    ) => {
        try {
            const numericAmount = Number(amount);
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                throw new Error('Invalid amount value');
            }

            const createDate = moment().format('YYYYMMDDHHmmss');
            const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');

            const paymentUrl = await vnpay.buildPaymentUrl({
                vnp_Amount: Math.round(numericAmount),
                vnp_TxnRef: txnRef,
                vnp_OrderInfo: orderInfo,
                vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
                vnp_IpAddr: clientIp,
                vnp_Locale: locale,
                vnp_OrderType: orderType,
                vnp_CreateDate: createDate,
                vnp_ExpireDate: expireDate,
            });
            return paymentUrl;
        } catch (error) {
            console.error('Error generating payment URL:', error);
            throw error;
        }
    };


    const verifyPayment = async (vnpayParams) => {
        try {
            const params = { ...vnpayParams };
            const secureHash = String(params.vnp_SecureHash || '');
            delete params.vnp_SecureHash;
            delete params.vnp_SecureHashType;

            const sortedKeys = Object.keys(params).sort();
            const signData = sortedKeys
                .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`)
                .join('&');

            const algo = (process.env.VNPAY_HASH_ALGORITHM || 'SHA512').toLowerCase();
            const hmac = crypto.createHmac(algo, process.env.VNPAY_SECURE_SECRET || '');
            const signed = hmac.update(signData).digest('hex');
            return signed.toLowerCase() === secureHash.toLowerCase();
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    };

    return { createPaymentUrl, verifyPayment };
}

export { createVNPayService };
