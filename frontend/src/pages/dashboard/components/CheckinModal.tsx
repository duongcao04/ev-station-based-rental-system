export function CheckinModal({ isOpen, onClose, onConfirm, isProcessing }: any) {
    if (!isOpen) return null;

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
                maxWidth: '400px',
                width: '90%'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    Xác nhận Check-in
                </h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    Bạn có chắc chắn muốn check-in booking này không?
                </p>
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
                        disabled={isProcessing}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.6 : 1
                        }}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
}
