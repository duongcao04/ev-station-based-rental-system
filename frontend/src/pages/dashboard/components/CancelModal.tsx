export function CancelModal({
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    bookingStatus,
    penaltyFee,
    onPenaltyFeeChange,
}: any) {
    if (!isOpen) return null;

    const isOngoing = bookingStatus?.toLowerCase() === 'ongoing';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
                    Xác nhận Hủy Booking
                </h3>
                <p style={{ color: '#666', marginBottom: '16px' }}>
                    Bạn có chắc chắn muốn hủy booking này không?
                </p>

                {isOngoing && (
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: '#374151'
                        }}>
                            Phí phát sinh (VND) <span style={{ color: '#666', fontSize: '12px' }}>(nếu có)</span>
                        </label>
                        <input
                            type="number"
                            value={penaltyFee}
                            onChange={(e) => onPenaltyFeeChange(e.target.value)}
                            placeholder="Nhập số tiền phí phát sinh (để trống nếu không có)"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                            min="0"
                            step="1000"
                        />
                        <p style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '4px'
                        }}>
                            Nếu booking đã check-in, bạn có thể nhập phí hủy, phí hỏng hóc, v.v.
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.6 : 1
                        }}
                    >
                        Đóng
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.6 : 1
                        }}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </button>
                </div>
            </div>
        </div>
    );
}

