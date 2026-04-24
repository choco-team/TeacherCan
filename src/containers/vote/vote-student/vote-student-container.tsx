'use client';

import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
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
const getParticipantNameCookieKey = (roomId: string) =>
  `vote-student-name-${roomId}`;

export default function VoteStudentContainer({ params }: Props) {
  const { roomId } = params;
  const [participantToken, setParticipantToken] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
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
    const cookieName = Cookies.get(getParticipantNameCookieKey(roomId)) ?? '';
    setParticipantName(cookieName);
    setNameInput(cookieName);
  }, [roomId]);

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
      name: participantName || '익명',
    });
  }, [joinParticipant, participantName, participantToken, roomId]);

  const liveRound = data?.liveRound;
  const maxSelections = liveRound?.maxSelections ?? 1;

  const canSubmit = useMemo(() => {
    if (!liveRound) return false;
    return (
      selectedOptionIds.length > 0 && selectedOptionIds.length <= maxSelections
    );
  }, [liveRound, maxSelections, selectedOptionIds.length]);

  const handleSaveName = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }

    Cookies.set(getParticipantNameCookieKey(roomId), trimmedName);
    setParticipantName(trimmedName);
    setErrorMessage('');
  };

  const handleSubmitVote = () => {
    if (!liveRound) return;
    if (!participantToken || !participantName) return;
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
        participantName,
      },
      {
        onSuccess: () => {
          setSelectedOptionIds([]);
          setErrorMessage('');
          refetch();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
      <Heading2>티처캔 투표하기</Heading2>
      <Card>
        <CardHeader>
          <CardTitle>방 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-text-subtitle">
          <div>방 이름: {data?.roomTitle ?? '-'}</div>
          {participantName && <div>내 이름: {participantName}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>입장 이름 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="이름을 입력하세요."
          />
          <Button variant="primary" size="sm" onClick={handleSaveName}>
            이름 저장
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="w-full flex justify-center py-10">
          <LoaderCircle className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>현재 투표</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!participantName ? (
              <div className="text-sm text-text-subtitle">
                투표에 참여하려면 먼저 이름을 저장해주세요.
              </div>
            ) : data?.alreadySubmitted ? (
              <div className="text-sm text-text-subtitle">
                투표 전송이 완료되었습니다. 선생님이 투표를 마칠 때까지
                기다려주세요.
              </div>
            ) : !liveRound ? (
              <div className="text-sm text-text-subtitle">
                아직 시작된 투표가 없습니다. 잠시 후 다시 확인해주세요.
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="font-semibold text-text-title">
                    {liveRound.question}
                  </div>
                  <div className="text-sm text-text-subtitle">
                    최대 {maxSelections}개까지 선택할 수 있습니다.
                  </div>
                </div>
                <div className="space-y-2">
                  {liveRound.options.map((option) => (
                    <Label
                      key={option.id}
                      className="flex items-center gap-2 text-text-title"
                    >
                      <Checkbox
                        checked={selectedOptionIds.includes(option.id)}
                        onCheckedChange={(checked) => {
                          setSelectedOptionIds((previous) => {
                            if (checked) {
                              if (previous.length >= maxSelections) {
                                return previous;
                              }
                              return [...previous, option.id];
                            }
                            return previous.filter((id) => id !== option.id);
                          });
                        }}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  isPending={isSubmitting}
                  onClick={handleSubmitVote}
                >
                  전송하기
                </Button>
              </>
            )}

            {errorMessage && <p className="text-sm text-red">{errorMessage}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
