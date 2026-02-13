import { Button } from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { ReactNode } from 'react';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { MAX_RANDOM_PICK_HISTORY } from '../../random-pick-constants';

type Props = {
  trigger: ReactNode;
};

const formatPickedAt = (pickedAt: string) => {
  const date = new Date(pickedAt);

  if (Number.isNaN(date.getTime())) {
    return pickedAt;
  }
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  ].join(' ');
};

export default function HistoryModal({ trigger }: Props) {
  const { randomPick } = useRandomPickPlaygroundState();
  const { clearHistory } = useRandomPickPlaygroundAction();

  const history = randomPick.history ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>뽑기 기록</DialogTitle>
          <DialogDescription>
            최근 {MAX_RANDOM_PICK_HISTORY}개까지 유지됩니다.
          </DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="py-8 text-sm text-gray-500 text-center">
            아직 기록이 없어요.
          </div>
        ) : (
          <div className="flex flex-col gap-y-3 max-h-[50vh] overflow-auto">
            {history.map((item) => (
              <div
                key={`${item.pickedAt}-${item.winners
                  .map((winner) => winner.id)
                  .join('-')}`}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-3"
              >
                <div className="text-xs text-gray-500">
                  {formatPickedAt(item.pickedAt)}
                </div>
                <div className="mt-1 text-sm text-text-title">
                  {item.winners.length > 0
                    ? item.winners.map((winner) => winner.value).join(', ')
                    : '뽑힌 학생 없음'}
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="gray-outline"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            비우기
          </Button>
          <DialogClose asChild>
            <Button type="button">닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
