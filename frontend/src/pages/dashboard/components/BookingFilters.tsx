export function BookingFilters({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusChange,
    onReset,
}: any) {
    return (
        <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Bộ lọc</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        Tìm kiếm
                    </label>
                    <input
                        type="text"
                        placeholder="Mã booking, User ID, Vehicle ID..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        Trạng thái
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="all">Tất cả</option>
                        <option value="booked">Đã đặt</option>
                        <option value="ongoing">Đang thuê</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                        onClick={onReset}
                        style={{
                            width: '100%',
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
