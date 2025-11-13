'use client';

import { useEffect, useMemo, useState } from 'react';
import { stationApi } from '@/lib/api/station.api';

type Station = {
  station_id: string;
  user_id: string;
  display_name: string;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  count_vehicle?: number | null;
  updated_at?: string;
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

export function FleetManagement() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    user_id: '',
    display_name: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setFormData({
      user_id: '',
      display_name: '',
      address: '',
      latitude: '',
      longitude: '',
    });
    setEditingUserId(null);
    setFormMode('create');
    setShowForm(false);
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stationApi.getAllStations();
      const data = Array.isArray(response.data) ? response.data : [];
      setStations(
        data.sort((a, b) =>
          (a.display_name || '').localeCompare(b.display_name || '')
        )
      );
    } catch (err: any) {
      console.error('load stations error:', err);
      setStations([]);
      setError(
        err?.message ||
        err?.error ||
        'Không thể tải danh sách trạm. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const filteredStations = useMemo(() => {
    if (!keyword.trim()) return stations;
    const query = keyword.trim().toLowerCase();
    return stations.filter((station) => {
      const name = station.display_name?.toLowerCase() ?? '';
      const address = station.address?.toLowerCase() ?? '';
      const stationId = station.station_id?.toLowerCase() ?? '';
      const ownerId = station.user_id?.toLowerCase() ?? '';
      return (
        name.includes(query) ||
        address.includes(query) ||
        stationId.includes(query) ||
        ownerId.includes(query)
      );
    });
  }, [keyword, stations]);

  const summary = useMemo(() => {
    const totalStations = stations.length;
    const totalVehicles = stations.reduce(
      (sum, station) => sum + (station.count_vehicle ?? 0),
      0
    );
    const stationsWithVehicles = stations.filter(
      (station) => (station.count_vehicle ?? 0) > 0
    ).length;

    return {
      totalStations,
      totalVehicles,
      stationsWithVehicles,
    };
  }, [stations]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.user_id || !formData.display_name || !formData.address) {
      setError('Vui lòng nhập đầy đủ user_id, tên trạm và địa chỉ.');
      return;
    }

    const payload: {
      user_id: string;
      display_name: string;
      address: string;
      latitude?: string;
      longitude?: string;
    } = {
      user_id: formData.user_id.trim(),
      display_name: formData.display_name.trim(),
      address: formData.address.trim(),
    };

    if (formData.latitude.trim()) {
      payload.latitude = formData.latitude.trim();
    }
    if (formData.longitude.trim()) {
      payload.longitude = formData.longitude.trim();
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (formMode === 'create') {
        await stationApi.createStation(payload);
      } else if (editingUserId) {
        await stationApi.updateStation(editingUserId, payload);
      }

      resetForm();
      await fetchStations();
    } catch (err: any) {
      console.error('submit station error:', err);
      setError(
        err?.message ||
        err?.error ||
        'Không thể lưu thông tin trạm. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa trạm này? Hành động sẽ không thể hoàn tác.'
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await stationApi.deleteStation(userId);
      if (editingUserId === userId) {
        resetForm();
      }
      await fetchStations();
    } catch (err: any) {
      console.error('delete station error:', err);
      setError(
        err?.message ||
        err?.error ||
        'Không thể xóa trạm. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (station: Station) => {
    setEditingUserId(station.user_id);
    setFormMode('edit');
    setShowForm(true);
    setError(null);
    setFormData({
      user_id: station.user_id || '',
      display_name: station.display_name || '',
      address: station.address || '',
      latitude: station.latitude || '',
      longitude: station.longitude || '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
            Quản Lý Trạm Xe
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Dữ liệu được lấy trực tiếp từ station service.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder='Tìm theo tên trạm, địa chỉ, station ID hoặc owner ID...'
            style={{
              flex: '1 1 320px',
              minWidth: '240px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
            }}
          />
          <button
            onClick={fetchStations}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#111827',
              fontWeight: 500,
            }}
          >
            {loading ? 'Đang tải...' : 'Tải lại'}
          </button>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #2563eb',
              backgroundColor: showForm ? '#2563eb' : '#fff',
              color: showForm ? '#fff' : '#2563eb',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showForm ? 'Đóng form' : 'Thêm trạm'}
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <SummaryCard label='Tổng số trạm' value={summary.totalStations} />
        <SummaryCard label='Tổng số xe' value={summary.totalVehicles} />
        <SummaryCard
          label='Trạm đang có xe'
          value={summary.stationsWithVehicles}
        />
      </div>

      {showForm && (
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#fff',
            display: 'grid',
            gap: '16px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
            {formMode === 'create' ? 'Thêm Trạm Mới' : 'Cập Nhật Trạm'}
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'grid', gap: '12px' }}
          >
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={labelStyle}>
                Owner user ID{' '}
                <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                value={formData.user_id}
                onChange={(event) => handleChange('user_id', event.target.value)}
                placeholder='UUID của owner (user_id)'
                style={inputStyle}
                disabled={formMode === 'edit'}
              />
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={labelStyle}>
                Tên trạm <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                value={formData.display_name}
                onChange={(event) =>
                  handleChange('display_name', event.target.value)
                }
                placeholder='Ví dụ: Ga Hà Nội'
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={labelStyle}>
                Địa chỉ <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(event) => handleChange('address', event.target.value)}
                placeholder='Số nhà, đường, quận/huyện'
                style={{
                  ...inputStyle,
                  minHeight: '60px',
                  resize: 'vertical',
                }}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              }}
            >
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={labelStyle}>Vĩ độ</label>
                <input
                  value={formData.latitude}
                  onChange={(event) =>
                    handleChange('latitude', event.target.value)
                  }
                  placeholder='Ví dụ: 21.0285'
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={labelStyle}>Kinh độ</label>
                <input
                  value={formData.longitude}
                  onChange={(event) =>
                    handleChange('longitude', event.target.value)
                  }
                  placeholder='Ví dụ: 105.8542'
                  style={inputStyle}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              <button
                type='submit'
                disabled={isSubmitting}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {formMode === 'create'
                  ? isSubmitting ? 'Đang thêm...' : 'Thêm trạm'
                  : isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              {formMode === 'edit' && (
                <button
                  type='button'
                  onClick={resetForm}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>
          {error && (
            <div style={{ color: '#dc2626', fontSize: '14px' }}>{error}</div>
          )}
        </div>
      )}

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
            Danh sách trạm xe
          </h3>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            Hiển thị thông tin vị trí, chủ sở hữu và số lượng xe của từng trạm.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                <th style={tableHeaderStyle}>Tên trạm</th>
                <th style={tableHeaderStyle}>Station ID</th>
                <th style={tableHeaderStyle}>Owner user ID</th>
                <th style={tableHeaderStyle}>Địa chỉ</th>
                <th style={tableHeaderStyle}>Số xe</th>
                <th style={tableHeaderStyle}>Tọa độ</th>
                <th style={tableHeaderStyle}>Cập nhật</th>
                <th style={tableHeaderStyle}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={tableCellCenterStyle}>
                    Đang tải dữ liệu trạm...
                  </td>
                </tr>
              ) : filteredStations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={tableCellCenterStyle}>
                    Không tìm thấy trạm phù hợp.
                  </td>
                </tr>
              ) : (
                filteredStations.map((station) => (
                  <tr key={station.station_id} style={tableRowStyle}>
                    <td style={tableCellStyle}>
                      <strong>{station.display_name || 'Chưa đặt tên'}</strong>
                    </td>
                    <td style={tableIdCellStyle}>
                      {station.station_id?.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={tableIdCellStyle}>
                      {station.user_id?.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={tableCellStyle}>
                      {station.address || (
                        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          backgroundColor:
                            (station.count_vehicle ?? 0) > 0
                              ? 'rgba(37, 99, 235, 0.12)'
                              : 'transparent',
                          color:
                            (station.count_vehicle ?? 0) > 0
                              ? '#2563eb'
                              : '#374151',
                          fontWeight: 600,
                          fontSize: '13px',
                        }}
                      >
                        {numberFormatter.format(station.count_vehicle ?? 0)} xe
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      {station.latitude && station.longitude
                        ? `${station.latitude}, ${station.longitude}`
                        : '—'}
                    </td>
                    <td style={tableCellStyle}>
                      {station.updated_at
                        ? new Intl.DateTimeFormat('vi-VN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(station.updated_at))
                        : '—'}
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startEdit(station)}
                          style={actionButtonStyle}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(station.user_id)}
                          style={{
                            ...actionButtonStyle,
                            color: '#dc2626',
                            borderColor: '#fca5a5',
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
};

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#4b5563',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid #e5e7eb',
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#fff',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#111827',
  verticalAlign: 'top',
};

const tableIdCellStyle: React.CSSProperties = {
  ...tableCellStyle,
  fontFamily: 'monospace',
  fontSize: '12px',
  color: '#374151',
};

const tableCellCenterStyle: React.CSSProperties = {
  ...tableCellStyle,
  textAlign: 'center',
  color: '#6b7280',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
};

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px 20px',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>
        {numberFormatter.format(value)}
      </div>
    </div>
  );
}
