import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { bookingApi } from '@/lib/api/booking.api'
import { vehicleApi } from '@/lib/api/vehicle.api'

interface BookingData {
    booking_id: string
    vehicle_id: string
    start_date: string
    end_date: string
    total_amount: number
    status: string
    [key: string]: any
}

interface VehicleData {
    id: string
    displayName: string
    thumbnailUrl?: string
    brand?: {
        displayName: string
    }
    [key: string]: any
}

export default function PaymentResultPage() {
    const { search } = useLocation()
    const navigate = useNavigate()

    const params = useMemo(() => new URLSearchParams(search), [search])
    const status = params.get('status') || 'unknown'
    const paymentId = params.get('paymentId') || ''
    const bookingId = params.get('bookingId') || ''
    const amount = params.get('amount') || ''

    const [renterInfo, setRenterInfo] = useState<{ name?: string; phone?: string; email?: string; note?: string }>({})
    const [syncAttempted, setSyncAttempted] = useState(false)
    const [bookingData, setBookingData] = useState<BookingData | null>(null)
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)
    const [loadingBooking, setLoadingBooking] = useState(true)
    const [loadingVehicle, setLoadingVehicle] = useState(false)
    const [syncingPayment, setSyncingPayment] = useState(false)

    const isSuccess = status === 'success'

    // Load renter info from localStorage
    useEffect(() => {
        if (!bookingId) return
        try {
            const raw = localStorage.getItem(`booking:renter:${bookingId}`)
            if (raw) setRenterInfo(JSON.parse(raw))
        } catch (_) { }
    }, [bookingId])


    useEffect(() => {
        if (!bookingId) {
            setLoadingBooking(false)
            return
        }

        const loadBookingData = async () => {
            try {
                const response = await bookingApi.getBooking(bookingId)
                setBookingData(response.data)
            } catch (error) {
                console.error('Error loading booking:', error)
            } finally {
                setLoadingBooking(false)
            }
        }

        loadBookingData()
    }, [bookingId])

    // Load vehicle data khi có booking data
    useEffect(() => {
        if (!bookingData?.vehicle_id) return

        setLoadingVehicle(true)
        const loadVehicleData = async () => {
            try {
                const response = await vehicleApi.getVehicle(bookingData.vehicle_id)
                setVehicleData(response.data)
            } catch (error) {
                console.error('Error loading vehicle:', error)
            } finally {
                setLoadingVehicle(false)
            }
        }

        loadVehicleData()
    }, [bookingData?.vehicle_id])


    useEffect(() => {
        if (isSuccess && bookingId && paymentId && !syncAttempted) {
            setSyncAttempted(true)
            setSyncingPayment(true)

            const syncPayment = async () => {
                try {
                    await bookingApi.updateBookingPayment(bookingId, paymentId)
                    console.log('Payment ID synced with booking successfully')

                    try {
                        const bookingResponse = await bookingApi.getBooking(bookingId)
                        setBookingData(bookingResponse.data)
                        console.log('Booking data reloaded with payment_id')
                    } catch (bookingError) {
                        console.error('Failed to reload booking:', bookingError)
                    } finally {
                        setSyncingPayment(false)
                    }
                } catch (error) {
                    console.error('Failed to sync payment with booking:', error)

                    setTimeout(async () => {
                        try {
                            await bookingApi.updateBookingPayment(bookingId, paymentId)
                            const bookingResponse = await bookingApi.getBooking(bookingId)
                            setBookingData(bookingResponse.data)
                        } catch (retryError) {
                            console.error('Retry sync failed:', retryError)
                        } finally {
                            setSyncingPayment(false)
                        }
                    }, 1000)
                }
            }

            syncPayment()
        }
    }, [isSuccess, bookingId, paymentId, syncAttempted])


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h1 className={`text-2xl font-bold ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </h1>
                {loadingVehicle ? (
                    <div className="mt-5 flex items-center gap-4 text-left bg-gray-50 p-4 rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                        <div className="text-gray-600">Đang tải thông tin ...</div>
                    </div>
                ) : (vehicleData?.thumbnailUrl || vehicleData?.displayName) && (
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
                    {bookingId && <p>Mã Booking: <b>{bookingId}</b></p>}
                    {amount && <p>Số tiền: <b>{amount} VND</b></p>}
                </div>
                {syncingPayment || loadingBooking ? (
                    <div className="mt-5 text-gray-700 bg-gray-50 rounded-lg p-4 text-left">
                        <div className="font-semibold text-gray-900 mb-2">Thông tin người thuê</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                            {syncingPayment ? 'Đang đồng bộ thông tin thanh toán...' : 'Đang tải thông tin...'}
                        </div>
                    </div>
                ) : (renterInfo.name || renterInfo.phone || renterInfo.email || renterInfo.note) && (
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
                    <Button onClick={() => navigate('/tai-khoan/lich-su-thue')}>Xem lịch sử thuê xe</Button>
                    {bookingId && (
                        <Button variant="secondary" onClick={() => navigate(`/tai-khoan/lich-su-thue/${bookingId}`)}>
                            Xem chi tiết booking
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}


