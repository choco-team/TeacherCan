import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@radix-ui/react-alert-dialog';

interface LogoutDialogProps {
  onLogout: () => void;
}

export function LogoutDialog({ onLogout }: LogoutDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer btn-action px-4 py-2 rounded-xl"
        >
          로그아웃
        </button>
      </AlertDialogTrigger>

      {/* 다이얼로그 창 */}
      <AlertDialogContent>
        <AlertDialogTitle>로그아웃 확인</AlertDialogTitle>
        <AlertDialogDescription>로그아웃하시겠습니까?</AlertDialogDescription>

        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel asChild>
            <button type="button" className="px-4 py-2 bg-gray-200 rounded">
              취소
            </button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              로그아웃
            </button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
