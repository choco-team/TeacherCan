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
  InnerPickListType,
  PickType,
} from '@/containers/random-pick/random-pick-type';

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

type Props = {
  onCreateRandomPick: (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => void;
};

export default function SettingStudentNumber({ onCreateRandomPick }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 30,
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

    onCreateRandomPick('numbers', newStudentNumbers);
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
        <Button type="submit" size="lg">
          만들기
        </Button>
      </form>
    </Form>
  );
}
