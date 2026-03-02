import { Trash2 } from 'lucide-react';
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

interface DeleteRoutineDialogProps {
  routineTitle: string;
  disabled?: boolean;
  onDelete: () => void;
}

export default function DeleteRoutineDialog({
  routineTitle,
  disabled,
  onDelete,
}: DeleteRoutineDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="gray-outline"
          disabled={disabled}
          className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 gap-2"
        >
          <Trash2 className="size-4" />
          루틴 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>루틴 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{routineTitle || '제목 없음'}&rdquo; 루틴을 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
