import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ScheduleType } from '../schedules.types';

const FormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  date: z.date(),
});

type Props = {
  scheduleId: string | null;
  editedSchedule: ScheduleType;
  schedules: ScheduleType[];
  updateSchedules: (
    value: ScheduleType[] | ((val: ScheduleType[]) => ScheduleType[]),
  ) => void;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const useScheduleForm = ({
  editedSchedule,
  schedules,
  scheduleId,
  updateSchedules,
  setIsDialogOpen,
}: Props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: editedSchedule
      ? {
          name: editedSchedule.name,
          description: editedSchedule.description,
          date: new Date(editedSchedule.date),
        }
      : {},
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const { name, date, description } = data;

    if (schedules.length === 20) {
      toast({
        title: '일정은 최대 20개까지 저장할 수 있어요.',
        variant: 'error',
      });
      return;
    }

    if (scheduleId) {
      updateSchedules(
        schedules.map((schedule) =>
          schedule.id === scheduleId
            ? {
                id: editedSchedule.id,
                name,
                date,
                description,
              }
            : schedule,
        ),
      );

      setIsDialogOpen(false);
      return;
    }

    updateSchedules([
      ...schedules,
      {
        id: nanoid(),
        name,
        date,
        description,
      },
    ]);

    setIsDialogOpen(false);
  };

  const handleDeleteSchedule = () => {
    updateSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
  };

  return {
    form,
    onSubmit,
    handleDeleteSchedule,
  };
};
