'use client';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}
