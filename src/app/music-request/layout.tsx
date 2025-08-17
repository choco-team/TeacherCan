// NOTE:(김홍동) 서버를 내리기 위해 임시 레이아웃을 추가합니다.

export default function MusicRequestLayout() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-primary-50 border border-primary-200 rounded-lg shadow-sm text-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        🎵 음악 신청 서비스 점검 안내
      </h2>
      <p className="mb-2">
        7월 31일(목)부터 8월 31일(일)까지 시스템 점검으로 인해 음악 신청
        서비스를
        <br />
        이용하실 수 없습니다. 이용에 불편을 드려 죄송합니다.
      </p>
      <p className="text-sm text-gray-600">
        ※ 점검 일정은 상황에 따라 변경될 수 있습니다.
      </p>
    </div>
  );
}
