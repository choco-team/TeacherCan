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

  const createRoom = async (roomTitle: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${originURL}/api/firebase/music-request/room`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomTitle }),
        },
      );
      const json = await response.json();
      router.push(`${originURL}/music-request/teacher/${json.roomId}`);
    } catch (error) {
      form.setError('roomTitle', {
        message: ROOM_TITLE_ERROR_MESSAGE.API_ERROR,
      });
      throw Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col items-center bg-gray mb-10">
        <p>신청곡 페이지 사용하는 방법</p>
        <br />
        <p>1. 동해물과 백두산이</p>
        <p>2. 마르고 닳도록</p>
        <p>3. 하느님이 보우하사</p>
        <p>4. 우리나라만세</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() =>
            createRoom(form.getValues('roomTitle')),
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
