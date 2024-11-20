import { Input } from '@/components/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
} from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { creatId } from '@/utils/createNonoid';
import {
  useRandomPickAction,
  useRandomPickState,
} from '../../random-pick-provider/random-pick-provider.hooks';
import { useRandomPickPlaygroundState } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

const formSchema = z.object({
  number: z.coerce
    .number()
    .min(2, {
      message: '최소 인원은 2명입니다.',
    })
    .max(30, {
      message: '최대 인원은 30명입니다.',
    }),
});

export default function SettingStudentNumber() {
  const { pickList } = useRandomPickState();
  const { modifyPickList } = useRandomPickAction();
  const { isRunning } = useRandomPickPlaygroundState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: pickList.numbers.length,
    },
  });

  const onSubmit = ({ number }: z.infer<typeof formSchema>) => {
    const newStudentNumbers = Array.from({ length: number }).map(
      (_, index) => ({
        id: creatId(),
        value: String(index + 1),
        isPicked: false,
        isUsed: true,
      }),
    );

    modifyPickList('numbers', newStudentNumbers);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <>
              <div className="flex gap-x-4">
                <FormControl>
                  <Input type="number" disabled={isRunning} {...field} />
                </FormControl>
                <Button type="submit" disabled={isRunning}>
                  생성
                </Button>
              </div>
              <FormDescription>
                2 ~ 30 사이의 숫자를 입력하고 생성하기 버튼을 누르세요.
              </FormDescription>
              <FormMessage />
            </>
          )}
        />
      </form>
    </Form>
  );
}
