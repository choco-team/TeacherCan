'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { LoaderCircle, Plus, PrinterIcon } from 'lucide-react';
import { Heading1 } from '@/components/heading';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Label } from '@/components/label';
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
import { ToastAction } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';
import { useSetBreadcrumbOverride } from '@/hooks/use-breadcrumb-override';
import {
  SPACE_RESERVATION_CLASS_OPTIONS,
  SPACE_RESERVATION_GENERIC_ERROR,
  SPACE_RESERVATION_GRADE_OPTIONS,
  SPACE_RESERVATION_PERIOD_ROWS,
  SPACE_RESERVATION_WEEKDAY_LABEL,
} from '@/constants/space-reservation';
import {
  buildInviteLink,
  createReservation,
  deleteReservation,
  formatWeekRangeLabel,
  getCurrentParticipant,
  getMembership,
  getRoomBans,
  getRoomById,
  getRoomParticipants,
  getRoomReservations,
  getWeekDateRange,
  getWeekDates,
  isPastDateKey,
  isTodayDateKey,
  kickParticipant,
  removeMembership,
  transferAdmin,
  unblockBan,
  updateMyGradeClass,
  updateReservation,
  updateRoomName,
} from '@/lib/space-reservation-repository';
import {
  SPACE_RESERVATION_PERIODS,
  SpaceReservationBan,
  SpaceReservationParticipant,
  SpaceReservationReservation,
  SpaceReservationRoom,
} from '@/types/space-reservation';
import SpaceReservationRoomSkeleton from './space-reservation-room-skeleton';
import SpaceReservationReservationDialog from './space-reservation-reservation-dialog';
import SpaceReservationSettingsDialog from './space-reservation-settings-dialog';

interface SpaceReservationRoomContainerProps {
  params: { roomId: string };
}

type ReservationFormState = {
  dateKey: string;
  period: string;
  purpose: string;
};

function getWeekdayHeaderClassName(isToday: boolean, isPast: boolean) {
  if (isToday) {
    return 'border-primary-400 bg-primary-100 dark:border-primary-500 dark:bg-primary-900/40';
  }
  if (isPast) {
    return 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-gray-900';
  }
  return 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20';
}

function getReservationCellClassName(isPast: boolean, isMine: boolean) {
  if (isPast) {
    return 'border-gray-200 bg-gray-100 text-gray-500 dark:border-gray-800 dark:bg-gray-900';
  }
  if (isMine) {
    return 'border-primary-300 bg-primary-100/90 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/30';
  }
  return 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/30';
}

function getReservationLabelClassName(isPast: boolean, isMine: boolean) {
  if (isPast) return 'text-gray-500';
  if (isMine) return 'text-primary';
  return 'text-indigo-700 dark:text-indigo-200';
}

export default function SpaceReservationRoomContainer({
  params,
}: SpaceReservationRoomContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const print = useReactToPrint({ contentRef: printRef });
  const [isLoading, setIsLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [isEditingReservation, setIsEditingReservation] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
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
  const [bans, setBans] = useState<SpaceReservationBan[]>([]);
  const [currentParticipant, setCurrentParticipant] =
    useState<SpaceReservationParticipant | null>(null);
  const [membership, setMembership] = useState<ReturnType<
    typeof getMembership
  > | null>(null);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSavingGradeClass, setIsSavingGradeClass] = useState(false);
  const [gradeDraft, setGradeDraft] = useState('');
  const [classDraft, setClassDraft] = useState('');

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const weekRangeLabel = useMemo(
    () => formatWeekRangeLabel(weekOffset),
    [weekOffset],
  );

  useSetBreadcrumbOverride(room?.name ?? null);

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        const range = getWeekDateRange(weekOffset);
        const [
          roomData,
          participantsData,
          reservationsData,
          currentParticipantData,
        ] = await Promise.all([
          getRoomById(params.roomId),
          getRoomParticipants(params.roomId),
          getRoomReservations(params.roomId, range),
          getCurrentParticipant(params.roomId),
        ]);

        let bansData: SpaceReservationBan[] = [];
        try {
          bansData = await getRoomBans(params.roomId);
        } catch (error) {
          console.error(error);
        }

        setRoom(roomData);
        setParticipants(participantsData);
        setReservations(reservationsData);
        setBans(bansData);
        setCurrentParticipant(currentParticipantData);
        setMembership(getMembership(params.roomId));
      } catch (error) {
        console.error(error);
        setRoom((previous) => previous);
        setParticipants((previous) => previous);
        setReservations((previous) => previous);
        setCurrentParticipant((previous) => previous);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnapshot();
  }, [params.roomId, refreshToken, weekOffset]);

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

  const showConflictToast = (title: string) => {
    toast({
      title,
      description: '화면을 새로고침해 최신 예약 상태를 확인해 주세요.',
      variant: 'error',
      duration: 8000,
      action: (
        <ToastAction altText="새로고침" onClick={refresh}>
          새로고침
        </ToastAction>
      ),
    });
  };

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
        variant: 'error',
      });
    }
  };

  const openCreateReservationDialog = (dateKey: string, period: number) => {
    setSelectedReservation(null);
    setIsEditingReservation(false);
    setReservationForm({
      dateKey,
      period: String(period),
      purpose: '',
    });
    setIsReservationDialogOpen(true);
  };

  const openReservationDetail = (reservation: SpaceReservationReservation) => {
    setSelectedReservation(reservation);
    setIsEditingReservation(false);
    setReservationForm({
      dateKey: reservation.dateKey,
      period: String(reservation.period),
      purpose: reservation.purpose,
    });
    setIsReservationDialogOpen(true);
  };

  const handleSubmitReservation = async () => {
    if (!currentParticipant) return;
    if (!reservationForm.dateKey) return;

    const participantGrade = currentParticipant.grade?.trim() ?? '';
    const participantClassName = currentParticipant.className?.trim() ?? '';

    if (!selectedReservation && (!participantGrade || !participantClassName)) {
      toast({
        title: '학년/반 정보가 필요해요.',
        description: '학년/반을 먼저 입력해 주세요.',
        variant: 'error',
      });
      return;
    }

    setIsSubmittingReservation(true);
    try {
      if (selectedReservation) {
        const result = await updateReservation({
          reservationId: selectedReservation.id,
          dateKey: reservationForm.dateKey,
          period: Number(reservationForm.period),
          purpose: reservationForm.purpose,
        });

        if (!result.ok) {
          if (result.reason === 'DUPLICATED') {
            showConflictToast('이미 예약된 시간이에요.');
            return;
          }
          toast({
            title: '예약을 수정할 수 없어요.',
            description: SPACE_RESERVATION_GENERIC_ERROR,
            variant: 'error',
          });
          return;
        }

        toast({ title: '예약을 수정했어요.' });
      } else {
        const result = await createReservation({
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

        if (!result.ok) {
          if (result.reason === 'DUPLICATED') {
            showConflictToast('이미 예약된 시간이에요.');
            return;
          }
          toast({
            title: '예약할 수 없어요.',
            description: SPACE_RESERVATION_GENERIC_ERROR,
            variant: 'error',
          });
          return;
        }

        toast({
          title: '예약을 등록했어요.',
          description: `${result.reservation.dateKey} ${result.reservation.period}교시`,
        });
      }

      setIsReservationDialogOpen(false);
      setIsEditingReservation(false);
      refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '예약할 수 없어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  const canManageReservation = !!(
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
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
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

    try {
      const success = await kickParticipant({
        roomId: room.id,
        participantId,
      });
      if (!success) return;
      toast({
        title: '참여자를 내보냈어요.',
        description: '해당 학년/반은 이 방에 다시 접근할 수 없어요.',
      });
      refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '참여자 관리에 실패했어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    }
  };

  const handleSaveRoomName = async (name: string) => {
    setIsSavingName(true);
    try {
      const result = await updateRoomName({
        roomId: params.roomId,
        name,
      });
      if (!result.ok) {
        toast({
          title: '이름을 바꿀 수 없어요.',
          description: '공간 이름을 입력해 주세요.',
          variant: 'error',
        });
        return;
      }
      toast({ title: '공간 이름을 바꿨어요.' });
      refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '이름을 바꿀 수 없어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const handleTransferAdmin = async (participantId: string) => {
    if (!currentParticipant) return;
    setIsTransferring(true);
    try {
      const result = await transferAdmin({
        roomId: params.roomId,
        fromParticipantId: currentParticipant.id,
        toParticipantId: participantId,
      });
      if (!result.ok) {
        toast({
          title: '관리자를 위임할 수 없어요.',
          description: SPACE_RESERVATION_GENERIC_ERROR,
          variant: 'error',
        });
        return;
      }
      toast({ title: '관리자를 위임했어요.' });
      setIsSettingsDialogOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '관리자를 위임할 수 없어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleUnblock = async (banId: string) => {
    try {
      await unblockBan(banId);
      toast({ title: '차단을 해제했어요.' });
      refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '차단을 해제할 수 없어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    }
  };

  const handleSaveGradeClass = async () => {
    if (!currentParticipant || !gradeDraft || !classDraft) return;
    setIsSavingGradeClass(true);
    try {
      const result = await updateMyGradeClass({
        participantId: currentParticipant.id,
        grade: `${gradeDraft}학년`,
        className: `${classDraft}반`,
      });
      if (!result.ok) {
        toast({
          title: '이미 선택된 학년/반이에요.',
          description: '다른 학년/반을 선택해 주세요.',
          variant: 'error',
        });
        return;
      }
      toast({ title: '학년/반을 바꿨어요.' });
      setIsGradeDialogOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '학년/반을 바꿀 수 없어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
    } finally {
      setIsSavingGradeClass(false);
    }
  };

  const handleLeaveRoom = () => {
    removeMembership(params.roomId);
    router.push('/space-reservation');
  };

  if (isLoading) {
    return <SpaceReservationRoomSkeleton />;
  }

  if (!room) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
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
              {weekRangeLabel} 예약을 확인하고 관리해요.
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
            <Button
              variant="gray-outline"
              size="sm"
              onClick={() => {
                setGradeDraft(
                  currentParticipant.grade?.replace('학년', '') ?? '',
                );
                setClassDraft(
                  currentParticipant.className?.replace('반', '') ?? '',
                );
                setIsGradeDialogOpen(true);
              }}
            >
              학년/반 변경
            </Button>
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
            <Button variant="gray-outline" size="sm" onClick={() => print()}>
              <PrinterIcon className="mr-1 size-4" />
              인쇄
            </Button>
            <Button
              variant="gray-outline"
              size="sm"
              onClick={() => setIsLeaveDialogOpen(true)}
            >
              나가기
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">
            주간 예약표 · {weekRangeLabel}
          </CardTitle>
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
          <div ref={printRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">교시</TableHead>
                  {weekDates.map((dateItem) => {
                    const isPast = isPastDateKey(dateItem.dateKey);
                    const isToday = isTodayDateKey(dateItem.dateKey);

                    return (
                      <TableHead
                        key={dateItem.dateKey}
                        className="min-w-[120px]"
                      >
                        <div
                          className={`flex flex-col gap-1 rounded-lg border px-2 py-2 text-center ${getWeekdayHeaderClassName(
                            isToday,
                            isPast,
                          )}`}
                        >
                          <span className="font-semibold">
                            {SPACE_RESERVATION_WEEKDAY_LABEL[dateItem.weekday]}
                            {isToday ? ' · 오늘' : ''}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              isPast
                                ? 'text-gray-400'
                                : 'text-primary dark:text-primary-200'
                            }`}
                          >
                            {dateItem.label}
                          </span>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {SPACE_RESERVATION_PERIOD_ROWS.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="bg-gray-50 font-semibold dark:bg-gray-900">
                      {row.label}
                    </TableCell>
                    {weekDates.map((dateItem) => {
                      const reservation = reservationMap.get(
                        `${dateItem.dateKey}-${row.period}`,
                      );
                      const isPast = isPastDateKey(dateItem.dateKey);
                      const isMine =
                        !!reservation &&
                        reservation.createdByParticipantId ===
                          currentParticipant.id;

                      if (reservation) {
                        return (
                          <TableCell key={`${row.period}-${dateItem.dateKey}`}>
                            <button
                              type="button"
                              onClick={() => openReservationDetail(reservation)}
                              className={`group flex min-h-24 w-full flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left shadow-sm transition-all hover:-translate-y-0.5 ${getReservationCellClassName(
                                isPast,
                                isMine,
                              )}`}
                            >
                              <span
                                className={`text-xs font-semibold ${getReservationLabelClassName(
                                  isPast,
                                  isMine,
                                )}`}
                              >
                                {reservation.grade} {reservation.className}
                                {isMine ? ' · 내 예약' : ''}
                              </span>
                              {reservation.purpose ? (
                                <span className="line-clamp-2 text-xs text-text-title">
                                  {reservation.purpose}
                                </span>
                              ) : null}
                            </button>
                          </TableCell>
                        );
                      }

                      if (isPast) {
                        return (
                          <TableCell key={`${row.period}-${dateItem.dateKey}`}>
                            <div className="flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900">
                              지난 일정
                            </div>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={`${row.period}-${dateItem.dateKey}`}>
                          <button
                            type="button"
                            onClick={() =>
                              openCreateReservationDialog(
                                dateItem.dateKey,
                                row.period,
                              )
                            }
                            className="flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border px-2 py-2 text-xs text-text-subtitle transition-colors hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                          >
                            <Plus className="size-4" />
                            예약
                          </button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SpaceReservationReservationDialog
        open={isReservationDialogOpen}
        onOpenChange={(open) => {
          setIsReservationDialogOpen(open);
          if (!open) setIsEditingReservation(false);
        }}
        selectedReservation={selectedReservation}
        isEditing={isEditingReservation}
        onStartEdit={() => setIsEditingReservation(true)}
        reservationForm={reservationForm}
        onFormChange={setReservationForm}
        weekDates={weekDates}
        isSubmitting={isSubmittingReservation}
        canManage={canManageReservation}
        onSubmit={handleSubmitReservation}
        onDelete={() =>
          selectedReservation &&
          setPendingDeleteReservationId(selectedReservation.id)
        }
      />

      {isAdmin ? (
        <SpaceReservationSettingsDialog
          open={isSettingsDialogOpen}
          onOpenChange={setIsSettingsDialogOpen}
          room={room}
          inviteLink={getInviteLink()}
          participants={participants}
          bans={bans}
          currentParticipantId={currentParticipant.id}
          isSavingName={isSavingName}
          isTransferring={isTransferring}
          onCopyInviteLink={handleCopyInviteLink}
          onSaveName={handleSaveRoomName}
          onKick={handleKickParticipant}
          onTransfer={handleTransferAdmin}
          onUnblock={handleUnblock}
        />
      ) : null}

      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>학년/반 변경</DialogTitle>
            <DialogDescription>
              이후 예약에는 바꾼 학년/반이 표시돼요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label required>학년</Label>
              <Select value={gradeDraft} onValueChange={setGradeDraft}>
                <SelectTrigger>
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
              <Label required>반</Label>
              <Select value={classDraft} onValueChange={setClassDraft}>
                <SelectTrigger>
                  <SelectValue placeholder="반 선택" />
                </SelectTrigger>
                <SelectContent>
                  {SPACE_RESERVATION_CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="gray-outline"
              onClick={() => setIsGradeDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              disabled={!gradeDraft || !classDraft || isSavingGradeClass}
              onClick={handleSaveGradeClass}
            >
              {isSavingGradeClass ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                '저장'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
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
