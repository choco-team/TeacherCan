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
import { useState } from 'react';

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

const INIT_STUDENT_NUMBERS = '[1, 2, 3]';

export default function SettingStudentNumber() {
  const [studentNumbers, setStudentNumbers] = useState<number[]>(
    JSON.parse(
      localStorage.getItem('random-pick-number') ?? INIT_STUDENT_NUMBERS,
    ),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = ({ number }: z.infer<typeof formSchema>) => {
    const newStudentNumber = Array.from({ length: number }).map(
      (_, index) => index + 1,
    );

    setStudentNumbers(newStudentNumber);
    localStorage.setItem(
      'random-pick-number',
      JSON.stringify(newStudentNumber),
    );
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
                  <Input
                    type="number"
                    defaultValue={studentNumbers.length}
                    {...field}
                  />
                </FormControl>
                <Button type="submit">생성</Button>
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
