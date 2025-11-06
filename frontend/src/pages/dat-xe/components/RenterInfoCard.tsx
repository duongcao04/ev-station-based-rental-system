interface RenterInfoCardProps {
    renterName: string;
    renterPhone: string;
    renterEmail: string;
    renterNote?: string;
    onChange: (fields: { renterName?: string; renterPhone?: string; renterEmail?: string; renterNote?: string }) => void;
}

export function RenterInfoCard({ renterName, renterPhone, renterEmail, renterNote = '', onChange }: RenterInfoCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">Thông tin người thuê</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Tên người thuê xe</label>
                        <input
                            type="text"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                            value={renterName}
                            onChange={(e) => onChange({ renterName: e.target.value })}
                            placeholder="Nhập họ tên"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                            value={renterPhone}
                            onChange={(e) => onChange({ renterPhone: e.target.value })}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                            value={renterEmail}
                            onChange={(e) => onChange({ renterEmail: e.target.value })}
                            placeholder="Nhập email"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Ghi chú</label>
                    <textarea
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                        rows={3}
                        value={renterNote}
                        onChange={(e) => onChange({ renterNote: e.target.value })}
                        placeholder="Ghi chú thêm (tuỳ chọn)"
                    />
                </div>
            </div>
        </div>
    );
}


