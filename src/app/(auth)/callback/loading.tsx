// components/Loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#0B0B0B] flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-[#0B0B0B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
