import { Button } from '@/components/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { Switch } from '@/components/switch';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';

import { QRCodeCanvas } from 'qrcode.react';
import { Dispatch, SetStateAction, useState } from 'react';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  roomTitle: string;
  roomId: string;
  isAutoRefetch: boolean;
  setIsAutoRefetch: Dispatch<SetStateAction<boolean>>;
};

export default function RoomInfo({
  roomTitle,
  roomId,
  isAutoRefetch,
  setIsAutoRefetch,
}: Props) {
  const { toast } = useToast();

  const [roomIds, setRoomIds] = useLocalStorage<string[] | null>('roomIds', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInList = roomIds?.includes(roomId) ?? true;

  const toggleSave = () => {
    if (isInList) {
      setIsModalOpen(true);
      setRoomIds(roomIds?.filter((id) => id !== roomId));

      return;
    }

    if (roomIds.length > 2) {
      toast({
        title: '목록에 최대 3개의 방만 노출할 수 있어요.',
        variant: 'error',
      });

      return;
    }

    toast({
      title: '목록에 추가되었어요.',
      variant: 'success',
    });

    setRoomIds([...roomIds, roomId]);
  };

  // NOTE:(김홍동) 예시 페이지에서는 학생 초대 막기
  if (roomId === 'c15fa864-8719-41e9-99f4-4bcf64086d42') {
    return (
      <div className="flex flex-col gap-4 mt-12 justify-center items-center">
        <div className="text-center text-sm text-gray-500">
          <span>선생님들께 예시로 보여드리는 음악 신청 페이지예요.</span>
          <br />
          <span>
            직접 방을 만들어 학생들을 초대해보시면 신청 기능을 더 자세히
            체험해보실 수 있어요.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 rounded">
      <div className="px-2 text-gray-700 dark:text-gray-200">
        방 이름: {roomTitle}
      </div>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`${originURL}/music-request/student/${roomId}`}
          size={380}
        />
      </div>
      <div className="w-hull h-[1px] bg-gray-100 dark:bg-gray-800" />
      <Label className="flex items-center justify-between gap-x-2">
        <span className="pl-2 text-text-title">자동 업데이트</span>
        <Switch
          checked={isAutoRefetch}
          onClick={() => setIsAutoRefetch((prev) => !prev)}
        />
      </Label>
      <Label className="flex items-center justify-between gap-x-2">
        <span className="pl-2 text-text-title">목록 노출</span>
        <Switch checked={isInList} onClick={toggleSave} />
      </Label>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>{roomTitle} 미노출</AlertDialogTitle>
          <AlertDialogDescription>
            해당 음악신청 방을 목록에서 미노출하시겠습니까?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              variant="gray-ghost"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                setRoomIds([...roomIds, roomId]);
              }}
            >
              취소
            </Button>
            <Button
              variant="red"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              미노출
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
