import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFeedback } from '@/hooks/apis/feedback/use-create-feedback';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  type: z.string({
    required_error: '피드백 유형을 선택해주세요.',
  }),
  page: z.string({
    required_error: '페이지를 선택해주세요.',
  }),
  content: z
    .string({
      required_error: '내용을 입력해주세요.',
    })
    .min(1),
  email: z
    .string()
    .email({ message: '이메일 형식이 올바르지 않습니다.' })
    .optional()
    .or(z.literal('')),
});

export const useFeedbackForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateFeedback();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
  });

  const {
    formState: { isValid },
  } = form;

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (isPending) {
      return;
    }

    const { type, page, content, email } = data;
    mutate(
      {
        type,
        page,
        content,
        email,
      },
      {
        onSuccess: ({ id }) => {
          router.push(`/feedback?id=${id}`);
        },
        onError: () => {
          toast({
            title: '피드백 요청을 실패했어요. 잠시 뒤 다시 시도해주세요.',
            variant: 'error',
          });
        },
      },
    );
  };

  return {
    form,
    isValid,
    isPending,
    onSubmit,
  };
};
