'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
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
  getCurrentParticipant,
  getRoomById,
  getRoomParticipants,
  joinRoom,
} from '@/lib/space-reservation-repository';
import { useToast } from '@/hooks/use-toast';
import { useSetBreadcrumbOverride } from '@/hooks/use-breadcrumb-override';
import {
  SPACE_RESERVATION_CLASS_OPTIONS,
  SPACE_RESERVATION_GENERIC_ERROR,
  SPACE_RESERVATION_GRADE_OPTIONS,
} from '@/constants/space-reservation';
import { Skeleton } from '@/components/skeleton';
import { SpaceReservationRoom } from '@/types/space-reservation';

interface SpaceReservationJoinContainerProps {
  params: { roomId: string };
  searchParams: { invite?: string };
}

export default function SpaceReservationJoinContainer({
  params,
  searchParams,
}: SpaceReservationJoinContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [room, setRoom] = useState<SpaceReservationRoom | null>(null);
  const [occupiedLabels, setOccupiedLabels] = useState<string[]>([]);
  const [occupiedPairs, setOccupiedPairs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inviteToken = searchParams.invite?.trim() ?? '';

  useSetBreadcrumbOverride(room?.name ?? null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const participant = await getCurrentParticipant(params.roomId);
        if (participant) {
          router.replace(`/space-reservation/rooms/${params.roomId}`);
          return;
        }

        const nextRoom = await getRoomById(params.roomId);
        setRoom(nextRoom);
        if (nextRoom) {
          const participants = await getRoomParticipants(nextRoom.id);
          const nextPairs = new Set(
            participants
              .filter((item) => item.grade && item.className)
              .map((item) => `${item.grade}-${item.className}`),
          );
          setOccupiedPairs(nextPairs);
          setOccupiedLabels(
            participants
              .filter((item) => item.grade && item.className)
              .map((item) => `${item.grade} ${item.className}`),
          );
        }
      } catch (error) {
        console.error(error);
        setRoom(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [params.roomId, router]);

  const handleJoin = async () => {
    setIsSubmitting(true);
    try {
      const result = await joinRoom({
        roomId: params.roomId,
        inviteToken,
        grade: `${grade}학년`,
        className: `${className}반`,
      });

      if (!result.ok) {
        if (result.reason === 'BLOCKED_PARTICIPANT') {
          toast({
            title: '입장할 수 없어요.',
            description: '관리자가 내보낸 학년/반은 다시 접근할 수 없어요.',
            variant: 'error',
          });
          return;
        }
        if (result.reason === 'INVITE_TOKEN_INVALID') {
          toast({
            title: '초대 링크가 유효하지 않아요.',
            description: '관리자에게 링크를 다시 받아 주세요.',
            variant: 'error',
          });
          return;
        }
        if (result.reason === 'GRADE_CLASS_TAKEN') {
          toast({
            title: '이미 선택된 학년/반이에요.',
            description: '다른 학년/반을 선택해 주세요.',
            variant: 'error',
          });
          return;
        }
        toast({
          title: '공간을 찾지 못했어요.',
          description: '초대 링크와 공간 정보를 다시 확인해 주세요.',
          variant: 'error',
        });
        return;
      }

      toast({
        title: '예약표에 참여했어요.',
        description: `${result.room.name} 예약표로 이동합니다.`,
      });
      router.push(`/space-reservation/rooms/${params.roomId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: '참여할 수 없어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <Heading1>공간을 찾지 못했어요</Heading1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-text-subtitle">
              초대 링크가 잘못되었거나 방이 없어요. 관리자에게 링크를 다시 받아
              주세요.
            </p>
            <Button asChild className="mt-4">
              <Link href="/space-reservation">공간예약 홈으로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading1>{room.name}</Heading1>
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
          {occupiedLabels.length > 0 ? (
            <p className="text-xs text-text-subtitle">
              이미 참여 중: {occupiedLabels.join(', ')}
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
                  {SPACE_RESERVATION_GRADE_OPTIONS.map((option) => (
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
                  {SPACE_RESERVATION_CLASS_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      disabled={occupiedPairs.has(`${grade}학년-${option}반`)}
                    >
                      {occupiedPairs.has(`${grade}학년-${option}반`)
                        ? `${option} (참여 중)`
                        : option}
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
              className.trim().length === 0 ||
              isSubmitting
            }
            onClick={handleJoin}
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              '참여하기'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
