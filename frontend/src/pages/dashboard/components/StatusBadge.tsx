export function StatusBadge({ status }: any) {
    const getStyle = () => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return { backgroundColor: '#dcfce7', color: '#166534' };
            case 'ongoing':
                return { backgroundColor: '#dbeafe', color: '#1e40af' };
            case 'booked':
                return { backgroundColor: '#fef3c7', color: '#92400e' };
            case 'cancelled':
                return { backgroundColor: '#fee2e2', color: '#991b1b' };
            default:
                return { backgroundColor: '#f3f4f6', color: '#374151' };
        }
    };

    const getText = () => {
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

    return (
        <span
            style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                ...getStyle()
            }}
        >
            {getText()}
        </span>
    );
}
