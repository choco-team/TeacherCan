import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { MODAL_STATE_TYPES } from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.constans';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormMessage } from '@/components/form';
import { Input } from '@/components/input';
import ResultCard from '../../playground-card/playground-result-card';

export default function ResultModal() {
  const { winners, maxNumberOfPick } = useRandomPickPlaygroundState();
  const { selectModalState, runPick } = useRandomPickPlaygroundAction();

  const formSchema = z.object({
    number: z.coerce
      .number()
      .min(1, {
        message: '최소 인원은 1명입니다.',
      })
      .max(maxNumberOfPick, {
        message: `남은 인원은 ${maxNumberOfPick}명입니다.`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 1,
    },
  });

  const onSubmit = ({ number }: z.infer<typeof formSchema>) => {
    runPick(number);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <div className="flex gap-x-4">
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <Button type="submit">다시뽑기</Button>
                  <FormMessage />
                </div>
              )}
            />
          </form>
        </Form>
        <button
          type="button"
          onClick={() => selectModalState(MODAL_STATE_TYPES.noModal)}
        >
          <XIcon className="size-6" />
        </button>
      </div>
      <div className="grid grid-cols-6 gap-4 ">
        {winners.map((winner) => (
          <ResultCard key={winner.pickListId} winner={winner} />
        ))}
      </div>
    </div>
  );
}
