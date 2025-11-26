export interface ICronJobSetting {
    id: string;
    jobName: string;
    cronTime: string;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
