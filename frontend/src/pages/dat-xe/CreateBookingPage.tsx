import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { vehicleApi } from '@/lib/api/vehicle.api';
import { bookingApi } from '@/lib/api/booking.api';
import { ArrowLeft } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';
import { Button } from '@/components/ui/button';
import { VehicleInfoCard } from './components/VehicleInfoCard';
import { StationSelectionCard } from './components/StationSelectionCard';
import { DateRangeCard } from './components/DateRangeCard';
import { BookingSummaryCard } from './components/BookingSummaryCard';
import { LoadingState } from './components/LoadingState';

export default function CreateBookingPage() {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const navigate = useNavigate();

    // Form state
    const [startStation, setStartStation] = useState<string>('');
    const [endStation, setEndStation] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    // Get vehicle details
    const { data: vehicles, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => vehicleApi.getVehicles(),
        select: (res) => res.data,
        retry: false,
    });

    const vehicle = vehicles?.find((v) => v.id === vehicleId);

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

    // Create booking mutation
    const createBookingMutation = useMutation({
        mutationFn: (data: Parameters<typeof bookingApi.createBooking>[0]) => {
            return bookingApi.createBooking(data);
        },
        onSuccess: (response) => {
            console.log('Booking created:', response.data);
            alert('Đặt xe thành công!');
            navigate('/thue-xe-tu-lai');
        },
        onError: (error: any) => {
            console.error('Booking error:', error);
            alert(error?.response?.data?.error || 'Đặt xe thất bại. Vui lòng thử lại.');
        },
    });

    // Mock stations
    const stations = [
        { id: 'station-001', name: 'Ga Hà Nội' },
        { id: 'station-002', name: 'Ga TP.HCM' },
        { id: 'station-003', name: 'Ga Đà Nẵng' },
    ];

    const handleSubmit = async () => {
        if (!vehicleId || !startStation || !endStation || !dateRange[0] || !dateRange[1]) {
            alert('Vui lòng điền đầy đủ thông tin');
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
    if (isLoading) {
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
                        <VehicleInfoCard vehicle={vehicle} />

                        <StationSelectionCard
                            startStation={startStation}
                            endStation={endStation}
                            stations={stations}
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
