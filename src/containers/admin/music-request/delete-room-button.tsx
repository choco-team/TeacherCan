'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
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
import { deleteRoomAction } from '@/app/admin/music-request/actions';

type Props = {
  roomId: string;
  roomTitle: string;
  musicCount: number;
};

export default function DeleteRoomButton({
  roomId,
  roomTitle,
  musicCount,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="red" size="xs">
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>방을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {`"${roomTitle}" 방과 신청곡 ${musicCount}곡이 함께 삭제됩니다.\n되돌릴 수 없습니다.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="gray-ghost" size="sm">
              취소
            </Button>
          </AlertDialogCancel>
          <form action={deleteRoomAction}>
            <input type="hidden" name="roomId" value={roomId} />
            <AlertDialogAction asChild>
              <Button type="submit" variant="red" size="sm">
                삭제
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
