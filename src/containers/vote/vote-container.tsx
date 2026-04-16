'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LoaderCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Heading1 } from '@/components/heading';
import { Skeleton } from '@/components/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useCreateVoteRoom } from '@/hooks/apis/vote/use-create-vote-room';
import { useGetVoteTeacherSnapshots } from '@/hooks/apis/vote/use-get-vote-snapshot';
import { VOTE_LOCAL_STORAGE_KEYS } from './vote-constants';

export default function VoteContainer() {
  const router = useRouter();
  const [roomTitle, setRoomTitle] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(true);
  const [roomIds, setRoomIds] = useLocalStorage<string[]>(
    VOTE_LOCAL_STORAGE_KEYS.ROOM_IDS,
    [],
  );
  const [activeRoomId, setActiveRoomId] = useLocalStorage<string>(
    VOTE_LOCAL_STORAGE_KEYS.ACTIVE_ROOM_ID,
    '',
  );
  const { mutate: createVoteRoomMutation, isPending } = useCreateVoteRoom();
  const snapshotQueries = useGetVoteTeacherSnapshots(roomIds ?? []);

  const hasPendingRestore = Boolean(activeRoomId) && showRestoreModal;
  const hasLoadingRoom = snapshotQueries.some((query) => query.isLoading);

  const handleCreateRoom = () => {
    const title = roomTitle.trim();
    if (!title) return;

    createVoteRoomMutation(
      { title },
      {
        onSuccess: ({ roomId }) => {
          setRoomIds((prev) =>
            prev.includes(roomId) ? prev : [...prev, roomId],
          );
          setActiveRoomId(roomId);
          setIsCreateModalOpen(false);
          setRoomTitle('');
          router.push(`/vote/teacher/${roomId}`);
        },
      },
    );
  };

  const voteRooms = snapshotQueries
    .map((query, index) => {
      if (!query.data) return null;
      return {
        roomId: roomIds[index],
        title: query.data.room.title,
        status: query.data.room.status,
        currentRound: query.data.currentRound,
      };
    })
    .filter((room): room is NonNullable<typeof room> => room !== null);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Heading1 className="mb-0">투표하기</Heading1>
        <Button
          variant="primary-ghost"
          size="sm"
          onClick={() => {
            setRoomIds([]);
            setActiveRoomId('');
          }}
        >
          투표 목록 초기화
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {hasLoadingRoom
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="w-full aspect-video rounded-md"
              />
            ))
          : voteRooms.map((room) => (
              <button
                type="button"
                key={room.roomId}
                className="aspect-video rounded-md border dark:border-gray-700 p-4 text-left flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-900"
                onClick={() => {
                  setActiveRoomId(room.roomId);
                  router.push(`/vote/teacher/${room.roomId}`);
                }}
              >
                <div className="text-lg font-semibold text-text-title line-clamp-2">
                  {room.title}
                </div>
                <div className="text-sm text-text-subtitle">
                  <div>
                    상태:{' '}
                    {room.status === 'live'
                      ? '진행 중'
                      : room.status === 'ended'
                        ? '종료됨'
                        : '준비 중'}
                  </div>
                  <div className="line-clamp-1">
                    질문: {room.currentRound?.question ?? '아직 없음'}
                  </div>
                </div>
                <div className="text-primary flex items-center gap-1 text-sm">
                  방 입장하기
                  <ChevronRight className="size-4" />
                </div>
              </button>
            ))}

        <button
          type="button"
          className="aspect-video rounded-md border-2 border-dashed border-primary-300 text-primary flex items-center justify-center hover:bg-primary-50 dark:hover:bg-gray-900"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="size-8" />
        </button>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>투표방 만들기</DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <Input
                value={roomTitle}
                onChange={(event) => setRoomTitle(event.target.value)}
                placeholder="투표 제목을 입력해주세요."
              />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateRoom}
                  disabled={!roomTitle.trim() || isPending}
                >
                  {isPending ? (
                    <LoaderCircle className="size-4 text-white animate-spin" />
                  ) : (
                    '방 만들기'
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={hasPendingRestore} onOpenChange={setShowRestoreModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>진행 중인 투표가 있어요</DialogTitle>
            <DialogDescription className="pt-4 text-sm text-text-subtitle">
              이전에 진행하던 투표를 계속할지, 초기화하고 새로 시작할지
              선택해주세요.
            </DialogDescription>
            <div className="flex justify-end gap-2">
              <Button
                variant="gray-ghost"
                size="sm"
                onClick={() => {
                  setActiveRoomId('');
                  setShowRestoreModal(false);
                }}
              >
                초기화하고 새로 만들기
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowRestoreModal(false);
                  router.push(`/vote/teacher/${activeRoomId}`);
                }}
              >
                계속하기
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
