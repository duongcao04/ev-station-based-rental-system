export function CheckoutModal({
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    actualReturnDate,
    actualReturnStationId,
    penaltyFee,
    onActualReturnDateChange,
    onActualReturnStationIdChange,
    onPenaltyFeeChange,
}: any) {
    if (!isOpen) return null;

    const isValid = actualReturnDate && actualReturnStationId;

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
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    Check-out
                </h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    Nhập thông tin trả xe
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                            Ngày trả xe *
                        </label>
                        <input
                            type="datetime-local"
                            value={actualReturnDate}
                            onChange={(e) => onActualReturnDateChange(e.target.value)}
                            required
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
                            Trạm trả xe *
                        </label>
                        <input
                            type="text"
                            placeholder="Station ID"
                            value={actualReturnStationId}
                            onChange={(e) => onActualReturnStationIdChange(e.target.value)}
                            required
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
                            Phí phát sinh (VND)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={penaltyFee}
                            onChange={(e) => onPenaltyFeeChange(e.target.value)}
                            min="0"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing || !isValid}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: (isProcessing || !isValid) ? 'not-allowed' : 'pointer',
                            opacity: (isProcessing || !isValid) ? 0.6 : 1
                        }}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
}
