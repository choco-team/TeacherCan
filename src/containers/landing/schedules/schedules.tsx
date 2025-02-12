'use client';

import { Button } from '@/components/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import useLocalStorage from '@/hooks/useLocalStorage';
import { CalendarDaysIcon, PlusIcon } from 'lucide-react';
import SectionTitle from '../components/section-title';
import ScheduleForm from './schedule-form/schedule-form';
import ScheduleContent from './schedule-content/schedule-content';
import { ScheduleType } from './schedules.types';

export default function Schedule() {
  const [schedules, setSchedules] = useLocalStorage<ScheduleType[]>(
    'schedule',
    [],
  );
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionTitle
        Icon={CalendarDaysIcon}
        title="다가오는 일정"
        buttonSection={
          <Button
            size="xs"
            variant="primary-ghost"
            onClick={() => {
              setScheduleId(null);
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon size={14} />
          </Button>
        }
      />
      <ScheduleContent
        schedules={schedules}
        setScheduleId={setScheduleId}
        setIsDialogOpen={setIsDialogOpen}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>{scheduleId ? '일정 수정' : '일정 추가'}</DialogTitle>
            <ScheduleForm
              scheduleId={scheduleId}
              schedules={schedules}
              updateSchedules={setSchedules}
              setIsDialogOpen={setIsDialogOpen}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
