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
import { creatId } from '@/utils/createNanoid';
import {
  useRandomPickAction,
  useRandomPickState,
} from '../../random-pick-provider/random-pick-provider.hooks';

type Props = {
  startPlay: () => void;
};

const formSchema = z.object({
  number: z.coerce
    .number()
    .min(2, {
      message: '최소 인원은 2명입니다.',
    })
    .max(100, {
      message: '최대 인원은 100명입니다.',
    }),
});

export default function SettingStudentNumber({ startPlay }: Props) {
  const { pickList } = useRandomPickState();
  const { modifyPickList } = useRandomPickAction();

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
    startPlay();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-10 min-h-60"
      >
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <div className="flex-grow flex flex-col gap-y-2">
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                2 ~ 100 사이의 숫자를 입력하세요.
              </FormDescription>
              <FormMessage />
            </div>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="self-center p-8 rounded-2xl text-2xl hover:scale-105 active:scale-95"
        >
          시작
        </Button>
      </form>
    </Form>
  );
}
