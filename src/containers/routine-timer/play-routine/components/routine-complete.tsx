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
      <h2 className="text-3xl font-bold mb-6">루틴 완료!</h2>
      <div className="flex gap-4">
        <Button
          onClick={onRestart}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg"
        >
          다시 시작
        </Button>
        <Button
          onClick={onExit}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
        >
          종료
        </Button>
      </div>
    </div>
  );
}
