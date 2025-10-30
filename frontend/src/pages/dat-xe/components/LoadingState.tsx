export function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
                <div className="text-2xl font-bold text-gray-700">Đang tải thông tin xe...</div>
            </div>
        </div>
    );
}

