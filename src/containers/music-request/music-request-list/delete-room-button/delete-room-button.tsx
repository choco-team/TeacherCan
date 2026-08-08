'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { useToast } from '@/hooks/use-toast';
import { useDeleteMusicRequestRoom } from '@/hooks/apis/music-request/use-delete-music-request-room';

type Props = {
  roomId: string;
  roomTitle: string;
  musicCount: number;
  onDeleted: (roomId: string) => void;
};

export default function DeleteRoomButton({
  roomId,
  roomTitle,
  musicCount,
  onDeleted,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: deleteRoom, isPending } = useDeleteMusicRequestRoom();

  // 카드 전체가 방 상세로 이동하는 버튼이라 클릭이 전파되지 않게 막는다
  const stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleDelete = () => {
    deleteRoom(
      { roomId },
      {
        onSuccess: () => {
          setIsOpen(false);
          onDeleted(roomId);
          toast({ title: '방을 삭제했어요.', variant: 'success' });
        },
        onError: (error) => {
          setIsOpen(false);
          toast({ title: error.message, variant: 'error' });
        },
      },
    );
  };

  return (
    <div
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
      role="presentation"
    >
      <Button
        variant="primary-ghost"
        size="icon"
        className="absolute top-1 right-1 z-10 h-8 w-8 bg-gray-50/80 dark:bg-gray-900/80"
        aria-label={`${roomTitle} 방 삭제`}
        onClick={() => setIsOpen(true)}
      >
        <Trash2 size={16} />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>방을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {`"${roomTitle}" 방과 신청곡 ${musicCount}곡이 함께 삭제돼요.\n되돌릴 수 없어요.`}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              variant="gray-ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="red"
              size="sm"
              disabled={isPending}
              onClick={handleDelete}
            >
              삭제
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
