export function BookingInfoCard({ title, children }: any) {
    return (
        <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                {title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {children}
            </div>
        </div>
    );
}

export function InfoRow({ label, value, valueStyle }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>{label}:</span>
            <span style={valueStyle}>{value}</span>
        </div>
    );
}
