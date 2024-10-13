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
import { Textarea } from '@/components/textarea';
import { useState } from 'react';

const formSchema = z.object({
  names: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return val
          .split(/[,|\n]+/)
          .map((name) => name.trim())
          .filter(Boolean);
      }
      return val;
    },
    z
      .array(z.string())
      .refine((names) => names.length === new Set(names).size, {
        message: '중복된 이름이 있습니다.',
      })
      .refine((names) => names.length >= 2, {
        message: '최소 인원은 2명입니다.',
      })
      .refine((names) => names.length <= 30, {
        message: '최대 인원은 30명입니다.',
      }),
  ),
});

const INIT_STUDENT_NAMES = '["학생1", "학생2", "학생3"]';

export default function SettingStudentName() {
  const [studentNames, setStudentNames] = useState<string[]>(
    JSON.parse(localStorage.getItem('random-pick-names') ?? INIT_STUDENT_NAMES),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = ({ names }: z.infer<typeof formSchema>) => {
    setStudentNames(names);
    localStorage.setItem('random-pick-names', JSON.stringify(names));
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="names"
            render={({ field }) => (
              <>
                <div className="flex gap-x-4">
                  <FormControl>
                    <Textarea
                      defaultValue={studentNames}
                      className="min-h-[120px]"
                      placeholder="학생 이름 입력"
                      {...field}
                    />
                  </FormControl>
                  <Button type="submit">생성</Button>
                </div>
                <FormDescription>
                  학생 이름을 쉼표(,) 혹은 Enter로 구분하여 입력해주세요.
                </FormDescription>
                <FormMessage />
              </>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
