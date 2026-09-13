'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import {
  SpaceReservationBan,
  SpaceReservationParticipant,
  SpaceReservationRoom,
} from '@/types/space-reservation';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: SpaceReservationRoom;
  inviteLink: string;
  participants: SpaceReservationParticipant[];
  bans: SpaceReservationBan[];
  currentParticipantId: string;
  isSavingName: boolean;
  isTransferring: boolean;
  onCopyInviteLink: () => void;
  onSaveName: (name: string) => Promise<void> | void;
  onKick: (participantId: string) => Promise<void> | void;
  onTransfer: (participantId: string) => Promise<void> | void;
  onUnblock: (banId: string) => Promise<void> | void;
};

export default function SpaceReservationSettingsDialog({
  open,
  onOpenChange,
  room,
  inviteLink,
  participants,
  bans,
  currentParticipantId,
  isSavingName,
  isTransferring,
  onCopyInviteLink,
  onSaveName,
  onKick,
  onTransfer,
  onUnblock,
}: Props) {
  const [roomName, setRoomName] = useState(room.name);
  const [transferTargetId, setTransferTargetId] = useState('');
  const [pendingKick, setPendingKick] =
    useState<SpaceReservationParticipant | null>(null);
  const [isTransferConfirmOpen, setIsTransferConfirmOpen] = useState(false);
  const [unblockingBanId, setUnblockingBanId] = useState<string | null>(null);

  const transferableParticipants = participants.filter(
    (participant) => participant.id !== room.adminParticipantId,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setRoomName(room.name);
      setTransferTargetId('');
    }
    onOpenChange(nextOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>관리자 설정</DialogTitle>
            <DialogDescription>
              방 정보, 초대, 참여자를 관리할 수 있어요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>공간 이름</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={roomName}
                  onChange={(event) => setRoomName(event.target.value)}
                  maxLength={30}
                />
                <Button
                  disabled={
                    isSavingName ||
                    roomName.trim().length === 0 ||
                    roomName.trim() === room.name
                  }
                  onClick={() => onSaveName(roomName)}
                >
                  {isSavingName ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    '이름 저장'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>초대 QR</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-3">
                <div className="rounded-md bg-white p-3">
                  <QRCodeCanvas value={inviteLink} size={180} />
                </div>
                <Button
                  variant="gray-outline"
                  size="sm"
                  onClick={onCopyInviteLink}
                >
                  초대 링크 복사
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>관리자 위임</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Select
                  value={transferTargetId}
                  onValueChange={setTransferTargetId}
                  disabled={transferableParticipants.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        transferableParticipants.length === 0
                          ? '위임할 참여자가 없어요'
                          : '위임할 선생님 선택'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {transferableParticipants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.grade} {participant.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="gray-outline"
                  disabled={!transferTargetId || isTransferring}
                  onClick={() => setIsTransferConfirmOpen(true)}
                >
                  위임하기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>참여 선생님 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>학년/반</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead className="w-32">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => {
                      const isCurrentAdmin =
                        participant.id === room.adminParticipantId;

                      return (
                        <TableRow key={participant.id}>
                          <TableCell className="text-xs text-text-subtitle">
                            {participant.grade && participant.className
                              ? `${participant.grade} ${participant.className}`
                              : '미입력'}
                            {participant.id === currentParticipantId
                              ? ' (나)'
                              : ''}
                          </TableCell>
                          <TableCell className="text-xs">
                            {isCurrentAdmin ? '관리자' : '참여 선생님'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="gray-outline"
                              size="xs"
                              disabled={isCurrentAdmin}
                              onClick={() => setPendingKick(participant)}
                            >
                              내보내기
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>차단된 학년/반</CardTitle>
              </CardHeader>
              <CardContent>
                {bans.length === 0 ? (
                  <p className="text-sm text-text-subtitle">
                    차단된 학년/반이 없어요.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>학년/반</TableHead>
                        <TableHead className="w-32">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bans.map((ban) => (
                        <TableRow key={ban.id}>
                          <TableCell className="text-xs text-text-subtitle">
                            {ban.grade} {ban.className}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="gray-outline"
                              size="xs"
                              disabled={unblockingBanId === ban.id}
                              onClick={async () => {
                                setUnblockingBanId(ban.id);
                                try {
                                  await onUnblock(ban.id);
                                } finally {
                                  setUnblockingBanId(null);
                                }
                              }}
                            >
                              차단 해제
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingKick !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingKick(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이 선생님을 내보낼까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingKick
                ? `${pendingKick.grade} ${pendingKick.className}을 내보내면 이 공간에서 다시 참여할 수 없고, 해당 선생님이 등록한 예약도 모두 삭제돼요.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingKick) return;
                await onKick(pendingKick.id);
                setPendingKick(null);
              }}
            >
              내보내기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isTransferConfirmOpen}
        onOpenChange={setIsTransferConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>관리자를 위임할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              위임하면 더 이상 이 공간의 관리자가 아니에요. 설정과 초대는 새
              관리자만 할 수 있어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!transferTargetId) return;
                await onTransfer(transferTargetId);
                setIsTransferConfirmOpen(false);
              }}
            >
              위임하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
