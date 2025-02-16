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
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

function DdayList() {
  const [event, setEvent] = useState({ title: '', date: '', id: null });
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

  const handleAddOrEditEvent = () => {
    if (!event.title || !event.date) {
      return;
    }

    const formattedDate = new Date(event.date);

    if (event.id) {
      setDdays(
        ddays.map((d) =>
          d.id === event.id
            ? {
                ...d,
                title: event.title,
                date: event.date,
                dDay: calculateDays(formattedDate),
              }
            : d,
        ),
      );
    } else if (ddays.length === 10) {
      toast({
        title: '10개의 디데이만 저장할 수 있습니다.',
        variant: 'error',
      });
    } else {
      setDdays([
        ...ddays,
        {
          id: uuidv4(),
          title: event.title,
          date: event.date,
          dDay: calculateDays(formattedDate),
        },
      ]);
    }

    setEvent({ title: '', date: '', id: null });
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setDdays(ddays.filter((d) => d.id !== id));
  };

  const handleCardClick = (id: string) => {
    const foundEvent = ddays.find((d) => d.id === id);
    if (foundEvent) {
      setEvent({
        title: foundEvent.title,
        date: foundEvent.date,
        id,
      });
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* D-Day 추가 버튼 */}
      <Button
        onClick={() => {
          setIsDialogOpen(true);
          setEvent({ title: '', date: '', id: null });
        }}
        className='"fixed right-6 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition"'
      >
        <span className="text-lg">D</span>
      </Button>

      {/* 디데이 목록 */}
      <div className="space-y-4">
        {ddays.map((dday) => (
          <Card
            key={dday.id}
            className="relative border shadow cursor-pointer p-0"
            onClick={() => handleCardClick(dday.id)}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(dday.id);
              }}
            >
              <X size={16} />
            </button>
            <CardHeader className="flex justify-between p-4">
              <div className="flex flex-row p-2">
                <div className="flex flex-col">
                  <p className="font-semibold">{dday.title}</p>
                  <p className="text-xs text-gray-500">{dday.date}</p>
                </div>
                <div className="text-lg font-bold ml-4">{dday.dDay}</div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>{event.id ? '이벤트 수정' : 'D-Day 추가'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="이벤트 이름"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            />
            <Input
              type="date"
              value={event.date}
              onChange={(e) => setEvent({ ...event, date: e.target.value })}
            />
            <Button onClick={handleAddOrEditEvent} className="w-full">
              {event.id ? '수정 완료' : '추가'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DdayList;
