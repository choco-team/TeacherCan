'use client';

import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';
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
import { LoaderCircle } from 'lucide-react';
import { useCreateMusicRequestRoom } from '@/hooks/apis/music-request/use-create-music-request-room';

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
  const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const { mutate: createRoom, isPending } = useCreateMusicRequestRoom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomTitle: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleRoomTitleSubmit = (roomTitle: string) => {
    createRoom(
      { roomTitle },
      {
        onSuccess: ({ roomId }) => {
          router.push(`${originURL}/music-request/teacher/${roomId}`);
        },
        onError: () => {
          form.setError('roomTitle', {
            message: ROOM_TITLE_ERROR_MESSAGE.API_ERROR,
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100dvh-120px)]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() =>
            handleRoomTitleSubmit(form.getValues('roomTitle')),
          )}
          className="space-y-4 mb-12"
        >
          <FormField
            control={form.control}
            name="roomTitle"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="flex items-center gap-x-2">
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="방 이름을 입력해주세요."
                    />
                  </FormControl>
                  <Button type="submit" variant="primary" className="w-[120px]">
                    {isPending ? (
                      <LoaderCircle
                        size="18px"
                        className="animate-spin text-white"
                      />
                    ) : (
                      '방 만들기'
                    )}
                  </Button>
                </div>
                <div className="absolute bottom-[-28px] left-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
