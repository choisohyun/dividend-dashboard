export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600">목표 설정 및 개인 환경설정</p>
      </div>
      
      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 font-semibold">투자 목표</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-600">목표 월 배당</p>
              <p className="text-lg font-bold">₩900,000</p>
            </div>
            <div>
              <p className="text-gray-600">월 정기입금 목표</p>
              <p className="text-lg font-bold">₩2,000,000</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 font-semibold">표시 설정</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">통화</span>
              <span className="font-medium">KRW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">타임존</span>
              <span className="font-medium">Asia/Seoul</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



