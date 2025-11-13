import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { vehicleApi } from '@/lib/api/vehicle.api';
import { bookingApi } from '@/lib/api/booking.api';
import { stationApi } from '@/lib/api/station.api';
import { ArrowLeft } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';
import { Button } from '@/components/ui/button';
import { StationSelectionCard } from './components/StationSelectionCard';
import { DateRangeCard } from './components/DateRangeCard';
import { BookingSummaryCard } from './components/BookingSummaryCard';
import { LoadingState } from './components/LoadingState';
import { RenterInfoCard } from './components/RenterInfoCard';
import { cookie } from '@/lib/cookie';

export default function CreateBookingPage() {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const navigate = useNavigate();

    // Form state
    const [startStation, setStartStation] = useState<string>('');
    const [endStation, setEndStation] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [renterName, setRenterName] = useState<string>('');
    const [renterPhone, setRenterPhone] = useState<string>('');
    const [renterEmail, setRenterEmail] = useState<string>('');
    const [renterNote, setRenterNote] = useState<string>('');

    // Get vehicle details
    const { data: vehicles, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => vehicleApi.getVehicles(),
        select: (res) => res.data,
        retry: false,
    });

    // Get stations that have this vehicle (điểm nhận xe) - chỉ các trạm có xe này
    const { data: pickupStationsData, isLoading: isLoadingPickupStations } = useQuery({
        queryKey: ['pickup-stations', vehicleId],
        queryFn: () => stationApi.getStationsByVehicleId(vehicleId!),
        select: (res) => res.data,
        retry: false,
        enabled: !!vehicleId, // Chỉ fetch khi có vehicleId
    });

    // Get all stations (điểm trả xe) - có thể trả ở bất kỳ trạm nào
    const { data: returnStationsData, isLoading: isLoadingReturnStations } = useQuery({
        queryKey: ['return-stations'],
        queryFn: () => stationApi.getAllStations(),
        select: (res) => res.data,
        retry: false,
    });

    const vehicle = vehicles?.find((v) => v.id === vehicleId);

    // Map pickup stations (chỉ các trạm có xe này)
    const pickupStations = pickupStationsData
        ? (Array.isArray(pickupStationsData) ? pickupStationsData : []).map((station: any) => ({
            id: station.user_id, // user_id là UUID và là primary key
            name: station.display_name || station.address || `Station ${station.user_id?.substring(0, 8)}`,
        }))
        : [];

    // Map return stations (tất cả các trạm)
    const returnStations = returnStationsData
        ? (Array.isArray(returnStationsData) ? returnStationsData : []).map((station: any) => ({
            id: station.user_id, // user_id là UUID và là primary key
            name: station.display_name || station.address || `Station ${station.user_id?.substring(0, 8)}`,
        }))
        : [];

    // Calculate total amount when dates or vehicle changes
    useEffect(() => {
        if (dateRange[0] && dateRange[1] && vehicle) {
            const days = dateRange[1].diff(dateRange[0], 'day') + 1;
            const price = vehicle.salePrice || vehicle.regularPrice;
            setTotalAmount(days * Number(price));
        }
    }, [dateRange, vehicle]);

    // Log errors
    useEffect(() => {
        if (error) {
            console.error('Error loading vehicles:', error);
        }
    }, [error]);

    // Prefill renter info from login token if available
    useEffect(() => {
        const token = cookie.get('authentication');
        if (!token || typeof token !== 'string') return;
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                const json = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
                const name = json.name || json.fullName || json.username || '';
                const email = json.email || '';
                if (name && !renterName) setRenterName(name);
                if (email && !renterEmail) setRenterEmail(email);
            }
        } catch (_) {
            // ignore decode errors
        }
    }, []);

    // Create booking mutation
    const createBookingMutation = useMutation({
        mutationFn: (data: Parameters<typeof bookingApi.createBooking>[0]) => {
            return bookingApi.createBooking(data);
        },
        onSuccess: (response) => {
            console.log('Booking created:', response.data);
            const bookingId = response.data?.booking_id;
            if (bookingId) {
                try {
                    const renter = { name: renterName, phone: renterPhone, email: renterEmail, note: renterNote };
                    localStorage.setItem(`booking:renter:${bookingId}`, JSON.stringify(renter));
                } catch (_) { }
                navigate(`/thanh-toan/${bookingId}`);
            } else {
                alert('Đặt xe thành công!');
                navigate('/thue-xe-tu-lai');
            }
        },
        onError: (error: any) => {
            console.error('Booking error:', error);
            alert(error?.response?.data?.error || 'Đặt xe thất bại. Vui lòng thử lại.');
        },
    });


    // Validation functions
    const validatePhone = (phone: string): boolean => {
        // Kiểm tra số điện thoại phải đúng 10 số và bắt đầu từ số 0
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const validateEmail = (email: string): boolean => {
        // Kiểm tra email đúng format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        if (!vehicleId || !startStation || !endStation || !dateRange[0] || !dateRange[1]) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!renterName || !renterPhone || !renterEmail) {
            alert('Vui lòng điền đầy đủ Thông tin người đặt (Họ tên, SĐT, Email).');
            return;
        }

        // Validate phone number
        if (!validatePhone(renterPhone)) {
            alert('Số điện thoại phải đúng 10 số và bắt đầu từ số 0');
            return;
        }

        // Validate email
        if (!validateEmail(renterEmail)) {
            alert('Email không đúng định dạng');
            return;
        }

        const bookingData = {
            vehicle_id: vehicleId,
            start_station_id: startStation,
            end_station_id: endStation,
            start_date: dateRange[0].toISOString(),
            end_date: dateRange[1].toISOString(),
            total_amount: totalAmount,
            calculated_price_details: {
                pricing_type: 'daily',
                price_per_day: vehicle?.salePrice || vehicle?.regularPrice,
                duration_days: dateRange[1].diff(dateRange[0], 'day') + 1,
                base_cost: totalAmount,
                deposit: vehicle?.depositPrice || 0,
            },
        };

        console.log('Submitting booking:', bookingData);
        createBookingMutation.mutate(bookingData);
    };

    // Disable past dates
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().startOf('day');
    };

    // Loading state
    if (isLoading || isLoadingPickupStations || isLoadingReturnStations) {
        return <LoadingState />;
    }

    // Return null if vehicle not found
    if (!vehicle) {
        return null;
    }

    // Main booking form
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with back button */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-white/80">
                        <ArrowLeft className="mr-2" size={20} />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">Đặt xe thuê</h1>
                        <p className="text-gray-600 mt-1">Hoàn thành thông tin đặt xe của bạn</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Replace vehicle info with renter info */}
                        <RenterInfoCard
                            renterName={renterName}
                            renterPhone={renterPhone}
                            renterEmail={renterEmail}
                            renterNote={renterNote}
                            onChange={({ renterName: n, renterPhone: p, renterEmail: e, renterNote: note }) => {
                                if (typeof n === 'string') setRenterName(n);
                                if (typeof p === 'string') setRenterPhone(p);
                                if (typeof e === 'string') setRenterEmail(e);
                                if (typeof note === 'string') setRenterNote(note);
                            }}
                        />

                        <StationSelectionCard
                            startStation={startStation}
                            endStation={endStation}
                            pickupStations={pickupStations}
                            returnStations={returnStations}
                            isLoadingPickupStations={isLoadingPickupStations}
                            isLoadingReturnStations={isLoadingReturnStations}
                            onStartStationChange={setStartStation}
                            onEndStationChange={setEndStation}
                        />

                        <DateRangeCard
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            disabledDate={disabledDate}
                        />
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <BookingSummaryCard
                            vehicle={vehicle}
                            dateRange={dateRange}
                            totalAmount={totalAmount}
                            onSubmit={handleSubmit}
                            isSubmitting={createBookingMutation.isPending}
                            isDisabled={!startStation || !endStation || !dateRange[0] || !dateRange[1] || totalAmount === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
