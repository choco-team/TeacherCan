'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import StudentDataPicker from '@/components/student-data-picker';
import { useState, useEffect } from 'react';
import { useGroupStopwatchAction } from './stopwatch-group-provider.hooks';
import type { GroupSetup } from '../stopwatch-type';
import { TIMER_COLORS } from '../stopwatch-utils';

const formSchema = z.object({
  title: z
    .string()
    .min(1, '그룹 이름을 입력해주세요')
    .max(50, '그룹 이름은 50자 이하로 입력해주세요'),
  timerCount: z.number().min(2, '최소 2개 이상').max(30, '최대 30개까지'),
  timerNames: z.array(z.string()).min(2, '최소 2개 이상의 타이머가 필요합니다'),
});

type FormData = z.infer<typeof formSchema>;

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function GroupCreateModal({
  isOpen,
  onClose,
  onComplete,
}: GroupCreateModalProps) {
  const { createGroup } = useGroupStopwatchAction();
  const [setupMethod, setSetupMethod] = useState<'manual' | 'student-data'>(
    'manual',
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      timerCount: 4,
      timerNames: ['모둠1', '모둠2', '모둠3', '모둠4'],
    },
  });

  const { watch, setValue, reset, setError, clearErrors } = form;
  const timerCount = watch('timerCount');

  // 타이머 개수가 30개를 초과하는지 확인하고 에러 설정
  useEffect(() => {
    if (timerCount > 30) {
      if (setupMethod === 'student-data') {
        setError('timerCount', {
          type: 'manual',
          message: `선택한 학생 데이터가 ${timerCount}명으로 최대 30명을 초과합니다. 학생 데이터 관리에서 일부 학생을 삭제하여 30명 이하로 조정해주세요.`,
        });
      } else {
        setError('timerCount', {
          type: 'manual',
          message: '최대 30개까지만 생성할 수 있습니다.',
        });
      }
    } else {
      clearErrors('timerCount');
    }
  }, [timerCount, setupMethod, setError, clearErrors]);

  const handleStudentDataSelect = (
    students: { id: string; name: string }[],
  ) => {
    const names = students.map((student) => student.name);
    setValue('timerNames', names);
    setValue('timerCount', names.length);
  };

  const handleManualInput = (names: string[]) => {
    setValue('timerNames', names);
    setValue('timerCount', names.length);
  };

  const handleClose = () => {
    reset();
    setSetupMethod('manual');
    onClose();
  };

  const onSubmit = (data: FormData) => {
    const setup: GroupSetup = {
      title: data.title,
      timerCount: data.timerCount,
      timerNames: data.timerNames,
      timerColors: data.timerNames.map(
        (_, index) => TIMER_COLORS[index % TIMER_COLORS.length],
      ),
    };

    createGroup(setup);
    handleClose();
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 그룹 만들기</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">그룹 이름</Label>
            <Input
              id="title"
              placeholder="예: 3학년 1반, 과학 실험 그룹"
              {...form.register('title')}
              autoFocus
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Tabs
              value={setupMethod}
              onValueChange={(value) => {
                setSetupMethod(value as 'manual' | 'student-data');
                form.clearErrors();
                // 탭 전환 시 timerCount와 timerNames 초기화
                setValue('timerCount', 4);
                setValue('timerNames', ['모둠1', '모둠2', '모둠3', '모둠4']);
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">직접 입력</TabsTrigger>
                <TabsTrigger value="student-data">학생 데이터</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4" key="manual">
                <div>
                  <Label htmlFor="timerNames">타이머 이름</Label>
                  <Textarea
                    defaultValue={['모둠1', '모둠2', '모둠3', '모둠4'].join(
                      ', ',
                    )}
                    id="timerNames"
                    placeholder="모둠1, 모둠2, 모둠3, 모둠4"
                    onChange={(e) => {
                      const names = e.target.value
                        .split(/[,|\n]+/)
                        .map((name) => name.trim())
                        .filter(Boolean);
                      handleManualInput(names);
                    }}
                    className="h-24"
                  />
                  <p className="text-sm text-text-description mt-2">
                    쉼표(,) 또는 Enter로 구분하여 입력해주세요.
                  </p>
                  {form.formState.errors.timerNames && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.timerNames.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={timerCount > 30}
                  >
                    만들기
                  </Button>
                </div>
                <div className="text-sm text-text-subtitle">
                  총 {timerCount}개의 타이머가 생성됩니다.
                </div>
              </TabsContent>

              <TabsContent value="student-data" className="space-y-4">
                <StudentDataPicker
                  buttonText="만들기"
                  onClickButton={handleStudentDataSelect}
                />
                {timerCount > 30 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
                      선택한 학생 데이터가 {timerCount}명으로 최대 30명을
                      초과합니다.
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                      그룹 스톱워치는 최대 30개의 타이머만 생성할 수 있습니다.
                      학생 데이터 관리 페이지에서 일부 학생을 삭제하여 30명
                      이하로 조정해주세요.
                    </p>
                    <a
                      href="/data-service/student-data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                    >
                      학생 데이터 관리 페이지로 이동하기 →
                    </a>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {timerCount > 30 && setupMethod === 'manual' && (
              <div className="text-sm text-red-500">
                최대 30개까지만 생성할 수 있습니다.
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
