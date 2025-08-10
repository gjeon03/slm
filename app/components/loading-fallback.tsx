import Header from "@/app/components/header";

export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto w-full max-w-lg space-y-6 bg-[#F9FAFB] h-full">
        <Header />
        <div className="px-4 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#F9CE61] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
