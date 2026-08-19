'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading1 } from '@/components/heading';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import LoadingSpinner from '@/components/loading-spinner';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { useToast } from '@/hooks/use-toast';
import {
  buildInviteLink,
  createReservation,
  deleteReservation,
  getCurrentParticipant,
  getMembership,
  getRoomById,
  getRoomParticipants,
  getRoomReservations,
  getWeekDates,
  kickParticipant,
  removeMembership,
} from '@/lib/space-reservation-repository';
import {
  SPACE_RESERVATION_PERIODS,
  SpaceReservationParticipant,
  SpaceReservationReservation,
  SpaceReservationRoom,
  SpaceReservationWeekday,
} from '@/types/space-reservation';

interface SpaceReservationRoomContainerProps {
  params: { roomId: string };
}

type ReservationFormState = {
  dateKey: string;
  period: string;
  purpose: string;
};

const PERIOD_ROWS: Array<{ label: string; period: number }> = [
  { label: '1교시', period: 1 },
  { label: '2교시', period: 2 },
  { label: '3교시', period: 3 },
  { label: '4교시', period: 4 },
  { label: '5교시', period: 5 },
  { label: '6교시', period: 6 },
];

const WEEKDAY_LABEL: Record<SpaceReservationWeekday, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
};

export default function SpaceReservationRoomContainer({
  params,
}: SpaceReservationRoomContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<SpaceReservationReservation | null>(null);
  const [pendingDeleteReservationId, setPendingDeleteReservationId] = useState<
    string | null
  >(null);
  const [reservationForm, setReservationForm] = useState<ReservationFormState>({
    dateKey: '',
    period: '1',
    purpose: '',
  });
  const [room, setRoom] = useState<SpaceReservationRoom | null>(null);
  const [participants, setParticipants] = useState<
    SpaceReservationParticipant[]
  >([]);
  const [reservations, setReservations] = useState<
    SpaceReservationReservation[]
  >([]);
  const [currentParticipant, setCurrentParticipant] =
    useState<SpaceReservationParticipant | null>(null);
  const [membership, setMembership] = useState<ReturnType<
    typeof getMembership
  > | null>(null);

  const weekDates = useMemo(
    () => (isMounted ? getWeekDates(weekOffset) : []),
    [isMounted, weekOffset],
  );

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        setIsMounted(true);
        const [
          roomData,
          participantsData,
          reservationsData,
          currentParticipantData,
        ] = await Promise.all([
          getRoomById(params.roomId),
          getRoomParticipants(params.roomId),
          getRoomReservations(params.roomId),
          getCurrentParticipant(params.roomId),
        ]);

        setRoom(roomData);
        setParticipants(participantsData);
        setReservations(reservationsData);
        setCurrentParticipant(currentParticipantData);
        setMembership(getMembership(params.roomId));
      } catch (error) {
        console.error(error);
        setRoom(null);
        setParticipants([]);
        setReservations([]);
        setCurrentParticipant(null);
      }
    };

    loadSnapshot();
  }, [params.roomId, refreshToken]);

  const reservationMap = useMemo(() => {
    return new Map(
      reservations.map((reservation) => [
        `${reservation.dateKey}-${reservation.period}`,
        reservation,
      ]),
    );
  }, [reservations]);

  const isAdmin = !!room && currentParticipant?.id === room.adminParticipantId;

  const refresh = () => setRefreshToken((previousValue) => previousValue + 1);

  const getInviteLink = () => {
    if (!room || typeof window === 'undefined') return '';
    return buildInviteLink({
      origin: window.location.origin,
      roomId: room.id,
      inviteToken: room.inviteToken,
    });
  };

  const handleCopyInviteLink = async () => {
    const inviteLink = getInviteLink();
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: '초대 링크를 복사했어요.',
        description: '동료 선생님에게 링크를 공유해 주세요.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: '복사에 실패했어요.',
        description: '브라우저 권한을 확인한 뒤 다시 시도해 주세요.',
      });
    }
  };

  const openCreateReservationDialog = (dateKey: string, period: number) => {
    setSelectedReservation(null);
    setReservationForm({
      dateKey,
      period: String(period),
      purpose: '',
    });
    setIsReservationDialogOpen(true);
  };

  const openReservationDetail = (reservation: SpaceReservationReservation) => {
    setSelectedReservation(reservation);
    setIsReservationDialogOpen(true);
  };

  const handleCreateReservation = async () => {
    if (!currentParticipant) return;
    if (!reservationForm.dateKey) return;

    const participantGrade = currentParticipant.grade?.trim() ?? '';
    const participantClassName = currentParticipant.className?.trim() ?? '';

    if (!participantGrade || !participantClassName) {
      toast({
        title: '학년/반 정보가 필요해요.',
        description: '입장 화면에서 학년/반을 먼저 입력해 주세요.',
      });
      return;
    }

    let result;
    try {
      result = await createReservation({
        roomId: params.roomId,
        dateKey: reservationForm.dateKey,
        period: Number(
          reservationForm.period,
        ) as (typeof SPACE_RESERVATION_PERIODS)[number],
        grade: participantGrade,
        className: participantClassName,
        purpose: reservationForm.purpose,
        createdByParticipantId: currentParticipant.id,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: '예약할 수 없어요.',
        description: 'Supabase 연결 상태를 확인한 뒤 다시 시도해 주세요.',
      });
      return;
    }

    if (!result.ok) {
      if (result.reason === 'DUPLICATED') {
        toast({
          title: '이미 예약된 시간이에요.',
          description: '다른 날짜나 교시를 선택해 주세요.',
        });
        return;
      }
      toast({
        title: '예약할 수 없어요.',
        description: '입력 내용을 확인한 뒤 다시 시도해 주세요.',
      });
      return;
    }

    toast({
      title: '예약을 등록했어요.',
      description: `${result.reservation.dateKey} ${result.reservation.period}교시`,
    });
    setIsReservationDialogOpen(false);
    refresh();
  };

  const canDeleteReservation = !!(
    currentParticipant &&
    selectedReservation &&
    (isAdmin ||
      selectedReservation.createdByParticipantId === currentParticipant.id)
  );

  const handleDeleteReservation = async () => {
    if (!pendingDeleteReservationId) return;
    try {
      await deleteReservation(pendingDeleteReservationId);
    } catch (error) {
      console.error(error);
      toast({
        title: '예약 삭제에 실패했어요.',
        description: '잠시 후 다시 시도해 주세요.',
      });
      return;
    }
    toast({
      title: '예약을 삭제했어요.',
      description: '삭제한 예약은 다시 되돌릴 수 없어요.',
    });
    setPendingDeleteReservationId(null);
    setIsReservationDialogOpen(false);
    refresh();
  };

  const handleKickParticipant = async (participantId: string) => {
    if (!room) return;

    let success = false;
    try {
      success = await kickParticipant({
        roomId: room.id,
        participantId,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: '참여자 관리에 실패했어요.',
        description: '잠시 후 다시 시도해 주세요.',
      });
      return;
    }
    if (!success) return;

    toast({
      title: '참여자를 내보냈어요.',
      description: '해당 사용자는 이 방에 다시 접근할 수 없어요.',
    });
    refresh();
  };

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  if (!room) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Heading1>공간예약</Heading1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-text-subtitle">
              방 정보를 찾을 수 없어요. 초대 링크를 다시 확인하거나 새 공간을
              만들어 주세요.
            </p>
            <Button asChild className="mt-4">
              <Link href="/space-reservation">공간예약 홈으로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentParticipant) {
    const inviteLinkPath = `/space-reservation/join/${room.id}?invite=${room.inviteToken}`;
    const blockedText = membership
      ? '내보내기된 사용자라 접근할 수 없어요.'
      : '예약표 참여를 위해 학년/반을 선택해 주세요.';

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Heading1>{room.name}</Heading1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-text-subtitle">{blockedText}</p>
            {!membership ? (
              <Button asChild className="mt-4">
                <Link href={inviteLinkPath}>예약표 참여하기</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="rounded-xl border border-border/60 bg-gradient-to-r from-primary-50 to-indigo-50 p-4 dark:from-primary-950/40 dark:to-indigo-950/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <Heading1>{room.name}</Heading1>
            <p className="text-sm text-text-subtitle">
              이번 주 / 이전 주 / 다음 주를 이동하며 예약을 관리해요.
            </p>
            {currentParticipant.grade && currentParticipant.className ? (
              <p className="text-xs text-text-subtitle">
                내 배정: {currentParticipant.grade}{' '}
                {currentParticipant.className}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isAdmin ? 'primary' : 'secondary'}>
              {isAdmin ? '관리자' : '참여 선생님'}
            </Badge>
            {isAdmin ? (
              <Button
                variant="gray-outline"
                size="sm"
                onClick={handleCopyInviteLink}
              >
                초대 링크 복사
              </Button>
            ) : null}
            {isAdmin ? (
              <Button
                variant="gray-outline"
                size="sm"
                onClick={() => setIsSettingsDialogOpen(true)}
              >
                설정
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">주간 예약표</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="gray-outline"
              size="xs"
              onClick={() => setWeekOffset((value) => value - 1)}
            >
              이전 주
            </Button>
            <Button
              variant={weekOffset === 0 ? 'primary' : 'gray-outline'}
              size="xs"
              onClick={() => setWeekOffset(0)}
            >
              이번 주
            </Button>
            <Button
              variant="gray-outline"
              size="xs"
              onClick={() => setWeekOffset((value) => value + 1)}
            >
              다음 주
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">교시</TableHead>
                {weekDates.map((dateItem) => (
                  <TableHead key={dateItem.dateKey} className="min-w-[120px]">
                    <div className="flex flex-col gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-2 text-center dark:border-primary-800 dark:bg-primary-900/20">
                      <span className="font-semibold">
                        {WEEKDAY_LABEL[dateItem.weekday]}
                      </span>
                      <span className="text-sm font-bold text-primary dark:text-primary-200">
                        {dateItem.label}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERIOD_ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="bg-gray-50 font-semibold dark:bg-gray-900">
                    {row.label}
                  </TableCell>
                  {weekDates.map((dateItem) => {
                    const reservation = reservationMap.get(
                      `${dateItem.dateKey}-${row.period}`,
                    );
                    return (
                      <TableCell key={`${row.period}-${dateItem.dateKey}`}>
                        {reservation ? (
                          <button
                            type="button"
                            onClick={() => openReservationDetail(reservation)}
                            className="group flex min-h-24 w-full flex-col items-start gap-1 rounded-lg border border-primary-300 bg-primary-100/90 px-3 py-2 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/30"
                          >
                            <span className="text-xs font-semibold text-primary">
                              {reservation.grade} {reservation.className}
                            </span>
                            {reservation.purpose ? (
                              <span className="line-clamp-2 text-xs text-text-title">
                                {reservation.purpose}
                              </span>
                            ) : null}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateReservationDialog(
                                dateItem.dateKey,
                                row.period ?? 1,
                              )
                            }
                            className="flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-border px-2 py-2 text-xs text-text-subtitle transition-colors hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                          >
                            비어 있음
                          </button>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={isReservationDialogOpen}
        onOpenChange={setIsReservationDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedReservation ? '예약 상세' : '예약 등록'}
            </DialogTitle>
            <DialogDescription>
              {selectedReservation
                ? '등록된 예약 정보를 확인하고 필요 시 삭제할 수 있어요.'
                : '날짜와 교시를 선택해 예약을 등록해 주세요.'}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation ? (
            <div className="flex flex-col gap-3 text-sm">
              <p>
                <span className="font-semibold">날짜</span>{' '}
                {selectedReservation.dateKey}
              </p>
              <p>
                <span className="font-semibold">교시</span>{' '}
                {selectedReservation.period}교시
              </p>
              <p>
                <span className="font-semibold">학년/반</span>{' '}
                {selectedReservation.grade} {selectedReservation.className}
              </p>
              {selectedReservation.purpose ? (
                <p>
                  <span className="font-semibold">사용 목적</span>{' '}
                  {selectedReservation.purpose}
                </p>
              ) : null}
              {canDeleteReservation ? (
                <Button
                  variant="gray-outline"
                  onClick={() =>
                    setPendingDeleteReservationId(selectedReservation.id)
                  }
                >
                  예약 삭제
                </Button>
              ) : (
                <p className="text-xs text-text-subtitle">
                  본인이 등록한 예약만 삭제할 수 있어요.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label required>날짜</Label>
                  <Select
                    value={reservationForm.dateKey}
                    onValueChange={(value) =>
                      setReservationForm((prev) => ({
                        ...prev,
                        dateKey: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="날짜 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDates.map((dateItem) => (
                        <SelectItem
                          key={dateItem.dateKey}
                          value={dateItem.dateKey}
                        >
                          {dateItem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label required>교시</Label>
                  <Select
                    value={reservationForm.period}
                    onValueChange={(value) =>
                      setReservationForm((prev) => ({ ...prev, period: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="교시 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPACE_RESERVATION_PERIODS.map((period) => (
                        <SelectItem key={period} value={String(period)}>
                          {period}교시
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-xs text-primary dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-200">
                학년/반은 입장 시 입력한 값이 자동 적용돼요.
                {currentParticipant.grade && currentParticipant.className
                  ? ` (${currentParticipant.grade} ${currentParticipant.className})`
                  : ''}
              </div>
              <div className="flex flex-col gap-2">
                <Label>사용 목적 (선택)</Label>
                <Textarea
                  placeholder="예: 음악 수업"
                  value={reservationForm.purpose}
                  onChange={(event) =>
                    setReservationForm((prev) => ({
                      ...prev,
                      purpose: event.target.value,
                    }))
                  }
                  maxLength={200}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="gray-outline"
                  onClick={() => setIsReservationDialogOpen(false)}
                >
                  취소
                </Button>
                <Button onClick={handleCreateReservation}>예약하기</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isAdmin ? (
        <Dialog
          open={isSettingsDialogOpen}
          onOpenChange={setIsSettingsDialogOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>관리자 설정</DialogTitle>
              <DialogDescription>
                참여자 목록을 관리할 수 있어요.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="gray-outline"
                  size="sm"
                  onClick={() => {
                    removeMembership(params.roomId);
                    router.push(
                      `/space-reservation/join/${room.id}?invite=${room.inviteToken}`,
                    );
                  }}
                >
                  다른 계정으로 테스트
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>참여 선생님 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>학년/반</TableHead>
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
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="gray-outline"
                                size="xs"
                                disabled={isCurrentAdmin}
                                onClick={() =>
                                  handleKickParticipant(participant.id)
                                }
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
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      <AlertDialog
        open={pendingDeleteReservationId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPendingDeleteReservationId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이 예약을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제하면 다시 되돌릴 수 없어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReservation}>
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
