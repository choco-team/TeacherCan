import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { Button } from '@/components/button';
import { X as XIcon } from 'lucide-react';
import { Input } from '@/components/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
} from '@/components/form';
import { MODAL_STATE_TYPES } from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.constans';

export default function SetPickNumberModal() {
  const { selectModalState, runPick } = useRandomPickPlaygroundAction();
  const { maxNumberOfPick } = useRandomPickPlaygroundState();

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
    <>
      <div className="flex flex-row justify-between mb-8">
        <h1>당첨 개수 설정</h1>
        <button
          type="button"
          onClick={() => selectModalState(MODAL_STATE_TYPES.noModal)}
        >
          <XIcon className="size-6" />
        </button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                <FormDescription>
                  {maxNumberOfPick === 0
                    ? '남은 학생이 없습니다.'
                    : `1 ~ ${maxNumberOfPick} 사이의 숫자를 입력하고 뽑기 버튼을 누르세요.`}
                </FormDescription>
                <FormMessage />
              </>
            )}
          />
        </form>
      </Form>
    </>
  );
}
