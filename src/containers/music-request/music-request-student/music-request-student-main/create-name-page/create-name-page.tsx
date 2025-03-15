import { Input } from '@/components/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useCreateMusicRequestStudent } from '@/hooks/apis/music-request/use-create-music-request-student';
import { useMusicRequestStudentAction } from '../../music-request-student-provider/music-request-student-provider.hooks';

const STUDENT_NAME_ERROR_MESSAGE = {
  EMPTY_INPUT: '이름을 입력해 주세요.',
  API_ERROR: '방입장에 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  studentNameInput: z
    .string()
    .nonempty({ message: STUDENT_NAME_ERROR_MESSAGE.EMPTY_INPUT }),
});

type Props = {
  roomId: string;
};

export default function CreateNamePage({ roomId }: Props) {
  const { mutate, isPending } = useCreateMusicRequestStudent();

  const { settingStudentName } = useMusicRequestStudentAction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNameInput: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleStudentName = async (name: string) => {
    mutate(
      { roomId, name },
      {
        onSuccess: () => {
          settingStudentName(name);
        },
        onError: () => {
          // TODO:(김홍동) 임시, 나중에 지우기
          settingStudentName(name);
          form.setError('studentNameInput', {
            message: STUDENT_NAME_ERROR_MESSAGE.API_ERROR,
          });
        },
      },
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() =>
            handleStudentName(form.getValues('studentNameInput')),
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="studentNameInput"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-x-2">
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="이름을 입력해주세요."
                    />
                  </FormControl>
                  <Button type="submit" variant="primary" className="w-[120px]">
                    {isPending ? (
                      <LoaderCircle
                        size="18px"
                        className="animate-spin text-white"
                      />
                    ) : (
                      '입장하기'
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
