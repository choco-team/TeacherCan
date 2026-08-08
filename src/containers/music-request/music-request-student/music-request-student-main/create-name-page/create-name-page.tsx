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
import { MAX_STUDENT_NAME_LENGTH } from '@/apis/music-request/musicRequest';
import {
  clearStudentName,
  saveStudentName,
} from '@/apis/music-request/music-student-storage';
import {
  useMusicRequestStudentAction,
  useMusicRequestStudentState,
} from '../../music-request-student-provider/music-request-student-provider.hooks';

const STUDENT_NAME_ERROR_MESSAGE = {
  EMPTY_INPUT: '이름을 입력해 주세요.',
  MAX_LENGTH: `이름은 ${MAX_STUDENT_NAME_LENGTH}자 이내로 입력해 주세요.`,
  API_ERROR: '방입장에 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  studentNameInput: z
    .string()
    .trim()
    .nonempty({ message: STUDENT_NAME_ERROR_MESSAGE.EMPTY_INPUT })
    .max(MAX_STUDENT_NAME_LENGTH, {
      message: STUDENT_NAME_ERROR_MESSAGE.MAX_LENGTH,
    }),
});

type Props = {
  roomId: string;
};

export default function CreateNamePage({ roomId }: Props) {
  const { studentName } = useMusicRequestStudentState();
  const { settingStudentName } = useMusicRequestStudentAction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNameInput: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleStudentName = async (name: string) => {
    saveStudentName(roomId, name);
    settingStudentName(name);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={
            studentName
              ? (event) => {
                  form.reset();
                  event.preventDefault();
                  clearStudentName(roomId);
                  settingStudentName('');
                }
              : form.handleSubmit((values) =>
                  handleStudentName(values.studentNameInput),
                )
          }
          className="space-b-4"
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
                      maxLength={MAX_STUDENT_NAME_LENGTH}
                      placeholder={studentName || '이름을 입력해주세요.'}
                      className={`${studentName ? 'placeholder:text-text-title' : ''}`}
                      disabled={!!studentName}
                    />
                  </FormControl>
                  <Button type="submit" variant="primary" className="w-[120px]">
                    {studentName === '' ? '입장하기' : '다시 입력하기'}
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
