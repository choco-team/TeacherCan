'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading1 } from '@/components/heading';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Label } from '@/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import {
  decodeInviteSeed,
  getCurrentParticipant,
  getRoomById,
  getRoomParticipants,
  isBlockedParticipant,
  joinRoom,
} from '@/lib/space-reservation-storage';
import { useToast } from '@/hooks/use-toast';

const GRADE_OPTIONS = Array.from({ length: 6 }, (_, index) =>
  String(index + 1),
);
const CLASS_OPTIONS = Array.from({ length: 20 }, (_, index) =>
  String(index + 1),
);

interface SpaceReservationJoinContainerProps {
  params: { roomId: string };
  searchParams: { invite?: string; seed?: string };
}

export default function SpaceReservationJoinContainer({
  params,
  searchParams,
}: SpaceReservationJoinContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');

  const room = useMemo(
    () => (isMounted ? getRoomById(params.roomId) : null),
    [isMounted, params.roomId],
  );
  const inviteToken = searchParams.invite?.trim() ?? '';
  const seed = searchParams.seed?.trim() ?? '';
  const seedData = useMemo(
    () => (isMounted ? decodeInviteSeed(seed) : null),
    [isMounted, seed],
  );
  const occupiedPairs = useMemo(() => {
    if (!isMounted) return new Set<string>();

    const participants = room
      ? getRoomParticipants(room.id)
      : (seedData?.participants ?? []).filter(
          (participant) => !participant.kickedAt,
        );

    return new Set(
      participants
        .filter((participant) => participant.grade && participant.className)
        .map((participant) => `${participant.grade}-${participant.className}`),
    );
  }, [isMounted, room, seedData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const participant = getCurrentParticipant(params.roomId);
    if (
      participant &&
      !isBlockedParticipant(params.roomId, { participantId: participant.id })
    ) {
      router.replace(`/space-reservation/rooms/${params.roomId}`);
    }
  }, [isMounted, params.roomId, router]);

  const handleJoin = () => {
    const result = joinRoom({
      roomId: params.roomId,
      inviteToken,
      grade: `${grade}학년`,
      className: `${className}반`,
      seed,
    });

    if (!result.ok) {
      if (result.reason === 'BLOCKED_PARTICIPANT') {
        toast({
          title: '입장할 수 없어요.',
          description: '관리자가 내보낸 기기에서는 다시 접근할 수 없어요.',
        });
        return;
      }
      if (result.reason === 'INVITE_TOKEN_INVALID') {
        toast({
          title: '초대 링크가 유효하지 않아요.',
          description: '관리자에게 링크를 다시 받아 주세요.',
        });
        return;
      }
      if (result.reason === 'GRADE_CLASS_TAKEN') {
        toast({
          title: '이미 선택된 학년/반이에요.',
          description: '다른 학년/반을 선택해 주세요.',
        });
        return;
      }
      toast({
        title: '공간을 찾지 못했어요.',
        description:
          '서버 연동 전 MVP라 다른 기기에서는 최신 상태가 반영되지 않을 수 있어요.',
      });
      return;
    }

    toast({
      title: '예약표에 참여했어요.',
      description: `${result.room.name} 예약표로 이동합니다.`,
    });
    router.push(`/space-reservation/rooms/${params.roomId}`);
  };

  const roomName = room?.name ?? seedData?.room.name ?? '공간예약';

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading1>{roomName}</Heading1>
        <p className="text-sm text-text-subtitle">
          예약표 참여를 위해 학년과 반을 선택해 주세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>초대 링크 입장</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!inviteToken ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20">
              초대 토큰이 없어 참여할 수 없어요. 링크를 다시 확인해 주세요.
            </p>
          ) : null}
          {seed && !room ? (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
              서버 연동 전 MVP라 초대 시점 데이터로 방을 복원해 입장해요.
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="joinGrade" required>
                학년
              </Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="joinGrade">
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="joinClassName" required>
                반
              </Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger id="joinClassName">
                  <SelectValue placeholder="반 선택" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      disabled={occupiedPairs.has(`${grade}학년-${option}반`)}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            disabled={
              !inviteToken ||
              grade.trim().length === 0 ||
              className.trim().length === 0
            }
            onClick={handleJoin}
          >
            참여하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
