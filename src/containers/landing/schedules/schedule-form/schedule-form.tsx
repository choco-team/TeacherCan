import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/form';
import { cn } from '@/styles/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { ko } from 'date-fns/locale';
import { Textarea } from '@/components/textarea';
import { Dispatch, SetStateAction } from 'react';
import { useScheduleForm } from './schedule-form.hooks';
import { ScheduleType } from '../schedules.types';

type Props = {
  scheduleId: string | null;
  schedules: ScheduleType[];
  updateSchedules: (
    value: ScheduleType[] | ((val: ScheduleType[]) => ScheduleType[]),
  ) => void;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ScheduleForm({
  scheduleId,
  schedules,
  updateSchedules,
  setIsDialogOpen,
}: Props) {
  const editedSchedule = scheduleId
    ? schedules.find((item) => item.id === scheduleId)
    : null;

  const { form, onSubmit, handleDeleteSchedule } = useScheduleForm({
    scheduleId,
    editedSchedule,
    schedules,
    updateSchedules,
    setIsDialogOpen,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 pt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-text-subtitle" required>
                이름
              </FormLabel>
              <Input
                placeholder="일정 이름"
                value={field.value}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-text-subtitle">설명</FormLabel>
              <Textarea
                placeholder="일정 설명"
                value={field.value}
                onChange={field.onChange}
                className="min-h-[60px] max-h-80 resize-y"
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-text-subtitle" required>
                날짜
              </FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="gray-outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-gray-300',
                      )}
                    >
                      {field.value ? (
                        <span className="text-text-title">
                          {format(field.value, 'yy년 MM월 dd일 EEEE', {
                            locale: ko,
                          })}
                        </span>
                      ) : (
                        <span className="dark:text-gray-500">
                          날짜를 선택하세요.
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-100 text-text-title" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <div className="flex gap-4 pt-4">
          {scheduleId ? (
            <Button
              type="submit"
              className="w-1/3"
              variant="gray-ghost"
              onClick={handleDeleteSchedule}
            >
              삭제
            </Button>
          ) : null}
          <Button type="submit" className="w-full">
            {scheduleId ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
