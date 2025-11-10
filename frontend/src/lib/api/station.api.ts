import { axiosClient } from '@/lib/axios';

export const stationApi = {
    // Qua API Gateway: baseURL = http://localhost:8000/api, path = /v1/stations
    getAllStations: () => axiosClient.get('/v1/stations'),

    getStationByUserId: (userId: string) => axiosClient.get(`/v1/stations/${userId}`),
};

