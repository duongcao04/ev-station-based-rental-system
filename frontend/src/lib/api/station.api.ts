import { axiosClient } from '@/lib/axios';

export const stationApi = {
    // Qua API Gateway: baseURL = http://localhost:8000/api, path = /v1/stations
    getAllStations: () => axiosClient.get('/v1/stations'),

    getStationByUserId: (userId: string) => axiosClient.get(`/v1/stations/${userId}`),

    getStationById: (stationId: string) => axiosClient.get(`/v1/stations/by-id/${stationId}`),

    getStationVehicles: (userId: string) => axiosClient.get(`/v1/stations/${userId}/vehicles`),

    // Lấy stations có vehicle cụ thể (điểm nhận xe)
    getStationsByVehicleId: (vehicleId: string) => axiosClient.get(`/v1/stations/vehicles/${vehicleId}/stations`),

    createStation: (data: {
        user_id: string;
        display_name: string;
        address: string;
        latitude?: string;
        longitude?: string;
        count_vehicle?: number;
    }) => axiosClient.post('/v1/stations', data),

    updateStation: (userId: string, data: {
        display_name?: string;
        address?: string;
        latitude?: string;
        longitude?: string;
        count_vehicle?: number;
    }) => axiosClient.patch(`/v1/stations/${userId}`, data),

    deleteStation: (userId: string) => axiosClient.delete(`/v1/stations/${userId}`),
};

