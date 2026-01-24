import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { cn } from '@/styles/utils';
import { X } from 'lucide-react';

type Props = {
  title: string;
  isWinner: boolean;
  isMixingCards: boolean;
  isExcludingSelected: boolean;
  isRemovable?: boolean;
  onRemove?: () => void;
};

export default function Card({
  title,
  isWinner,
  isMixingCards,
  isExcludingSelected,
  isRemovable = false,
  onRemove,
}: Props) {
  const isAlreadyPicked = isExcludingSelected && isWinner && !isMixingCards;
  const canRemove =
    isRemovable && !isAlreadyPicked && typeof onRemove === 'function';

  return (
    <div
      className={cn(
        'w-full h-24 text-text-title border flex items-center justify-center font-semibold rounded-2xl relative group',
        'shadow-[0_6px_18px_rgba(0,0,0,0.02)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.15)]',
        'md:h-24',
        'lg:h-32 lg:rounded-3xl',
        isAlreadyPicked
          ? 'border-gray-200 dark:border-gray-800 bg-gray-200 dark:bg-stone-950 opacity-40'
          : 'border-gray-200/50 dark:border-stone-800 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800',
      )}
    >
      {canRemove ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="gray-ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`${title} 학생 제거`}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>학생 제거</AlertDialogTitle>
              <AlertDialogDescription>
                선택한 학생을 목록에서 제거할까요? 제거한 학생은 복구할 수
                없어요.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="gray-outline">취소</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild onClick={onRemove}>
                <Button variant="red">제거</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      {isAlreadyPicked ? (
        <div className="flex flex-col gap-y-1 items-center">
          <TeacherCanIcon width={60} height={60} />
        </div>
      ) : (
        <span className="text-4xl font-semibold">{title}</span>
      )}
    </div>
  );
}
