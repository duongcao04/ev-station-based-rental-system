import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stationApi } from '@/lib/api/station.api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Car, Battery, Navigation, X, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currencyFormatter } from '@/lib/number';
import type { TCar } from '@/lib/types/car.type';

interface Station {
    user_id: string;
    display_name: string;
    address: string;
    latitude: string;
    longitude: string;
    count_vehicle?: number;
}

interface StationVehicle {
    id: string;
    vehicle_id: string;
    status: string;
    battery_soc: number;
    vehicle?: TCar;
}


// Fix Leaflet default icon (workaround for Vite)
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to update map center when station is selected
function MapCenterUpdater({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function TramXePage() {
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([10.7769, 106.7009]);
    const [mapZoom, setMapZoom] = useState(11);

    // Fetch all stations
    const { data: stations, isLoading: isLoadingStations } = useQuery({
        queryKey: ['stations'],
        queryFn: () => stationApi.getAllStations(),
        select: (res) => res.data as Station[],
    });

    // Fetch vehicles for selected station
    const {
        data: stationVehicles,
        isLoading: isLoadingVehicles,
        error: vehiclesError,
    } = useQuery({
        queryKey: ['station-vehicles', selectedStation?.user_id],
        queryFn: () => stationApi.getStationVehicles(selectedStation!.user_id),
        select: (res) => res.data as StationVehicle[],
        enabled: !!selectedStation?.user_id,
        retry: false,
    });

    console.log(stationVehicles);
    


    // Handle station click
    const handleStationClick = (station: Station) => {
        setSelectedStation(station);
        if (station.latitude && station.longitude) {
            const lat = parseFloat(station.latitude);
            const lng = parseFloat(station.longitude);
            setMapCenter([lat, lng]);
            setMapZoom(14); // Zoom in when station is selected
        }
    };

    // Handle marker click
    const handleMarkerClick = (station: Station) => {
        handleStationClick(station);
    };

    // Initialize map center when stations are loaded
    useEffect(() => {
        if (stations && stations.length > 0 && !selectedStation) {
            const firstStation = stations.find((s) => s.latitude && s.longitude);
            if (firstStation) {
                setMapCenter([
                    parseFloat(firstStation.latitude),
                    parseFloat(firstStation.longitude),
                ]);
                setMapZoom(11);
            }
        }
    }, [stations]); // Only run when stations change, not when selectedStation changes

    // Get Google Maps link for a station (opens in new tab)
    const getGoogleMapsLink = (station: Station) => {
        if (station.latitude && station.longitude) {
            return `https://www.google.com/maps?q=${station.latitude},${station.longitude}`;
        }
        const query = encodeURIComponent(station.address || station.display_name);
        return `https://www.google.com/maps/search/?query=${query}`;
    };

    // Custom marker icon - use default Leaflet icon
    const createCustomIcon = (isSelected: boolean) => {
        // Use default icon from CDN (works with Vite)
        return new Icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            className: isSelected ? 'selected-station-marker' : '',
        });
    };

    if (isLoadingStations) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <Loader2 className='w-8 h-8 animate-spin text-green-600' />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 mt-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                        Trạm xe điện
                    </h1>
                    <p className='text-xl text-gray-600'>
                        Tìm trạm xe gần bạn và xem danh sách xe có sẵn
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left: Stations List */}
                    <div className='lg:col-span-1 space-y-4'>
                        <div className='bg-white rounded-2xl shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                <MapPin className='w-6 h-6 text-green-600' />
                                Danh sách trạm
                            </h2>
                            <div className='space-y-3 max-h-[600px] overflow-y-auto'>
                                {stations && stations.length > 0 ? (
                                    stations.map((station) => (
                                        <div
                                            key={station.user_id}
                                            onClick={() => handleStationClick(station)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedStation?.user_id === station.user_id
                                                ? 'border-green-500 bg-green-50 shadow-md'
                                                : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className='flex items-start justify-between mb-2'>
                                                <h3 className='font-semibold text-gray-900'>
                                                    {station.display_name}
                                                </h3>
                                                {station.count_vehicle !== undefined && (
                                                    <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                                                        {station.count_vehicle} xe
                                                    </span>
                                                )}
                                            </div>
                                            <p className='text-sm text-gray-600 mb-2'>
                                                {station.address}
                                            </p>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                                    <Navigation className='w-4 h-4' />
                                                    <span>
                                                        {station.latitude && station.longitude
                                                            ? `${station.latitude}, ${station.longitude}`
                                                            : 'Đang cập nhật'}
                                                    </span>
                                                </div>
                                                <a
                                                    href={getGoogleMapsLink(station)}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-xs text-green-600 hover:text-green-700 font-medium'
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Xem trên Maps
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-gray-500 text-center py-8'>
                                        Không có trạm xe nào
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Map and Vehicles */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Map */}
                        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                                <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                                    <MapPin className='w-5 h-5 text-green-600' />
                                    Bản đồ trạm xe
                                </h3>
                                {selectedStation && (
                                    <a
                                        href={getGoogleMapsLink(selectedStation)}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1'
                                    >
                                        <Navigation className='w-4 h-4' />
                                        Mở trên Google Maps
                                    </a>
                                )}
                            </div>
                            <div className='h-96 bg-gray-200 relative z-0'>
                                {stations && stations.length > 0 ? (
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                        />
                                        <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
                                        {stations
                                            .filter((station) => station.latitude && station.longitude)
                                            .map((station) => {
                                                const isSelected =
                                                    selectedStation?.user_id === station.user_id;
                                                const position: LatLngExpression = [
                                                    parseFloat(station.latitude),
                                                    parseFloat(station.longitude),
                                                ];

                                                return (
                                                    <Marker
                                                        key={station.user_id}
                                                        position={position}
                                                        icon={createCustomIcon(isSelected)}
                                                        eventHandlers={{
                                                            click: () => handleMarkerClick(station),
                                                        }}
                                                    >
                                                        <Popup>
                                                            <div className='p-2'>
                                                                <h4 className='font-semibold text-gray-900 mb-1'>
                                                                    {station.display_name}
                                                                </h4>
                                                                <p className='text-sm text-gray-600 mb-2'>
                                                                    {station.address}
                                                                </p>
                                                                {station.count_vehicle !== undefined && (
                                                                    <p className='text-xs text-gray-500 mb-2'>
                                                                        {station.count_vehicle} xe có sẵn
                                                                    </p>
                                                                )}
                                                                <button
                                                                    onClick={() => handleStationClick(station)}
                                                                    className='text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors'
                                                                >
                                                                    Xem chi tiết
                                                                </button>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                );
                                            })}
                                    </MapContainer>
                                ) : (
                                    <div className='absolute inset-0 flex items-center justify-center text-gray-500'>
                                        <div className='text-center'>
                                            <MapPin className='w-12 h-12 mx-auto mb-2 opacity-50' />
                                            <p>Không có trạm xe để hiển thị</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Station Vehicles */}
                        {selectedStation && (
                            <div className='bg-white rounded-2xl shadow-lg p-6'>
                                <div className='flex items-center justify-between mb-6'>
                                    <div>
                                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                                            <Car className='w-6 h-6 text-green-600' />
                                            Xe tại {selectedStation.display_name}
                                        </h2>
                                        <p className='text-gray-600 mt-1'>{selectedStation.address}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStation(null)}
                                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                                    >
                                        <X className='w-5 h-5 text-gray-500' />
                                    </button>
                                </div>

                                {isLoadingVehicles ? (
                                    <div className='flex items-center justify-center py-12'>
                                        <Loader2 className='w-8 h-8 animate-spin text-green-600' />
                                    </div>
                                ) : vehiclesError ? (
                                    <div className='text-center py-12 text-gray-500'>
                                        <AlertCircle className='w-12 h-12 mx-auto mb-2 opacity-50 text-yellow-500' />
                                        <p className='mb-2'>Không thể tải danh sách xe</p>
                                        <p className='text-sm text-gray-400'>
                                            Vui lòng đăng nhập để xem danh sách xe tại trạm này
                                        </p>
                                    </div>
                                ) : stationVehicles && stationVehicles.length > 0 ? (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        {stationVehicles.map((stationVehicle) => {
                                            const vehicle = stationVehicle.vehicle;
                                            if (!vehicle) return null;

                                            const getStatusColor = (status: string) => {
                                                switch (status) {
                                                    case 'available':
                                                        return 'bg-green-100 text-green-800';
                                                    case 'rented':
                                                        return 'bg-blue-100 text-blue-800';
                                                    case 'maintenance':
                                                        return 'bg-yellow-100 text-yellow-800';
                                                    case 'unavailable':
                                                        return 'bg-red-100 text-red-800';
                                                    default:
                                                        return 'bg-gray-100 text-gray-800';
                                                }
                                            };

                                            const getStatusText = (status: string) => {
                                                switch (status) {
                                                    case 'available':
                                                        return 'Có sẵn';
                                                    case 'rented':
                                                        return 'Đã thuê';
                                                    case 'maintenance':
                                                        return 'Bảo trì';
                                                    case 'unavailable':
                                                        return 'Không có sẵn';
                                                    default:
                                                        return status;
                                                }
                                            };

                                            return (
                                                <div
                                                    key={stationVehicle.id}
                                                    className='bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow'
                                                >
                                                    <div className='flex items-start justify-between mb-3'>
                                                        <div className='flex-1'>
                                                            <h3 className='font-semibold text-gray-900 mb-1'>
                                                                {vehicle.displayName}
                                                            </h3>
                                                            <p className='text-sm text-gray-600'>
                                                                {vehicle.brand?.displayName}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                                                stationVehicle.status
                                                            )}`}
                                                        >
                                                            {getStatusText(stationVehicle.status)}
                                                        </span>
                                                    </div>

                                                    {vehicle.thumbnailUrl && (
                                                        <img
                                                            src={vehicle.thumbnailUrl}
                                                            alt={vehicle.displayName}
                                                            className='w-full h-32 object-cover rounded-lg mb-3'
                                                        />
                                                    )}

                                                    <div className='space-y-2 mb-4'>
                                                        <div className='flex items-center justify-between text-sm'>
                                                            <span className='text-gray-600'>Pin:</span>
                                                            <div className='flex items-center gap-2'>
                                                                <Battery
                                                                    className={`w-4 h-4 ${stationVehicle.battery_soc > 50
                                                                        ? 'text-green-500'
                                                                        : stationVehicle.battery_soc > 20
                                                                            ? 'text-yellow-500'
                                                                            : 'text-red-500'
                                                                        }`}
                                                                />
                                                                <span className='font-medium'>
                                                                    {stationVehicle.battery_soc}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center justify-between text-sm'>
                                                            <span className='text-gray-600'>Giá:</span>
                                                            <span className='font-semibold text-green-600'>
                                                                {currencyFormatter(vehicle.regularPrice, 'Vietnamese')}
                                                                /ngày
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {stationVehicle.status === 'available' && (
                                                        <Link
                                                            to={`/dat-xe/${vehicle.id}`}
                                                            className='block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg font-medium transition-colors'
                                                        >
                                                            Thuê ngay
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className='text-center py-12 text-gray-500'>
                                        <Car className='w-12 h-12 mx-auto mb-2 opacity-50' />
                                        <p>Trạm này chưa có xe nào</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No station selected */}
                        {!selectedStation && (
                            <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
                                <MapPin className='w-16 h-16 mx-auto mb-4 text-gray-300' />
                                <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                                    Chọn một trạm xe
                                </h3>
                                <p className='text-gray-500'>
                                    Click vào trạm xe ở danh sách bên trái để xem thông tin chi tiết
                                    và danh sách xe có sẵn
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

