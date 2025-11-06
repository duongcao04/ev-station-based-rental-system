import { Select } from 'antd';
import { MapPin } from 'lucide-react';

interface Station {
    id: string;
    name: string;
}

interface StationSelectionCardProps {
    startStation: string;
    endStation: string;
    stations: Station[];
    onStartStationChange: (value: string) => void;
    onEndStationChange: (value: string) => void;
}

export function StationSelectionCard({
    startStation,
    endStation,
    stations,
    onStartStationChange,
    onEndStationChange,
}: StationSelectionCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Địa điểm nhận và trả xe
                </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Điểm nhận xe</label>
                    <Select
                        placeholder="Chọn điểm nhận"
                        className="w-full"
                        size="large"
                        value={startStation}
                        onChange={onStartStationChange}
                        options={stations.map((s) => ({ value: s.id, label: s.name }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Điểm trả xe</label>
                    <Select
                        placeholder="Chọn điểm trả"
                        className="w-full"
                        size="large"
                        value={endStation}
                        onChange={onEndStationChange}
                        options={stations.map((s) => ({ value: s.id, label: s.name }))}
                    />
                </div>
            </div>
        </div>
    );
}

