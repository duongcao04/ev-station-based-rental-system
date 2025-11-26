// Matches the interface in the backend
export interface ICronJobSetting {
    id: string;
    jobName: string;
    cronTime: string;
    isEnabled: boolean;
    createdAt: string; // Dates are serialized as strings
    updatedAt: string;
}
