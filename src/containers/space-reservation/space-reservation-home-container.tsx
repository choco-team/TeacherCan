'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heading1, Heading3 } from '@/components/heading';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
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
  getMemberships,
  getRoomById,
  removeMembership,
} from '@/lib/space-reservation-repository';
import SpaceReservationHomeSkeleton from './space-reservation-home-skeleton';
import SpaceReservationWeekSummary from './space-reservation-week-summary';

export default function SpaceReservationHomeContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentRooms, setRecentRooms] = useState<
    Array<{ roomId: string; roomName: string }>
  >([]);
  const [leavingRoom, setLeavingRoom] = useState<{
    roomId: string;
    roomName: string;
  } | null>(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const memberships = getMemberships().sort((a, b) =>
          a.lastVisitedAt > b.lastVisitedAt ? -1 : 1,
        );

        const roomEntries = await Promise.all(
          memberships.map(async (membership) => {
            try {
              const room = await getRoomById(membership.roomId);
              if (!room) return null;

              return {
                roomId: room.id,
                roomName: room.name,
              };
            } catch (error) {
              console.error(error);
              return null;
            }
          }),
        );

        setRecentRooms(
          roomEntries.filter(
            (item): item is NonNullable<typeof item> => item !== null,
          ),
        );
      } catch (error) {
        console.error(error);
        setRecentRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleLeaveRoom = () => {
    if (!leavingRoom) return;

    removeMembership(leavingRoom.roomId);
    setRecentRooms((prev) =>
      prev.filter((room) => room.roomId !== leavingRoom.roomId),
    );
    setLeavingRoom(null);
  };

  if (isLoading) {
    return <SpaceReservationHomeSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Heading1>공간예약</Heading1>
        <p className="text-sm text-text-subtitle">
          공용 공간 사용 일정을 선생님들과 함께 예약해보세요.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/space-reservation/create">새 공간 만들기</Link>
        </Button>
      </div>

      <SpaceReservationWeekSummary />

      <Card>
        <CardHeader>
          <CardTitle>최근 참여한 공간</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {recentRooms.length === 0 ? (
            <p className="text-sm text-text-subtitle">
              아직 참여한 공간이 없어요. 먼저 공간을 만들거나 초대 링크로
              참여해보세요.
            </p>
          ) : (
            recentRooms.map((room) => (
              <div
                key={room.roomId}
                className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3"
              >
                <Heading3 className="min-w-0 flex-1 truncate">
                  {room.roomName}
                </Heading3>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="xs" asChild>
                    <Link href={`/space-reservation/rooms/${room.roomId}`}>
                      입장하기
                    </Link>
                  </Button>
                  <Button
                    size="xs"
                    variant="gray-outline"
                    onClick={() =>
                      setLeavingRoom({
                        roomId: room.roomId,
                        roomName: room.roomName,
                      })
                    }
                  >
                    나가기
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={leavingRoom !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setLeavingRoom(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 나가시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              나가면 이 공간은 목록에서 사라지고, 다시 참여하려면 초대 링크가
              필요해요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveRoom}>
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
