import Image from 'next/image';
import { Button } from '@/components/button';

type RoutineCompleteProps = {
  onRestart: () => void;
  onExit: () => void;
};

export default function RoutineComplete({
  onRestart,
  onExit,
}: RoutineCompleteProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Image
        src="/image/routine-timer/clapping.png"
        alt="박수"
        width={80}
        height={80}
        className="mb-4"
      />
      <h2 className="text-3xl font-bold mb-6">모든 활동을 완료했어요!</h2>
      <div className="flex gap-4">
        <Button variant="primary-outline" onClick={onRestart}>
          루틴 다시 시작
        </Button>
        <Button variant="gray-outline" onClick={onExit}>
          종료
        </Button>
      </div>
    </div>
  );
}
