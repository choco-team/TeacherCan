import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { Input } from '@/components/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField } from '@/components/form';
import { getFormSchema } from '@/utils/getFormSchema';
import { useState } from 'react';
import { WinnersType } from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider';
import ResultCard from '../playground-card/playground-result-card';
import { useRandomPickState } from '../../random-pick-provider/random-pick-provider.hooks';

type Props = {
  title: string;
  triggerOpenModal: (state: boolean) => void;
};

export default function PlaygroundModal({ title, triggerOpenModal }: Props) {
  const {
    options: { isExcludingSelected },
  } = useRandomPickState();
  const { winners, students } = useRandomPickPlaygroundState();
  const { runPick } = useRandomPickPlaygroundAction();
  const [newWinners, setNewWinners] = useState<WinnersType[]>([]);

  const formSchema = getFormSchema(students.length - winners.length);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 1,
    },
  });

  const onSubmit = ({ number }: z.infer<typeof formSchema>) => {
    setNewWinners(runPick(number));
  };

  const restStudentLength = isExcludingSelected
    ? students.length - winners.length
    : students.length;

  const onOpenModal = (open: boolean) => {
    triggerOpenModal(open);

    if (!open) {
      return;
    }

    setNewWinners([]);
  };

  const hasNewWinner = newWinners.length > 0;

  return (
    <Dialog onOpenChange={onOpenModal}>
      <DialogTrigger asChild>
        <Button className="w-20">뽑기</Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col overflow-auto transition-none"
        fullScreen={hasNewWinner}
      >
        {hasNewWinner ? (
          <div className="flex justify-between">
            <DialogTitle>{title || '랜덤 뽑기 결과'}</DialogTitle>
            <div className="mr-8">
              <Button className="w-fit" onClick={() => setNewWinners([])}>
                다시 뽑기
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogTitle>인원 설정</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <>
                      <div className="flex gap-x-4">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <Button type="submit">뽑기</Button>
                      </div>
                      <DialogDescription>
                        남은 학생 수는 {restStudentLength}명입니다.
                      </DialogDescription>
                    </>
                  )}
                />
              </form>
            </Form>
          </>
        )}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {newWinners.map((newWinner) => (
            <ResultCard key={newWinner.pickListId} winner={newWinner} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
