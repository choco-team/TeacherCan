'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createRoom } from '@/lib/space-reservation-storage';
import { useToast } from '@/hooks/use-toast';

const GRADE_OPTIONS = Array.from({ length: 6 }, (_, index) =>
  String(index + 1),
);
const CLASS_OPTIONS = Array.from({ length: 20 }, (_, index) =>
  String(index + 1),
);

export default function SpaceReservationCreateContainer() {
  const router = useRouter();
  const { toast } = useToast();
  const [roomName, setRoomName] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');

  const isDisabled =
    roomName.trim().length === 0 ||
    grade.trim().length === 0 ||
    className.trim().length === 0;

  const handleCreateRoom = () => {
    if (isDisabled) return;

    const created = createRoom({
      roomName,
      grade: `${grade}학년`,
      className: `${className}반`,
    });
    toast({
      title: '공간을 만들었어요.',
      description: '예약표 화면에서 초대 링크를 복사할 수 있어요.',
    });
    router.push(`/space-reservation/rooms/${created.room.id}`);
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
                  {GRADE_OPTIONS.map((option) => (
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
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button disabled={isDisabled} onClick={handleCreateRoom}>
            공간 만들기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
