// Utility để gọi Vehicle Service API qua API Gateway
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });


const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:8000';


export const getVehicleInfo = async (vehicleId) => {
    try {
        // Gọi qua API Gateway: /api/v1/vehicles/:id
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/vehicles/${vehicleId}`, {
            timeout: 10000, 
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.warn(`Vehicle ${vehicleId} not found in Vehicle Service (via API Gateway)`);
            return null;
        }
        console.error(`Error fetching vehicle ${vehicleId} via API Gateway:`, error.message);
        return null;
    }
};


export const validateVehicle = async (vehicleId) => {
    try {
        const vehicleInfo = await getVehicleInfo(vehicleId);
        if (vehicleInfo === null) {
            return { valid: false, error: "Vehicle not found" };
        }
        return { valid: true };
    } catch (error) {
       
        const allowBypass = process.env.ALLOW_VEHICLE_SERVICE_BYPASS === 'true';
        if (allowBypass) {
            console.warn(`Vehicle Service unavailable, bypassing validation for vehicle ${vehicleId}`);
            return { valid: true, warning: "Vehicle Service unavailable, validation bypassed" };
        }
        console.error(`Vehicle Service error when validating vehicle ${vehicleId}:`, error.message);
        return { valid: false, error: "Vehicle Service unavailable" };
    }
};

