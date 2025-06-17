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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
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

  const [isOpenErrorPopup, setIsOpenErrorPopup] = useState(true);
  const [isMusicListErrorPopupChecked, setIsMusicListErrorPopupChecked] =
    useState(false);
  const [shouldShowMusicListErrorPopup, setShouldShowMusicListErrorPopup] =
    useLocalStorage('shouldShowMusicListErrorPopup', true);

  const onClickErrorPopup = () => {
    if (isMusicListErrorPopupChecked) {
      setShouldShowMusicListErrorPopup(false);
    }

    setIsOpenErrorPopup(false);
  };

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
          Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="w-full aspect-video rounded-md" />
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

      <AlertDialog open={shouldShowMusicListErrorPopup && isOpenErrorPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              현재 음악 신청 기능에 오류가 발생하고 있습니다.
            </AlertDialogTitle>

            <span className="text-text-description text-sm text-gray-700 whitespace-pre-line py-2">
              음악신청 방 생성 후 목록에 보이지 않고, 음악 신청이 불가능한
              문제가 발생하고 있습니다.{' '}
              <span className="font-bold">
                생성한 음악신청 방은 매시 정각과 30분마다 자동으로 복구되며
                이후에는 정상적으로 음악 신청 서비스를 이용하실 수 있습니다.
              </span>{' '}
              현재 해당 문제를 인지하고 있으며, 빠른 해결을 위해 최선을 다하고
              있습니다. 이용에 불편을 드려 죄송합니다.
            </span>
          </AlertDialogHeader>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={isMusicListErrorPopupChecked}
                onCheckedChange={() =>
                  setIsMusicListErrorPopupChecked((prev) => !prev)
                }
              />
              <span
                id="isMusicListErrorPopupChecked"
                className="text-sm text-gray-700"
              >
                다시 보지 않기
              </span>
            </Label>

            <Button
              onClick={onClickErrorPopup}
              variant="primary"
              size="sm"
              className="w-full"
            >
              확인
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
