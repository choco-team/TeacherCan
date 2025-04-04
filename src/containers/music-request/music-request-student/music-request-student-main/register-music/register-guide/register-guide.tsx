import Image from 'next/image';

export default function RegisterGuide() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-primary-500">1.</span>
          <div>유튜브 페이지 접속 {'>'} 음악 검색</div>
        </div>
        <div
          className="text-sm text-gray-700 underline"
          onClick={() => {
            window.open('https://www.youtube.com/', '_blank');
          }}
        >
          클릭하여 유튜브로 이동하기
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-primary-500">2.</span>
          <div>
            더보기 아이콘 {'>'} 공유 {'>'} 복사 클릭
          </div>
        </div>
        <div className="relative aspect-video">
          <Image
            src="/image/music-request/request-1.png"
            alt="음악신청 방법"
            fill
          />
        </div>
        <div className="relative aspect-square">
          <Image
            src="/image/music-request/request-2.png"
            alt="음악신청 방법"
            fill
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-primary-500">3.</span>
          <div>요청하기 아이콘 클릭</div>
        </div>
        <div className="relative aspect-[3/1.2]">
          <Image
            src="/image/music-request/request-3.png"
            alt="음악신청 방법"
            fill
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-primary-500">4.</span>
          <div>신청하기</div>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/image/music-request/request-4.png"
            alt="음악신청 방법"
            fill
          />
        </div>
      </div>
    </div>
  );
}
