import Image from 'next/image';

export default function RegisterGuide() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-lg font-bold text-primary-500">1.</span>
        <div>유튜브 페이지에 접속합니다.</div>
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
        <span className="text-lg font-bold text-primary-500">2.</span>
        <div>음악을 검색합니다.</div>
      </div>
      <div>
        <span className="text-lg font-bold text-primary-500">3.</span>
        <div>
          검색 페이지에서 신청하고자 하는 음악의 더보기를 클릭 후{' '}
          <span className="font-semibold">공유</span>를 클릭합니다.
        </div>
        <div className="relative aspect-video">
          <Image
            src="/image/music-request/request-1.png"
            alt="음악신청 방법"
            fill
          />
        </div>
      </div>
      <div>
        <span className="text-lg font-bold text-primary-500">4.</span>
        <div>
          게시물로 공유에서 유튜브 음악 주소 옆{' '}
          <span className="font-semibold">복사</span>버튼을 클릭합니다.
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
        <span className="text-lg font-bold text-primary-500">5.</span>
        <div>요청하기에서 오른쪽 아래의 아이콘을 클릭합니다.</div>
        <div className="relative aspect-[3/1.2]">
          <Image
            src="/image/music-request/request-3.png"
            alt="음악신청 방법"
            fill
          />
        </div>
      </div>
      <div>
        <span className="text-lg font-bold text-primary-500">6.</span>
        <div>
          주소를 정확히 붙여넣기 하면 유튜브 음악 아이디, 썸네일 사진, 제목을
          확인할 수 있습니다. 마지막으로{' '}
          <span className="font-semibold">신청하기</span>버튼을 클릭합니다.
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
