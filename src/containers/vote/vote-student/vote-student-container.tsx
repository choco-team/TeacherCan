'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Heading2 } from '@/components/heading';
import { useJoinVoteRoomParticipant } from '@/hooks/apis/vote/use-join-vote-room-participant';
import { useGetVoteStudentSnapshot } from '@/hooks/apis/vote/use-get-vote-snapshot';
import { useSubmitVoteBallot } from '@/hooks/apis/vote/use-submit-vote-ballot';
import { useVoteStudentRealtime } from '@/hooks/apis/vote/use-vote-realtime';

type Props = {
  params: {
    roomId: string;
  };
};

const getParticipantTokenStorageKey = (roomId: string) =>
  `vote-participant-token-${roomId}`;

export default function VoteStudentContainer({ params }: Props) {
  const { roomId } = params;
  const [participantToken, setParticipantToken] = useState('');
  const [selectedOptionKeys, setSelectedOptionKeys] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate: joinParticipant } = useJoinVoteRoomParticipant();
  const { mutate: submitVoteBallotMutation, isPending: isSubmitting } =
    useSubmitVoteBallot();

  const { data, isLoading, refetch } = useGetVoteStudentSnapshot({
    roomId,
    participantToken,
  });
  useVoteStudentRealtime(roomId, Boolean(roomId && participantToken), refetch);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = getParticipantTokenStorageKey(roomId);
    const existingToken = window.localStorage.getItem(storageKey);
    if (existingToken) {
      setParticipantToken(existingToken);
      return;
    }

    const nextToken = crypto.randomUUID();
    window.localStorage.setItem(storageKey, nextToken);
    setParticipantToken(nextToken);
  }, [roomId]);

  useEffect(() => {
    if (!participantToken) return;

    joinParticipant({
      roomId,
      token: participantToken,
      // 학생 이름은 DB에 남기지 않고 익명으로만 저장합니다.
      name: '익명',
    });
  }, [joinParticipant, participantToken, roomId]);

  const liveRound = data?.liveRound;
  const options = useMemo(() => liveRound?.options ?? [], [liveRound?.options]);
  const maxSelections = liveRound?.maxSelections ?? 1;
  const optionViewModels = useMemo(() => {
    const idCount = new Map<string, number>();

    return options.map((option) => {
      const nextCount = (idCount.get(option.id) ?? 0) + 1;
      idCount.set(option.id, nextCount);

      return {
        key: `${option.id}-${nextCount}`,
        optionId: option.id,
        label: option.label,
      };
    });
  }, [options]);
  const optionIdByKey = useMemo(
    () =>
      new Map(
        optionViewModels.map((viewModel) => [
          viewModel.key,
          viewModel.optionId,
        ]),
      ),
    [optionViewModels],
  );

  const selectedOptionIds = useMemo(
    () =>
      selectedOptionKeys
        .map((key) => optionIdByKey.get(key))
        .filter((value): value is string => Boolean(value)),
    [optionIdByKey, selectedOptionKeys],
  );

  const canSubmit = useMemo(() => {
    if (!liveRound) return false;
    return (
      selectedOptionIds.length > 0 && selectedOptionIds.length <= maxSelections
    );
  }, [liveRound, maxSelections, selectedOptionIds.length]);

  useEffect(() => {
    setSelectedOptionKeys([]);
    setErrorMessage('');
  }, [liveRound?.id]);

  const handleSubmitVote = () => {
    if (!liveRound) return;
    if (!participantToken) return;
    if (!canSubmit) {
      setErrorMessage(
        `최소 1개, 최대 ${maxSelections}개의 선택지를 선택한 뒤 전송해주세요.`,
      );
      return;
    }

    submitVoteBallotMutation(
      {
        roomId,
        roundId: liveRound.id,
        optionIds: selectedOptionIds,
        participantToken,
        participantName: '익명',
      },
      {
        onSuccess: () => {
          setSelectedOptionKeys([]);
          setErrorMessage('');
          refetch();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  const handleToggleOption = (targetKey: string) => {
    const alreadySelected = selectedOptionKeys.includes(targetKey);
    if (alreadySelected) {
      setSelectedOptionKeys((previous) =>
        previous.filter((key) => key !== targetKey),
      );
      setErrorMessage('');
      return;
    }

    if (maxSelections <= 1) {
      setSelectedOptionKeys([targetKey]);
      setErrorMessage('');
      return;
    }

    if (selectedOptionKeys.length >= maxSelections) {
      setErrorMessage(
        `최대 ${maxSelections}개까지 고를 수 있어요. 먼저 고른 선택지를 다시 눌러 지운 뒤, 다시 골라주세요.`,
      );
      return;
    }

    setSelectedOptionKeys((previous) => [...previous, targetKey]);
    setErrorMessage('');
  };

  let voteContent = (
    <>
      <div className="space-y-1">
        <div className="font-semibold text-text-title">
          {liveRound?.question}
        </div>
        <div className="text-sm text-text-subtitle">
          최대 {maxSelections}개까지 선택할 수 있습니다.
        </div>
      </div>
      <div className="space-y-3">
        {optionViewModels.map((viewModel) => {
          const isSelected = selectedOptionKeys.includes(viewModel.key);

          return (
            <button
              key={viewModel.key}
              type="button"
              onClick={() => handleToggleOption(viewModel.key)}
              aria-pressed={isSelected}
              disabled={isSubmitting}
              className={`w-full text-left rounded-2xl border px-4 py-4 min-h-16 transition ${
                isSelected
                  ? 'border-primary bg-primary-50/70 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 text-text-title">
                <div
                  className={`mt-0.5 flex size-5 items-center justify-center rounded-md border ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected ? <Check className="size-3.5" /> : null}
                </div>
                <span className="text-base leading-6">{viewModel.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      {errorMessage && <p className="text-sm text-red">{errorMessage}</p>}
      <Button
        variant="primary"
        size="sm"
        isPending={isSubmitting}
        onClick={handleSubmitVote}
        className="w-full h-12 text-base"
      >
        전송하기
      </Button>
    </>
  );

  if (data?.alreadySubmitted) {
    voteContent = (
      <div className="text-sm text-text-subtitle">
        투표 전송이 완료되었습니다. 선생님이 투표를 마칠 때까지 기다려주세요.
      </div>
    );
  } else if (!liveRound) {
    voteContent = (
      <div className="text-sm text-text-subtitle">
        아직 시작된 투표가 없습니다. 잠시 후 다시 확인해주세요.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-4 min-h-screen">
      <Heading2>티처캔 투표하기</Heading2>
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 space-y-1.5">
        <div className="text-sm text-text-subtitle">방 이름</div>
        <div className="font-semibold text-text-title">
          {data?.roomTitle ?? '-'}
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-10">
          <LoaderCircle className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>현재 투표</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">{voteContent}</CardContent>
        </Card>
      )}
    </div>
  );
}
