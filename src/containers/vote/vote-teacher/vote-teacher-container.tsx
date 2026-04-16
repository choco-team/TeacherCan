'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { LoaderCircle, Plus, RefreshCw, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/button';
import { Heading1, Heading3 } from '@/components/heading';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Badge } from '@/components/badge';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useGetVoteTeacherSnapshot } from '@/hooks/apis/vote/use-get-vote-snapshot';
import { useVoteRealtime } from '@/hooks/apis/vote/use-vote-realtime';
import { useCreateVoteRound } from '@/hooks/apis/vote/use-create-vote-round';
import { useStartVoteRound } from '@/hooks/apis/vote/use-start-vote-round';
import { useEndVoteRound } from '@/hooks/apis/vote/use-end-vote-round';
import { useFinishVoteRoom } from '@/hooks/apis/vote/use-finish-vote-room';
import { VoteTeacherSnapshot } from '@/apis/vote/vote';
import { MAX_VOTE_OPTIONS, VOTE_LOCAL_STORAGE_KEYS } from '../vote-constants';

type Props = {
  params: {
    roomId: string;
  };
};

const DEFAULT_OPTIONS = ['', ''];

export default function VoteTeacherContainer({ params }: Props) {
  const { roomId } = params;
  const router = useRouter();
  const [, setActiveRoomId] = useLocalStorage<string>(
    VOTE_LOCAL_STORAGE_KEYS.ACTIVE_ROOM_ID,
    '',
  );
  const { data, refetch } = useGetVoteTeacherSnapshot({ roomId });
  const [snapshot, setSnapshot] = useState<VoteTeacherSnapshot | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [maxSelections, setMaxSelections] = useState(1);
  const [revoteOptionIds, setRevoteOptionIds] = useState<string[]>([]);
  const [origin, setOrigin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreatingRevote, setIsCreatingRevote] = useState(false);

  const { mutate: createVoteRoundMutation, isPending: isRoundCreating } =
    useCreateVoteRound();
  const { mutate: startVoteRoundMutation, isPending: isStarting } =
    useStartVoteRound();
  const { mutate: endVoteRoundMutation, isPending: isEnding } =
    useEndVoteRound();
  const { mutate: finishVoteRoomMutation, isPending: isFinishing } =
    useFinishVoteRoom();

  const handleSnapshot = useCallback((newSnapshot: VoteTeacherSnapshot) => {
    setSnapshot(newSnapshot);
  }, []);

  const [connectionStatus, reconnect] = useVoteRealtime(roomId, handleSnapshot);

  useEffect(() => {
    if (data) {
      setSnapshot(data);
    }
  }, [data]);

  useEffect(() => {
    setActiveRoomId(roomId);
  }, [roomId, setActiveRoomId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const currentRound = snapshot?.currentRound ?? null;
  const latestEndedRound = useMemo(
    () => snapshot?.rounds.find((round) => round.status === 'ended') ?? null,
    [snapshot],
  );
  const resultSourceRound =
    currentRound?.status === 'ended' ? currentRound : latestEndedRound;

  const top3 = useMemo(
    () =>
      [...(resultSourceRound?.options ?? [])]
        .sort((a, b) => b.voteCount - a.voteCount)
        .slice(0, 3),
    [resultSourceRound],
  );

  const updateOptionValue = (index: number, value: string) => {
    setOptions((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
  };

  const addOption = () => {
    setOptions((previous) => {
      if (previous.length >= MAX_VOTE_OPTIONS) {
        return previous;
      }
      return [...previous, ''];
    });
  };

  const removeOption = (index: number) => {
    setOptions((previous) => {
      if (previous.length <= 2) {
        return previous;
      }

      const next = previous.filter((_, idx) => idx !== index);
      setMaxSelections((oldValue) => Math.min(oldValue, next.length));
      return next;
    });
  };

  const createRound = (nextOptions: string[]) => {
    const trimmedQuestion = question.trim();
    const trimmedOptions = nextOptions
      .map((option) => option.trim())
      .filter(Boolean);

    if (!trimmedQuestion) {
      setErrorMessage('질문을 입력해주세요.');
      return;
    }

    if (trimmedOptions.length < 2) {
      setErrorMessage('선택지는 최소 2개가 필요합니다.');
      return;
    }

    if (maxSelections > trimmedOptions.length) {
      setErrorMessage('최대 선택 개수는 선택지 개수를 넘을 수 없습니다.');
      return;
    }

    setErrorMessage('');
    createVoteRoundMutation(
      {
        roomId,
        question: trimmedQuestion,
        maxSelections,
        options: trimmedOptions,
      },
      {
        onSuccess: () => {
          setOptions(DEFAULT_OPTIONS);
          setQuestion('');
          setMaxSelections(1);
          setRevoteOptionIds([]);
          setIsCreatingRevote(false);
          refetch();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  const handleStartRound = () => {
    if (!currentRound) return;

    startVoteRoundMutation(
      { roomId, roundId: currentRound.id },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  const handleEndRound = () => {
    if (!currentRound) return;

    endVoteRoundMutation(
      { roundId: currentRound.id },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  const handleFinishRoom = () => {
    finishVoteRoomMutation(
      { roomId },
      {
        onSuccess: () => {
          setActiveRoomId('');
          refetch();
        },
      },
    );
  };

  const buildRevote = () => {
    if (!currentRound) return;
    if (revoteOptionIds.length < 2) {
      setErrorMessage('재투표는 최소 2개 선택지로 설정해주세요.');
      return;
    }

    const revoteOptions = currentRound.options
      .filter((option) => revoteOptionIds.includes(option.id))
      .map((option) => option.label);

    createRound(revoteOptions);
  };

  if (!snapshot) {
    return (
      <div className="w-full flex justify-center py-20">
        <LoaderCircle className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Heading1 className="mb-0">{snapshot.room.title}</Heading1>
        <div className="flex items-center gap-2">
          <Badge variant="primary-outline">
            연결 상태:{' '}
            {connectionStatus === 'connected'
              ? '정상'
              : connectionStatus === 'reconnecting'
                ? '재연결 중'
                : '끊김'}
          </Badge>
          {connectionStatus !== 'connected' && (
            <Button variant="gray-outline" size="sm" onClick={reconnect}>
              <RefreshCw className="size-4 mr-1" />
              다시 연결
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>진행 상태</span>
              <Badge>
                {snapshot.room.status === 'live'
                  ? '투표 진행 중'
                  : snapshot.room.status === 'ended'
                    ? '투표 종료'
                    : '투표 준비'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-text-subtitle">
              <Users className="size-4" />
              입장한 학생 수: {snapshot.joinedStudentCount}명
            </div>

            {currentRound ? (
              <>
                <div className="space-y-1">
                  <Heading3 className="text-base">
                    {currentRound.question}
                  </Heading3>
                  <div className="text-sm text-text-subtitle">
                    최대 선택 가능 개수: {currentRound.maxSelections}개
                  </div>
                </div>

                <div className="space-y-3">
                  {currentRound.options.map((option) => {
                    const totalVotes = Math.max(currentRound.totalVotes, 1);
                    const ratio = Math.round(
                      (option.voteCount / totalVotes) * 100,
                    );
                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{option.label}</span>
                          <span>{option.voteCount}표</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentRound.status === 'ready' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStartRound}
                    isPending={isStarting}
                  >
                    투표 시작하기
                  </Button>
                )}

                {currentRound.status === 'live' && (
                  <Button
                    variant="red"
                    size="sm"
                    onClick={handleEndRound}
                    isPending={isEnding}
                  >
                    투표 종료하기
                  </Button>
                )}

                {currentRound.status === 'ended' &&
                  snapshot.room.status !== 'ended' && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="gray-outline"
                          size="sm"
                          onClick={() => {
                            setIsCreatingRevote((previous) => !previous);
                            setErrorMessage('');
                          }}
                        >
                          재투표 만들기
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleFinishRoom}
                          isPending={isFinishing}
                        >
                          마무리하기
                        </Button>
                      </div>

                      {isCreatingRevote && (
                        <div className="rounded-md border dark:border-gray-700 p-3 space-y-3">
                          <div className="text-sm text-text-subtitle">
                            재투표에 포함할 선택지를 고르고 질문을 수정할 수
                            있습니다.
                          </div>
                          <Textarea
                            value={question}
                            onChange={(event) =>
                              setQuestion(event.target.value)
                            }
                            placeholder="재투표 질문"
                          />
                          <div className="space-y-2">
                            {currentRound.options.map((option) => (
                              <Label
                                key={option.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Checkbox
                                  checked={revoteOptionIds.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    setRevoteOptionIds((previous) => {
                                      if (checked) {
                                        return [...previous, option.id];
                                      }
                                      return previous.filter(
                                        (id) => id !== option.id,
                                      );
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
                            isPending={isRoundCreating}
                            onClick={buildRevote}
                          >
                            재투표 라운드 생성
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
              </>
            ) : (
              <div className="text-sm text-text-subtitle">
                아직 생성된 투표 라운드가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>학생 초대 QR</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <QRCodeCanvas
              value={`${origin}/vote/student/${roomId}`}
              size={220}
            />
            <div className="text-xs text-text-subtitle break-all">
              {origin}/vote/student/{roomId}
            </div>
          </CardContent>
        </Card>
      </div>

      {!currentRound && (
        <Card>
          <CardHeader>
            <CardTitle>새 투표 만들기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="질문을 입력하세요."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <div className="space-y-2">
              {options.map((option, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${index}-${option}`} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(event) =>
                      updateOptionValue(index, event.target.value)
                    }
                    placeholder={`선택지 ${index + 1}`}
                  />
                  <Button
                    variant="gray-outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="gray-outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= MAX_VOTE_OPTIONS}
              >
                <Plus className="size-4 mr-1" />
                선택지 추가 ({options.length}/{MAX_VOTE_OPTIONS})
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="max-selections">학생 최대 선택 가능 개수</Label>
              <Input
                id="max-selections"
                type="number"
                min={1}
                max={Math.max(
                  1,
                  options.filter((value) => value.trim()).length,
                )}
                value={maxSelections}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (!Number.isNaN(value)) {
                    setMaxSelections(Math.max(1, value));
                  }
                }}
              />
            </div>

            {errorMessage && <p className="text-sm text-red">{errorMessage}</p>}

            <Button
              variant="primary"
              size="sm"
              onClick={() => createRound(options)}
              isPending={isRoundCreating}
            >
              투표 라운드 만들기
            </Button>
          </CardContent>
        </Card>
      )}

      {snapshot.room.status === 'ended' && resultSourceRound && (
        <Card>
          <CardHeader>
            <CardTitle>최종 결과 Top 3</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {top3.length === 0 ? (
              <div className="text-sm text-text-subtitle">
                집계된 결과가 없습니다.
              </div>
            ) : (
              top3.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between border-b dark:border-gray-700 pb-2"
                >
                  <div className="font-medium text-text-title">
                    {index + 1}위. {option.label}
                  </div>
                  <Badge>{option.voteCount}표</Badge>
                </div>
              ))
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setActiveRoomId('');
                router.push('/vote');
              }}
            >
              새로운 투표 만들기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
