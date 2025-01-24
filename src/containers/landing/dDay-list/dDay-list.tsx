'use client';

import { Button } from '@/components/button';
import { Card, CardHeader } from '@/components/card';
import { Input } from '@/components/input';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import useLocalStorage from '@/hooks/useLocalStorage';

function DdayList() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ddays, setDdays] = useLocalStorage<
    { id: string; date: string; title: string; dDay: string }[]
  >('dDays', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateDays = (date: Date) => {
    const today = +new Date();
    const targetDate = +new Date(date);
    const difference = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    return difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
  };

  const handleAddEvent = () => {
    if (eventName && eventDate) {
      const formattedDate = new Date(eventDate);
      setDdays([
        ...ddays,
        {
          id: uuidv4(),
          title: eventName,
          date: eventDate,
          dDay: calculateDays(formattedDate),
        },
      ]);
      setEventName('');
      setEventDate('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* D-Day 설정 버튼 */}
      <Button onClick={() => setIsDialogOpen(true)}>D-Day 설정</Button>

      {/* 이벤트 목록 */}
      <div className="space-y-4">
        {ddays.map((dday) => (
          <Card key={dday.id} className="border shadow">
            <CardHeader className="flex">
              {/* 왼쪽: 이벤트 제목과 날짜 */}
              <div>
                {dday.title}
                <p className="text-xs">{dday.date}</p>
              </div>
              <div>
                <p>{dday.dDay}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* 모달 창 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>D-Day 설정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="이벤트 이름"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <Button onClick={handleAddEvent} className="w-full">
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DdayList;
