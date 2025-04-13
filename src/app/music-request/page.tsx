import { Button } from '@/components/button';
import MusicRequestContainer from '@/containers/music-request/music-request-container';
import Link from 'next/link';

export const metadata = {
  title: '음악신청',
};

function MusicRequest() {
  return (
    <div className="flex flex-col text-gray-700 justify-center items-center min-h-[calc(100dvh-120px)]">
      <div className="mt-2">
        현재 티처캔 음악 신청 서비스의 서버 작업이 진행 중입니다.
      </div>
      <div className="mt-1">
        작업 시간: 4월 11일(금) 18시 - 4월 14일(월) 24시
      </div>
      <div className="mt-4">
        <Link href="/">
          <Button variant="primary">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );

  return <MusicRequestContainer />;
}

export default MusicRequest;
