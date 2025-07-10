// components/Loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-200 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
