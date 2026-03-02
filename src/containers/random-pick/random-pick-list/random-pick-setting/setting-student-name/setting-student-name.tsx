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
import { creatId } from '@/utils/createNanoid';
import {
  InnerPickListType,
  PickType,
} from '@/containers/random-pick/random-pick-type';
import { MAX_RANDOM_PICK_STUDENTS } from '@/containers/random-pick/random-pick-constants';

type Props = {
  onCreateRandomPick: (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => void;
};

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
      .refine((names) => names.length <= MAX_RANDOM_PICK_STUDENTS, {
        message: `최대 인원은 ${MAX_RANDOM_PICK_STUDENTS}명입니다.`,
      }),
  ),
});

export default function SettingStudentName({ onCreateRandomPick }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: ['학생1', '학생2', '학생3'],
    },
  });

  const onSubmit = ({ names }: z.infer<typeof formSchema>) => {
    onCreateRandomPick(
      'names',
      names.map((name) => ({
        id: creatId(),
        value: name,
        isPicked: false,
        isUsed: true,
      })),
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-10 min-h-60"
        >
          <FormField
            control={form.control}
            name="names"
            render={({ field }) => (
              <div className="flex-grow flex flex-col gap-y-2">
                <FormControl className="flex-grow">
                  <Textarea placeholder="학생 이름 입력" {...field} />
                </FormControl>
                <FormDescription>
                  학생 이름을 쉼표(,) 혹은 Enter로 구분하여 입력해주세요.
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
    </div>
  );
}
