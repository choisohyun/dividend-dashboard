export default function ImportPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">데이터 임포트</h1>
        <p className="text-gray-600">CSV 파일을 업로드하여 거래/배당/입금 내역 추가</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-2 font-semibold">거래내역 업로드</h3>
          <p className="text-sm text-gray-500">매수/매도 거래 내역 CSV 업로드</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-2 font-semibold">배당내역 업로드</h3>
          <p className="text-sm text-gray-500">배당 수령 내역 CSV 업로드</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-2 font-semibold">입금내역 업로드</h3>
          <p className="text-sm text-gray-500">입출금 내역 CSV 업로드</p>
        </div>
      </div>
    </div>
  );
}



