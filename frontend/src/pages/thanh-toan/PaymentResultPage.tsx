import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { bookingApi } from '@/lib/api/booking.api'
import { vehicleApi } from '@/lib/api/vehicle.api'

export default function PaymentResultPage() {
    const { search } = useLocation()
    const navigate = useNavigate()

    const params = useMemo(() => new URLSearchParams(search), [search])
    const status = params.get('status') || 'unknown'
    const paymentId = params.get('paymentId') || ''
    const bookingId = params.get('bookingId') || ''
    const amount = params.get('amount') || ''

    const [renterInfo, setRenterInfo] = useState<{ name?: string; phone?: string; email?: string; note?: string }>({})

    useEffect(() => {
        if (!bookingId) return
        try {
            const raw = localStorage.getItem(`booking:renter:${bookingId}`)
            if (raw) setRenterInfo(JSON.parse(raw))
        } catch (_) { }
    }, [bookingId])

    const isSuccess = status === 'success'

    const { data: bookingData } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => bookingApi.getBooking(bookingId),
        select: (res) => res.data,
        enabled: !!bookingId,
        retry: false,
    })

    const { data: vehicleData } = useQuery({
        queryKey: ['vehicle', bookingData?.vehicle_id],
        queryFn: () => vehicleApi.getVehicle(bookingData?.vehicle_id),
        select: (res) => res.data,
        enabled: !!bookingData?.vehicle_id,
        retry: false,
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h1 className={`text-2xl font-bold ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </h1>
                {(vehicleData?.thumbnailUrl || vehicleData?.displayName) && (
                    <div className="mt-5 flex items-center gap-4 text-left bg-gray-50 p-4 rounded-xl">
                        {vehicleData?.thumbnailUrl && (
                            <img src={vehicleData.thumbnailUrl} alt={vehicleData.displayName}
                                className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div>
                            {vehicleData?.displayName && <div className="font-bold text-gray-900">{vehicleData.displayName}</div>}
                            {vehicleData?.brand?.displayName && <div className="text-sm text-gray-600">{vehicleData.brand.displayName}</div>}
                        </div>
                    </div>
                )}
                <div className="mt-4 text-gray-700 space-y-1">
                    {paymentId && <p>Mã giao dịch: <b>{paymentId}</b></p>}
                    {bookingId && <p>Mã đặt chỗ: <b>{bookingId}</b></p>}
                    {amount && <p>Số tiền: <b>{amount} VND</b></p>}
                </div>
                {(renterInfo.name || renterInfo.phone || renterInfo.email || renterInfo.note) && (
                    <div className="mt-5 text-gray-700 bg-gray-50 rounded-lg p-4 text-left">
                        <div className="font-semibold text-gray-900 mb-2">Thông tin người thuê</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            {renterInfo.name && <div><span className="text-gray-500">Tên: </span><span className="font-medium text-gray-800">{renterInfo.name}</span></div>}
                            {renterInfo.phone && <div><span className="text-gray-500">SĐT: </span><span className="font-medium text-gray-800">{renterInfo.phone}</span></div>}
                            {renterInfo.email && (
                                <div>
                                    <span className="text-gray-500">Email: </span>
                                    <span className="font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis" title={renterInfo.email}>
                                        {renterInfo.email}
                                    </span>
                                </div>
                            )}
                        </div>
                        {renterInfo.note && (
                            <div className="mt-2 text-sm">
                                <span className="text-gray-500">Ghi chú: </span>
                                <span className="text-gray-800">{renterInfo.note}</span>
                            </div>
                        )}
                    </div>
                )}
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


