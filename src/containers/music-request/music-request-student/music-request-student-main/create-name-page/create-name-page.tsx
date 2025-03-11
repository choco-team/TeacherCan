import { useState } from 'react';
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
import { createStudentName } from '@/utils/api/firebaseAPI';
import { LoaderCircle } from 'lucide-react';
import {
  useMusicRequestStudentAction,
  useMusicRequestStudentState,
} from '../../music-request-student-provider/music-request-student-provider.hooks';

const STUDENT_NAME_ERROR_MESSAGE = {
  EMPTY_INPUT: '이름을 입력해 주세요.',
  API_ERROR: '방입장에 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  studentNameInput: z
    .string()
    .nonempty({ message: STUDENT_NAME_ERROR_MESSAGE.EMPTY_INPUT }),
});

export default function CreateNamePage() {
  const [isLoading, setIsLoading] = useState<boolean | null>();
  const { roomId } = useMusicRequestStudentState();
  const { settingStudentName } = useMusicRequestStudentAction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNameInput: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleStudentName = async (studentNameInput: string) => {
    try {
      setIsLoading(true);
      settingStudentName(await createStudentName(roomId, studentNameInput));
    } catch (error) {
      form.setError('studentNameInput', {
        message: STUDENT_NAME_ERROR_MESSAGE.API_ERROR,
      });
      setIsLoading(false);
      throw Error(error.message);
    }
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
                    {isLoading ? (
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
