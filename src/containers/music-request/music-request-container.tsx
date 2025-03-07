'use client';

import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoom } from '@/utils/api/firebaseAPI';

const ROOM_TITLE_ERROR_MESSAGE = {
  EMPTY_INPUT: '방이름을 입력해 주세요.',
  API_ERROR: '방 생성을 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  roomTitle: z
    .string()
    .nonempty({ message: ROOM_TITLE_ERROR_MESSAGE.EMPTY_INPUT }),
});

export default function MusicRequestContainer() {
  const [isLoading, setIsLoading] = useState<boolean | null>(false);
  const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomTitle: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleRoomTitleSubmit = async (roomTitle: string) => {
    try {
      setIsLoading(true);
      router.push(
        `${originURL}/music-request/teacher/${await createRoom(roomTitle)}`,
      );
    } catch (error) {
      form.setError('roomTitle', {
        message: ROOM_TITLE_ERROR_MESSAGE.API_ERROR,
      });
      setIsLoading(false);
      throw Error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() =>
            handleRoomTitleSubmit(form.getValues('roomTitle')),
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="roomTitle"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-x-2">
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="방 이름을 입력해주세요."
                    />
                  </FormControl>
                  <Button type="submit" variant="primary">
                    {isLoading ? '로딩중...' : '방 생성'}
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
