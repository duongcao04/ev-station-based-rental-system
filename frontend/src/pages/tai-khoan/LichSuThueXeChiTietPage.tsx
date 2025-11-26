import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, CreditCard, ArrowLeft, X } from 'lucide-react';
import { bookingApi } from '@/lib/api/booking.api';
import { vehicleApi } from '@/lib/api/vehicle.api';
import { paymentApi } from '@/lib/api/payment.api';
import { stationApi } from '@/lib/api/station.api';
import { formatVNDCurrency } from '@/lib/number';
import { BookingInfoCard } from '@/pages/thanh-toan/components/BookingInfoCard';

export function LichSuThueXeChiTietPage() {
  const location = useLocation();
  const navigate = useNavigate();


  const pathParts = location.pathname.split('/');
  const bookingId = pathParts[pathParts.length - 1];

  const [bookingData, setBookingData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [renterInfo, setRenterInfo] = useState(null);
  const [startStation, setStartStation] = useState<any>(null);
  const [endStation, setEndStation] = useState<any>(null);
  const [actualReturnStation, setActualReturnStation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [stations, setStations] = useState<any[]>([]);


  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await stationApi.getAllStations();
        const stationsData = Array.isArray(response.data) ? response.data : [];
        setStations(stationsData);
      } catch (err) {
        console.error('Error loading stations list:', err);
        setStations([]);
      }
    };

    loadStations();
  }, []);

  const resolveStationName = (stationState: any, fallbackId?: string) => {
    if (stationState?.display_name) {
      return stationState.display_name;
    }

    if (!fallbackId) {
      return '-';
    }

    const matchedStation = stations.find(
      (station: any) =>
        station.station_id === fallbackId || station.user_id === fallbackId
    );

    return matchedStation?.display_name || '-';
  };

  useEffect(() => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const bookingResponse = await bookingApi.getBooking(bookingId);
        const booking = bookingResponse.data;
        setBookingData(booking);

        // Load station info
        // Lưu ý: booking.start_station_id có thể là station_id hoặc user_id
        // Thử load theo station_id trước, nếu fail thì thử user_id
        if ((booking as any)?.start_station_id) {
          try {
            // Thử get by station_id trước
            try {
              const stationResponse = await stationApi.getStationById((booking as any).start_station_id);
              console.log('Start station data (by station_id):', stationResponse.data);
              setStartStation(stationResponse.data);
            } catch (err1: any) {
              // Nếu fail (404 hoặc lỗi khác), thử get by user_id
              if (err1?.response?.status === 404) {
                const stationResponse = await stationApi.getStationByUserId((booking as any).start_station_id);
                console.log('Start station data (by user_id):', stationResponse.data);
                setStartStation(stationResponse.data);
              } else {
                throw err1;
              }
            }
          } catch (e) {
            console.error('Error loading start station:', e);
          }
        }
        if ((booking as any)?.end_station_id) {
          try {
            // Thử get by station_id trước
            try {
              const stationResponse = await stationApi.getStationById((booking as any).end_station_id);
              console.log('End station data (by station_id):', stationResponse.data);
              setEndStation(stationResponse.data);
            } catch (err1: any) {
              // Nếu fail (404 hoặc lỗi khác), thử get by user_id
              if (err1?.response?.status === 404) {
                const stationResponse = await stationApi.getStationByUserId((booking as any).end_station_id);
                console.log('End station data (by user_id):', stationResponse.data);
                setEndStation(stationResponse.data);
              } else {
                throw err1;
              }
            }
          } catch (e) {
            console.error('Error loading end station:', e);
          }
        }
        if ((booking as any)?.actual_return_station_id) {
          try {
            // Thử get by station_id trước
            try {
              const stationResponse = await stationApi.getStationById((booking as any).actual_return_station_id);
              console.log('Actual return station data (by station_id):', stationResponse.data);
              setActualReturnStation(stationResponse.data);
            } catch (err1: any) {
              // Nếu fail (404 hoặc lỗi khác), thử get by user_id
              if (err1?.response?.status === 404) {
                const stationResponse = await stationApi.getStationByUserId((booking as any).actual_return_station_id);
                console.log('Actual return station data (by user_id):', stationResponse.data);
                setActualReturnStation(stationResponse.data);
              } else {
                throw err1;
              }
            }
          } catch (e) {
            console.error('Error loading actual return station:', e);
          }
        }

        try {
          const raw = localStorage.getItem(`booking:renter:${bookingId}`);
          if (raw) {
            setRenterInfo(JSON.parse(raw));
          }
        } catch (e) {
          console.error('Error loading renter info from localStorage:', e);
        }

        if ((booking as any)?.vehicle_id) {
          try {
            const vehicleResponse = await vehicleApi.getVehicle((booking as any).vehicle_id);
            setVehicleData(vehicleResponse.data);
          } catch (e) {
            console.error('Error loading vehicle:', e);
          }
        }

        if ((booking as any)?.payment_id) {
          const loadPaymentData = async (retryCount = 0) => {
            try {
              const paymentResponse = await paymentApi.getPayment((booking as any).payment_id);
              const payment = paymentResponse.data?.payment;
              if (payment) {
                setPaymentData(payment);
                console.log('Payment data loaded:', payment.status);

                // Nếu payment status chưa phải 'succeeded' hoặc 'failed', retry (tối đa 3 lần)
                if (payment.status !== 'succeeded' && payment.status !== 'failed' && retryCount < 3) {
                  setTimeout(() => {
                    loadPaymentData(retryCount + 1);
                  }, 2000);
                }
              }
            } catch (e) {
              console.error('Error loading payment:', e);
              // Retry nếu có lỗi (tối đa 3 lần)
              if (retryCount < 3) {
                setTimeout(() => {
                  loadPaymentData(retryCount + 1);
                }, 2000);
              }
            }
          };

          loadPaymentData();
        }
      } catch (err) {
        console.error('Error loading booking details:', err);
        const errorMessage = (err as any)?.response?.data?.error || (err as any)?.message || 'Không thể tải chi tiết booking';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [bookingId]);

  const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: any) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Hoàn thành';
      case 'ongoing':
        return 'Đang thuê';
      case 'booked':
        return 'Đã đặt';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Chưa xác định';
    }
  };

  const getPaymentStatusText = (status: any) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status || 'Chưa xác định';
    }
  };

  const getPaymentStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const formatDate = (dateString: any) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getPaymentMethodText = (method: string) => {
    const methods: { [key: string]: string } = {
      'e_wallet': 'Ví điện tử',
      'cash': 'Tiền mặt',
      'credit_card': 'Thẻ tín dụng',
      'bank_transfer': 'Chuyển khoản'
    };
    return methods[method] || method || '-';
  };

  const calculateDurationDays = (startDate: any, endDate: any) => {
    if (!startDate || !endDate) return null;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return null;
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId || !bookingData) return;

    const status = (bookingData as any)?.status?.toLowerCase();
    if (status !== 'booked' && status !== 'ongoing') {
      alert('Chỉ có thể hủy booking ở trạng thái "Đã đặt" hoặc "Đang thuê"');
      return;
    }

    // Nếu đã check-in (ongoing), cần xác nhận về phí phát sinh
    let penaltyFee = 0;
    if (status === 'ongoing') {
      const penaltyInput = window.prompt(
        'Booking đã check-in. Nếu có phí phát sinh (phí hủy, phí hỏng hóc, v.v.), vui lòng nhập số tiền (VND). Để trống nếu không có phí:'
      );
      if (penaltyInput === null) {
        return; // User cancelled
      }
      penaltyFee = penaltyInput ? parseFloat(penaltyInput) || 0 : 0;
    }

    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt xe này không?')) {
      return;
    }

    try {
      setIsCancelling(true);
      const response = await bookingApi.cancelBooking(bookingId, penaltyFee > 0 ? penaltyFee : undefined);
      const breakdown = (response.data as any)?.breakdown;

      let successMessage = 'Hủy đặt xe thành công!';
      if (breakdown) {
        if (breakdown.additional_payment_required > 0) {
          successMessage += `\n\nLưu ý: Bạn cần thanh toán thêm ${formatVNDCurrency(breakdown.additional_payment_required)} do phí phát sinh vượt quá tiền cọc.`;
        } else if (breakdown.refund_amount > 0) {
          successMessage += `\n\nTiền hoàn: ${formatVNDCurrency(breakdown.refund_amount)}`;
        }
      }
      alert(successMessage);

      await new Promise(resolve => setTimeout(resolve, 500));
      const bookingResponse = await bookingApi.getBooking(bookingId);
      setBookingData(bookingResponse.data);
      // Navigate back to list
      navigate('/tai-khoan/lich-su-thue');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      const errorMessage = (err as any)?.response?.data?.error || (err as any)?.message || 'Không thể hủy đặt xe';
      alert(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải chi tiết booking...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }


  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin booking</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2" size={20} />
            Quay lại
          </Button>
          <h2 className="text-2xl font-bold">Chi tiết booking</h2>
        </div>
        {((bookingData as any)?.status?.toLowerCase() === 'booked' || (bookingData as any)?.status?.toLowerCase() === 'ongoing') && (
          <Button
            variant="outline"
            onClick={handleCancelBooking}
            disabled={isCancelling}
            className="gap-2"
          >
            {isCancelling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Đang hủy...
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                Hủy đặt xe
              </>
            )}
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-6">

        <BookingInfoCard
          bookingId={(bookingData as any)?.booking_id || ''}
          startDate={(bookingData as any)?.start_date || null}
          endDate={(bookingData as any)?.end_date || null}
          totalAmount={(bookingData as any)?.total_amount || 0}
          renterName={(renterInfo as any)?.name}
          renterPhone={(renterInfo as any)?.phone}
          renterEmail={(renterInfo as any)?.email}
          renterNote={(renterInfo as any)?.note}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <Car className="w-5 h-5" />
                Thông tin xe
              </h3>
            </div>
            <div className="p-6 space-y-4">

              {vehicleData && (vehicleData as any).thumbnailUrl && (
                <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 mb-4 shadow-xl border-2 border-gray-100">
                  <div className="aspect-[4/3] w-full flex items-center justify-center p-6 bg-white">
                    <img
                      src={(vehicleData as any).thumbnailUrl}
                      alt={(vehicleData as any).displayName || (vehicleData as any).name || 'Xe'}
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mã xe:</span>
                  <span className="font-semibold">XE#{(bookingData as any)?.vehicle_id?.substring(0, 8) || (bookingData as any)?.vehicle_id}</span>
                </div>
                {vehicleData ? (
                  <>
                    {(vehicleData as any).licensePlate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Biển số:</span>
                        <span className="font-semibold">{(vehicleData as any).licensePlate}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tên xe:</span>
                      <span className="font-semibold">{(vehicleData as any).displayName || (vehicleData as any).name || 'Chưa có tên'}</span>
                    </div>
                    {(vehicleData as any).brand?.displayName && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Hãng xe:</span>
                        <span className="font-semibold">{(vehicleData as any).brand.displayName}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trạng thái:</span>
                      <Badge variant="outline">Tốt</Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Thông tin xe:</span>
                    <span className="font-semibold text-gray-400">Đang tải...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
              <h3 className="text-xl font-bold text-white">Thông tin chi tiết</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2 pb-3 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trạng thái booking:</span>
                  <Badge className={getStatusColor((bookingData as any)?.status)}>
                    {getStatusText((bookingData as any)?.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trạng thái thanh toán:</span>
                  {['ongoing', 'completed'].includes(((bookingData as any)?.status || '').toLowerCase()) ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Đã thanh toán
                    </Badge>
                  ) : (bookingData as any)?.payment_id ? (
                    paymentData ? (
                      <Badge className={getPaymentStatusColor((paymentData as any).status)}>
                        {getPaymentStatusText((paymentData as any).status)}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">Đang tải...</span>
                    )
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Chưa thanh toán
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 pb-3 border-b">
                {(() => {
                  const durationDays = (bookingData as any)?.calculated_price_details?.duration_days
                    || calculateDurationDays((bookingData as any)?.start_date, (bookingData as any)?.end_date);
                  return durationDays ? (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Số ngày thuê:</span>
                      <span className="font-semibold text-sm">{durationDays} ngày</span>
                    </div>
                  ) : null;
                })()}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ngày bắt đầu:</span>
                    <span className="font-semibold text-sm">{formatDate((bookingData as any)?.start_date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ngày kết thúc dự kiến:</span>
                    <span className="font-semibold text-sm">{formatDate((bookingData as any)?.end_date)}</span>
                  </div>
                  {(bookingData as any)?.actual_return_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ngày trả thực tế:</span>
                      <span className="font-semibold text-sm text-blue-600">{formatDate((bookingData as any)?.actual_return_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin trạm */}
              {((bookingData as any)?.start_station_id || (bookingData as any)?.end_station_id) && (
                <div className="space-y-2 pb-3 border-b">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Thông tin trạm:</h4>
                  <div className="space-y-2">
                    {(bookingData as any)?.start_station_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Trạm nhận xe:</span>
                        <span className="font-semibold text-sm">
                          {resolveStationName(startStation, (bookingData as any).start_station_id)}
                        </span>
                      </div>
                    )}
                    {(bookingData as any)?.end_station_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Trạm trả xe dự kiến:</span>
                        <span className="font-semibold text-sm">
                          {resolveStationName(endStation, (bookingData as any).end_station_id)}
                        </span>
                      </div>
                    )}
                    {(bookingData as any)?.actual_return_station_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Trạm trả xe thực tế:</span>
                        <span className="font-semibold text-sm text-blue-600">
                          {resolveStationName(actualReturnStation, (bookingData as any).actual_return_station_id)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Price Details */}
              {(bookingData as any)?.calculated_price_details && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Chi tiết giá:</h4>
                  {typeof (bookingData as any).calculated_price_details === 'string' ? (
                    <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
                      {(bookingData as any).calculated_price_details}
                    </pre>
                  ) : (
                    <div className="space-y-2">
                      {(bookingData as any).calculated_price_details.price_per_day && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Giá/ngày:</span>
                          <span className="font-semibold">{formatVNDCurrency((bookingData as any).calculated_price_details.price_per_day)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Additional Fees */}
              {((bookingData as any)?.deposit_amount || (bookingData as any)?.late_fee !== null || (bookingData as any)?.refund_amount !== null) && (
                <div className="space-y-2 pt-3 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Phí bổ sung:</h4>
                  {(bookingData as any)?.deposit_amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tiền cọc:</span>
                      <span className="font-semibold">{formatVNDCurrency((bookingData as any).deposit_amount)}</span>
                    </div>
                  )}
                  {(bookingData as any)?.late_fee !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Phí phát sinh:</span>
                      <span className="font-semibold">{formatVNDCurrency((bookingData as any).late_fee || 0)}</span>
                    </div>
                  )}
                  {(bookingData as any)?.refund_amount !== null && (bookingData as any).refund_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tiền hoàn:</span>
                      <span className="font-semibold text-green-600">{formatVNDCurrency((bookingData as any).refund_amount || 0)}</span>
                    </div>
                  )}
                  {/* Hiển thị số tiền còn thiếu nếu có (khi phí phát sinh > tiền cọc) */}
                  {(bookingData as any)?.late_fee !== null && (bookingData as any).late_fee > 0 &&
                    (bookingData as any)?.deposit_amount !== null &&
                    (bookingData as any).late_fee > (bookingData as any).deposit_amount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Số tiền còn thiếu:</span>
                        <span className="font-semibold text-red-600">
                          {formatVNDCurrency((bookingData as any).late_fee - ((bookingData as any).deposit_amount || 0))}
                        </span>
                      </div>
                    )}
                </div>
              )}

              {(bookingData as any)?.created_at && (
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Ngày tạo booking:</span>
                  <span className="font-semibold text-sm">{formatDate((bookingData as any)?.created_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>


        {(bookingData as any)?.payment_id && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <CreditCard className="w-5 h-5" />
                Thông tin thanh toán
              </h3>
            </div>
            <div className="p-6">
              {paymentData ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mã thanh toán:</span>
                    <span className="font-semibold">TT#{(paymentData as any).payment_id?.substring(0, 8) || (paymentData as any).payment_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Phương thức:</span>
                    <span className="font-semibold">
                      {getPaymentMethodText((paymentData as any).payment_method)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Số tiền:</span>
                    <span className="font-semibold">{formatVNDCurrency((paymentData as any).amount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <Badge className={getPaymentStatusColor((paymentData as any).status)}>
                      {getPaymentStatusText((paymentData as any).status)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mã thanh toán:</span>
                    <span className="font-semibold">TT#{(bookingData as any)?.payment_id?.substring(0, 8) || (bookingData as any)?.payment_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <span className="text-sm text-gray-500">Đang tải thông tin thanh toán...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
