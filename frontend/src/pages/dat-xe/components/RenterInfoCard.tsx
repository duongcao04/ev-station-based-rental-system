import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface RenterInfoCardProps {
    renterName: string;
    renterPhone: string;
    renterEmail: string;
    renterNote?: string;
    onChange: (fields: { renterName?: string; renterPhone?: string; renterEmail?: string; renterNote?: string }) => void;
}

// Validation functions
const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export function RenterInfoCard({ renterName, renterPhone, renterEmail, renterNote = '', onChange }: RenterInfoCardProps) {
    const [phoneError, setPhoneError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [phoneTouched, setPhoneTouched] = useState<boolean>(false);
    const [emailTouched, setEmailTouched] = useState<boolean>(false);


    useEffect(() => {
        if (phoneTouched) {
            if (!renterPhone) {
                setPhoneError('Vui lòng nhập số điện thoại');
            } else if (!validatePhone(renterPhone)) {
                setPhoneError('Số điện thoại phải đúng 10 số và bắt đầu từ số 0');
            } else {
                setPhoneError('');
            }
        }
    }, [renterPhone, phoneTouched]);


    useEffect(() => {
        if (emailTouched) {
            if (!renterEmail) {
                setEmailError('Vui lòng nhập email');
            } else if (!validateEmail(renterEmail)) {
                setEmailError('Email không đúng định dạng');
            } else {
                setEmailError('');
            }
        }
    }, [renterEmail, emailTouched]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        const numericValue = value.replace(/\D/g, '');
        onChange({ renterPhone: numericValue });

        if (phoneTouched) {
            if (!numericValue) {
                setPhoneError('Vui lòng nhập số điện thoại');
            } else if (!validatePhone(numericValue)) {
                setPhoneError('Số điện thoại phải đúng 10 số và bắt đầu từ số 0');
            } else {
                setPhoneError('');
            }
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange({ renterEmail: value });
        if (emailTouched) {
            if (!value) {
                setEmailError('Vui lòng nhập email');
            } else if (!validateEmail(value)) {
                setEmailError('Email không đúng định dạng');
            } else {
                setEmailError('');
            }
        }
    };

    const handlePhoneBlur = () => {
        setPhoneTouched(true);
    };

    const handleEmailBlur = () => {
        setEmailTouched(true);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">Thông tin người thuê</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Tên người thuê xe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                            value={renterName}
                            onChange={(e) => onChange({ renterName: e.target.value })}
                            placeholder="Nhập họ tên"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${phoneError && phoneTouched
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:border-emerald-600'
                                }`}
                            value={renterPhone}
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
                            placeholder="0123456789"
                            required
                            maxLength={10}
                        />
                        {phoneError && phoneTouched && (
                            <div className="mt-1 flex items-center gap-1 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{phoneError}</span>
                            </div>
                        )}
                        {!phoneError && phoneTouched && renterPhone && validatePhone(renterPhone) && (
                            <div className="mt-1 text-green-500 text-sm">Số điện thoại hợp lệ</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${emailError && emailTouched
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:border-emerald-600'
                                }`}
                            value={renterEmail}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            placeholder="example@email.com"
                            required
                        />
                        {emailError && emailTouched && (
                            <div className="mt-1 flex items-center gap-1 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{emailError}</span>
                            </div>
                        )}
                        {!emailError && emailTouched && renterEmail && validateEmail(renterEmail) && (
                            <div className="mt-1 text-green-500 text-sm">Email hợp lệ</div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Ghi chú</label>
                    <textarea
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                        rows={3}
                        value={renterNote}
                        onChange={(e) => onChange({ renterNote: e.target.value })}
                        placeholder="Ghi chú thêm (tuỳ chọn)"
                    />
                </div>
            </div>
        </div>
    );
}


