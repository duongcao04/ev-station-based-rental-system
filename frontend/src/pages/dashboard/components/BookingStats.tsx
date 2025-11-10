export function BookingStats({ total, booked, ongoing, completed }: any) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
        }}>
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Tổng Booking</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{total}</div>
            </div>
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Đã đặt</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{booked}</div>
            </div>
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Đang thuê</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{ongoing}</div>
            </div>
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Hoàn thành</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{completed}</div>
            </div>
        </div>
    );
}
