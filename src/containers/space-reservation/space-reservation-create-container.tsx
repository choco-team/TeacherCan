'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { Heading1 } from '@/components/heading';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { createRoom } from '@/lib/space-reservation-repository';
import { useToast } from '@/hooks/use-toast';
import {
  SPACE_RESERVATION_CLASS_OPTIONS,
  SPACE_RESERVATION_GENERIC_ERROR,
  SPACE_RESERVATION_GRADE_OPTIONS,
} from '@/constants/space-reservation';

export default function SpaceReservationCreateContainer() {
  const router = useRouter();
  const { toast } = useToast();
  const [roomName, setRoomName] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled =
    roomName.trim().length === 0 ||
    grade.trim().length === 0 ||
    className.trim().length === 0 ||
    isSubmitting;

  const handleCreateRoom = async () => {
    if (isDisabled) return;
    setIsSubmitting(true);
    try {
      const created = await createRoom({
        roomName,
        grade: `${grade}학년`,
        className: `${className}반`,
      });
      toast({
        title: '공간을 만들었어요.',
        description: '예약표 화면에서 초대 링크를 복사할 수 있어요.',
      });
      router.push(`/space-reservation/rooms/${created.room.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: '공간 생성에 실패했어요.',
        description: SPACE_RESERVATION_GENERIC_ERROR,
        variant: 'error',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading1>공간 만들기</Heading1>
        <p className="text-sm text-text-subtitle">어떤 공간을 예약할까요?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공간예약 방 생성</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="spaceName" required>
              공간 이름
            </Label>
            <Input
              id="spaceName"
              placeholder="예: 음악실, 컴퓨터실, 다목적실, 운동장"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              maxLength={30}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="grade" required>
                학년
              </Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
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
              <Label htmlFor="className" required>
                반
              </Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger id="className">
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
          <p className="text-xs text-text-subtitle">
            학년과 반은 이 공간에서 예약을 등록할 때 자동으로 표시됩니다.
          </p>

          <Button disabled={isDisabled} onClick={handleCreateRoom}>
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              '공간 만들기'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
