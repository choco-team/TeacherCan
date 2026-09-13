'use client';

import { FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import {
  SPACE_RESERVATION_PERIODS,
  SpaceReservationReservation,
  SpaceReservationWeekday,
} from '@/types/space-reservation';
import { SPACE_RESERVATION_WEEKDAY_LABEL } from '@/constants/space-reservation';
import { isPastDateKey } from '@/lib/space-reservation-repository';

type WeekDateOption = {
  weekday: SpaceReservationWeekday;
  dateKey: string;
  label: string;
};

type ReservationFormState = {
  dateKey: string;
  period: string;
  purpose: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReservation: SpaceReservationReservation | null;
  isEditing: boolean;
  onStartEdit: () => void;
  reservationForm: ReservationFormState;
  onFormChange: (next: ReservationFormState) => void;
  weekDates: WeekDateOption[];
  isSubmitting: boolean;
  canManage: boolean;
  onSubmit: () => void;
  onDelete: () => void;
};

export default function SpaceReservationReservationDialog({
  open,
  onOpenChange,
  selectedReservation,
  isEditing,
  onStartEdit,
  reservationForm,
  onFormChange,
  weekDates,
  isSubmitting,
  canManage,
  onSubmit,
  onDelete,
}: Props) {
  const selectedWeekDate = weekDates.find(
    (item) => item.dateKey === reservationForm.dateKey,
  );
  const lockedSlotLabel = selectedWeekDate
    ? `${SPACE_RESERVATION_WEEKDAY_LABEL[selectedWeekDate.weekday]} ${selectedWeekDate.label} ${reservationForm.period}교시`
    : '';

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const showForm = !selectedReservation || isEditing;
  const dialogTitle = (() => {
    if (!selectedReservation) return '예약 등록';
    if (showForm) return '예약 수정';
    return '예약 상세';
  })();
  const dialogDescription = (() => {
    if (!selectedReservation) return '선택한 날짜와 교시에 예약을 등록해요.';
    if (showForm) return '날짜와 교시, 사용 목적을 수정할 수 있어요.';
    return '등록된 예약 정보를 확인하고 필요 시 수정하거나 삭제할 수 있어요.';
  })();
  const submitLabel = (() => {
    if (isSubmitting) return <LoaderCircle className="size-4 animate-spin" />;
    if (selectedReservation) return '수정하기';
    return '예약하기';
  })();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {selectedReservation && !showForm ? (
          <div className="flex flex-col gap-3 text-sm">
            <p>
              <span className="font-semibold">날짜</span>{' '}
              {SPACE_RESERVATION_WEEKDAY_LABEL[selectedReservation.weekday]}{' '}
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
            {canManage ? (
              <div className="flex justify-end gap-2">
                <Button variant="gray-outline" onClick={onStartEdit}>
                  수정하기
                </Button>
                <Button variant="gray-outline" onClick={onDelete}>
                  예약 삭제
                </Button>
              </div>
            ) : (
              <p className="text-xs text-text-subtitle">
                본인이 등록한 예약만 수정하거나 삭제할 수 있어요.
              </p>
            )}
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {selectedReservation ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label required>날짜</Label>
                  <Select
                    value={reservationForm.dateKey}
                    onValueChange={(value) =>
                      onFormChange({ ...reservationForm, dateKey: value })
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
                          disabled={isPastDateKey(dateItem.dateKey)}
                        >
                          {SPACE_RESERVATION_WEEKDAY_LABEL[dateItem.weekday]}{' '}
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
                      onFormChange({ ...reservationForm, period: value })
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
            ) : (
              <div className="rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-200">
                {lockedSlotLabel}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>사용 목적 (선택)</Label>
              <Textarea
                placeholder="예: 음악 수업"
                value={reservationForm.purpose}
                onChange={(event) =>
                  onFormChange({
                    ...reservationForm,
                    purpose: event.target.value,
                  })
                }
                maxLength={200}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="gray-outline"
                onClick={() => handleOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
