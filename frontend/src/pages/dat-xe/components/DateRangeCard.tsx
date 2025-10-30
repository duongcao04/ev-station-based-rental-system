import { DatePicker } from 'antd';
import { Calendar, Clock } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

interface DateRangeCardProps {
    dateRange: [Dayjs | null, Dayjs | null];
    onDateRangeChange: (dates: [Dayjs | null, Dayjs | null]) => void;
    disabledDate: RangePickerProps['disabledDate'];
}

export function DateRangeCard({ dateRange, onDateRangeChange, disabledDate }: DateRangeCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Thời gian thuê xe
                </h2>
            </div>
            <div className="p-6">
                <RangePicker
                    size="large"
                    className="w-full"
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                    onChange={(dates) => onDateRangeChange([dates?.[0] || null, dates?.[1] || null])}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                />
                {dateRange[0] && dateRange[1] && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-700">
                            Tổng thời gian: <span className="font-bold text-purple-600">
                                {dateRange[1].diff(dateRange[0], 'day') + 1} ngày
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

