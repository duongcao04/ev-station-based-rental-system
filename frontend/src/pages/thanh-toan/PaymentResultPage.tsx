import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function PaymentResultPage() {
    const { search } = useLocation()
    const navigate = useNavigate()

    const params = useMemo(() => new URLSearchParams(search), [search])
    const status = params.get('status') || 'unknown'
    const paymentId = params.get('paymentId') || ''
    const bookingId = params.get('bookingId') || ''
    const amount = params.get('amount') || ''

    const isSuccess = status === 'success'

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h1 className={`text-2xl font-bold ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </h1>
                <div className="mt-4 text-gray-700 space-y-1">
                    {paymentId && <p>Mã giao dịch: <b>{paymentId}</b></p>}
                    {bookingId && <p>Mã đặt chỗ: <b>{bookingId}</b></p>}
                    {amount && <p>Số tiền: <b>{amount} VND</b></p>}
                </div>
                <div className="mt-8 flex gap-3 justify-center">
                    <Button onClick={() => navigate('/thue-xe-tu-lai')}>Về trang thuê xe</Button>
                    {bookingId && (
                        <Button variant="secondary" onClick={() => navigate(`/thanh-toan/${bookingId}`)}>
                            Xem lại thanh toán
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}


