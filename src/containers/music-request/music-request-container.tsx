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
import { LoaderCircle, Plus } from 'lucide-react';
import { useCreateMusicRequestRoom } from '@/hooks/apis/music-request/use-create-music-request-room';
import theme from '@/styles/theme';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Heading1 } from '@/components/heading';
import { Skeleton } from '@/components/skeleton';
import Link from 'next/link';
import MusicRequestList from './music-request-list/music-request-list';
import { MAX_MUSIC_COUNT } from './music-request-constants';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoveAllOpen, setIsRemoveAllOpen] = useState(false);
  const [roomIds, setRoomIds] = useLocalStorage<string[] | null>('roomIds', []);

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
          setRoomIds((prev) => [...prev, roomId]);
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

  const enableCreateRoom = roomIds && roomIds.length < MAX_MUSIC_COUNT;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Heading1 className="mb-6">음악신청 방 목록</Heading1>
        <Button
          variant="primary-ghost"
          size="sm"
          onClick={() => setIsRemoveAllOpen(true)}
        >
          음악신청 방 목록 초기화
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {roomIds ? (
          <MusicRequestList roomIds={roomIds} />
        ) : (
          Array.from({ length: 3 }, () => (
            <Skeleton className="w-full aspect-video rounded-md" />
          ))
        )}
        <div
          className="flex flex-col justify-center items-center aspect-video bg-gray-100 dark:bg-gray-900 rounded-sm cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Plus color={theme.colors.primary[500]} />
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>음악신청 방 만들기</DialogTitle>
            <DialogDescription>
              {!enableCreateRoom ? (
                <span className="text-sm text-gray-500 whitespace-pre-line">
                  {`목록에 최대 ${MAX_MUSIC_COUNT}개의 방만 저장할 수 있어요.\n음악신청 방 > 방 정보 > 목록 노출에서 미노출을 처리할 수 있어요.`}
                </span>
              ) : null}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(() =>
                    handleRoomTitleSubmit(form.getValues('roomTitle')),
                  )}
                  className="pt-4"
                >
                  <FormField
                    control={form.control}
                    name="roomTitle"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <div className="flex flex-col gap-4 items-end">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder="방 이름을 입력해주세요."
                              disabled={!enableCreateRoom}
                            />
                          </FormControl>
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-[120px]"
                            disabled={!enableCreateRoom}
                          >
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
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isRemoveAllOpen} onOpenChange={setIsRemoveAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>음악신청 방 목록 초기화</DialogTitle>
            <DialogDescription>
              <span className="text-sm text-gray-500 whitespace-pre-line">
                음악신청 방 목록을 불러올 수 없는 버그가 있습니다. 이 경우
                목록을 초기화하고 다시 생성해야 합니다. 이용에 불편을 드려
                죄송합니다. 버그 수정은 진행 중이며, 추가 문제 발견 시{' '}
                <Link href="/feedback" className="underline">
                  피드백
                </Link>{' '}
                부탁드립니다.
              </span>
            </DialogDescription>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="gray-ghost"
                size="sm"
                onClick={() => setIsRemoveAllOpen(false)}
              >
                취소
              </Button>
              <Button
                variant="red"
                size="sm"
                onClick={() => {
                  setRoomIds([]);
                  setIsRemoveAllOpen(false);
                }}
              >
                초기화하기
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
