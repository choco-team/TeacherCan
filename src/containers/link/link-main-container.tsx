'use client';

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
import { useRouter } from 'next/navigation';
import { useCreateLinkCode } from '@/hooks/apis/link/use-create-link-code';

const LINK_CODE_ERROR_MESSAGE = {
  EMPTY_INPUT: '코드를 입력해 주세요.',
  API_ERROR: '방입장에 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  linkCodeInput: z
    .string()
    .nonempty({ message: LINK_CODE_ERROR_MESSAGE.EMPTY_INPUT }),
});

export default function LinkMainContainer() {
  const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const { mutate: createLinkCode } = useCreateLinkCode();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkCodeInput: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleLinkCode = (code: string) => {
    createLinkCode(
      { code },
      {
        onSuccess: ({ data }) => {
          router.push(`${originURL}/link/edit/${data.code}`);
        },
        onError: (data) => {
          form.setError('linkCodeInput', {
            message: data.message
              ? data.message
              : LINK_CODE_ERROR_MESSAGE.API_ERROR,
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          handleLinkCode(form.getValues('linkCodeInput')),
        )}
        className="space-b-4"
      >
        <FormField
          control={form.control}
          name="linkCodeInput"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="코드를 입력해주세요."
                  />
                </FormControl>
                <Button type="submit" variant="primary" className="w-[120px]">
                  입장하기
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
