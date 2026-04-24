'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Copy,
  ExternalLink,
  LoaderCircle,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  ZoomIn,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Heading1, Heading3 } from '@/components/heading';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Badge } from '@/components/badge';
import { useGetVoteTeacherSnapshot } from '@/hooks/apis/vote/use-get-vote-snapshot';
import { useVoteRealtime } from '@/hooks/apis/vote/use-vote-realtime';
import { useCreateVoteRound } from '@/hooks/apis/vote/use-create-vote-round';
import { useStartVoteRound } from '@/hooks/apis/vote/use-start-vote-round';
import { useEndVoteRound } from '@/hooks/apis/vote/use-end-vote-round';
import { useFinishVoteRoom } from '@/hooks/apis/vote/use-finish-vote-room';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { VoteTeacherSnapshot } from '@/apis/vote/vote';
import { MAX_VOTE_OPTIONS } from '../vote-constants';

type Props = {
  params: {
    roomId: string;
  };
};

const DEFAULT_OPTIONS = ['', ''];
type RevoteOptionItem = {
  id: string;
  label: string;
  isCustom: boolean;
};

export default function VoteTeacherContainer({ params }: Props) {
  const { roomId } = params;
  const router = useRouter();
  const { toast } = useToast();
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, refetch } = useGetVoteTeacherSnapshot({ roomId });
  const [snapshot, setSnapshot] = useState<VoteTeacherSnapshot | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [maxSelections, setMaxSelections] = useState(1);
  const [revoteOptionIds, setRevoteOptionIds] = useState<string[]>([]);
  const [revoteOptions, setRevoteOptions] = useState<RevoteOptionItem[]>([]);
  const [revoteOptionDraft, setRevoteOptionDraft] = useState('');
  const [revoteQuestion, setRevoteQuestion] = useState('');
  const [revoteMaxSelections, setRevoteMaxSelections] = useState(1);
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
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const currentRound = snapshot?.currentRound ?? null;
  const isConnectionHealthy = connectionStatus === 'connected';
  const inviteUrl = `${origin}/vote/student/${roomId}`;
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
          setRevoteOptions([]);
          setRevoteOptionDraft('');
          setRevoteQuestion('');
          setRevoteMaxSelections(1);
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
          refetch();
        },
      },
    );
  };

  const initializeRevoteForm = () => {
    if (!currentRound) return;
    const initialRevoteOptions = currentRound.options.map((option) => ({
      id: option.id,
      label: option.label,
      isCustom: false,
    }));
    setRevoteOptions(initialRevoteOptions);
    setRevoteOptionIds([]);
    setRevoteOptionDraft('');
    setRevoteQuestion(currentRound.question);
    setRevoteMaxSelections(Math.max(1, currentRound.maxSelections));
  };

  const addRevoteOption = () => {
    const label = revoteOptionDraft.trim();
    if (!label) return;

    const customOptionId = `custom-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const customOption: RevoteOptionItem = {
      id: customOptionId,
      label,
      isCustom: true,
    };

    setRevoteOptions((previous) => {
      return [...previous, customOption];
    });
    setRevoteOptionIds((previous) => {
      if (previous.length >= MAX_VOTE_OPTIONS) {
        toast({
          title: `선택지는 최대 ${MAX_VOTE_OPTIONS}개까지만 선택할 수 있어요.`,
          variant: 'error',
        });
        return previous;
      }
      return [...previous, customOptionId];
    });
    setRevoteOptionDraft('');
  };

  const removeRevoteOption = (optionId: string) => {
    setRevoteOptions((previous) =>
      previous.filter((option) => option.id !== optionId),
    );
    setRevoteOptionIds((previous) => previous.filter((id) => id !== optionId));
  };

  const toggleRevoteOption = (optionId: string) => {
    setRevoteOptionIds((previous) => {
      if (previous.includes(optionId)) {
        return previous.filter((id) => id !== optionId);
      }
      if (previous.length >= MAX_VOTE_OPTIONS) {
        toast({
          title: `선택지는 최대 ${MAX_VOTE_OPTIONS}개까지만 선택할 수 있어요.`,
          variant: 'error',
        });
        return previous;
      }
      return [...previous, optionId];
    });
  };

  const buildRevote = () => {
    if (!currentRound) return;
    const trimmedRevoteQuestion = revoteQuestion.trim();

    if (!trimmedRevoteQuestion) {
      setErrorMessage('재투표 질문을 입력해주세요.');
      return;
    }

    if (revoteOptionIds.length < 2) {
      setErrorMessage('재투표는 최소 2개 선택지로 설정해주세요.');
      return;
    }

    if (revoteMaxSelections > revoteOptionIds.length) {
      setErrorMessage('최대 선택 개수는 선택지 개수를 넘을 수 없습니다.');
      return;
    }

    const selectedRevoteOptions = revoteOptions
      .filter((option) => revoteOptionIds.includes(option.id))
      .map((option) => option.label.trim())
      .filter(Boolean);

    setErrorMessage('');
    createVoteRoundMutation(
      {
        roomId,
        question: trimmedRevoteQuestion,
        maxSelections: revoteMaxSelections,
        options: selectedRevoteOptions,
      },
      {
        onSuccess: () => {
          setOptions(DEFAULT_OPTIONS);
          setQuestion('');
          setMaxSelections(1);
          setRevoteOptionIds([]);
          setRevoteOptions([]);
          setRevoteOptionDraft('');
          setRevoteQuestion('');
          setRevoteMaxSelections(1);
          setIsCreatingRevote(false);
          refetch();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  const copyInviteUrl = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = inviteUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast({
        title: 'URL이 복사되었습니다.',
        variant: 'success',
      });
    } catch (error) {
      console.error('초대 링크 복사 실패:', error);
      toast({
        title: '링크 복사에 실패했어요.',
        variant: 'error',
      });
    }
  };

  const openQrInPopupWindow = () => {
    const canvasElement = qrContainerRef.current?.querySelector('canvas');
    if (!canvasElement) {
      toast({
        title: 'QR 코드를 불러오는 중이에요. 잠시 후 다시 시도해주세요.',
        variant: 'error',
      });
      return;
    }

    const exportCanvas = document.createElement('canvas');
    const exportSize = 1200;
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const exportContext = exportCanvas.getContext('2d');
    if (exportContext) {
      exportContext.imageSmoothingEnabled = false;
      exportContext.drawImage(canvasElement, 0, 0, exportSize, exportSize);
    }

    const qrImageDataUrl = exportCanvas.toDataURL('image/png');
    const popupWidth = window.screen.availWidth;
    const popupHeight = window.screen.availHeight;
    const popupWindow = window.open(
      '',
      'vote-qr-popup',
      `popup=yes,width=${popupWidth},height=${popupHeight},left=0,top=0`,
    );

    if (!popupWindow) {
      toast({
        title: '팝업이 차단되었어요. 브라우저 설정을 확인해주세요.',
        variant: 'error',
      });
      return;
    }

    popupWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>투표 초대 QR</title>
        <style>
          html, body {
            width: 100%;
            height: 100%;
          }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f8fafc;
            color: #0f172a;
          }
          main {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-rows: 1fr auto;
          }
          .qr-wrap {
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          img {
            width: min(100vw, calc(100vh - 64px));
            height: min(100vw, calc(100vh - 64px));
            object-fit: contain;
            border-radius: 16px;
            background: #fff;
            padding: 12px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
            image-rendering: crisp-edges;
            image-rendering: pixelated;
          }
          p {
            margin: 0;
            padding: 10px 16px 14px;
            font-size: 13px;
            color: #475569;
            text-align: center;
            word-break: break-all;
            background: rgba(248, 250, 252, 0.95);
          }
        </style>
      </head>
      <body>
        <main>
          <div class="qr-wrap">
            <img src="${qrImageDataUrl}" alt="투표 초대 QR 코드" />
          </div>
          <p>${inviteUrl}</p>
        </main>
      </body>
      </html>
    `);
    popupWindow.document.close();
  };

  if (!snapshot) {
    return (
      <div className="w-full flex justify-center py-20">
        <LoaderCircle className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  const roomStatusTextMap = {
    live: '투표 진행 중',
    ended: '투표 종료',
    draft: '투표 준비',
  } as const;
  const roomStatusText = roomStatusTextMap[snapshot.room.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Heading1 className="mb-0">{snapshot.room.title}</Heading1>
        <div className="flex items-center gap-2">
          {isConnectionHealthy ? (
            <Badge variant="primary-outline">연결 정상</Badge>
          ) : (
            <RefreshCw className="size-4" onClick={reconnect} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <Card className="border-primary-100/70 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>진행 상태</span>
                <Badge>{roomStatusText}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-900 px-3 py-2.5 flex items-center gap-2 text-sm text-text-subtitle">
                <Users className="size-4 text-primary" />
                입장 학생{' '}
                <span className="font-semibold text-text-title">
                  {snapshot.joinedStudentCount}명
                </span>
              </div>

              {currentRound ? (
                <>
                  <div className="rounded-xl border border-primary-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <Heading3 className="text-base leading-relaxed tracking-tight">
                        {currentRound.question}
                      </Heading3>
                      <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-200 whitespace-nowrap">
                        최대 선택 {currentRound.maxSelections}개
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentRound.options.map((option) => {
                      const totalVotes = Math.max(currentRound.totalVotes, 1);
                      const ratio = Math.round(
                        (option.voteCount / totalVotes) * 100,
                      );
                      return (
                        <div
                          key={option.id}
                          className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-4 bg-white dark:bg-gray-950"
                        >
                          <div className="flex justify-between text-sm items-center gap-2">
                            <span className="font-medium leading-5">
                              {option.label}
                            </span>
                            <span className="text-text-subtitle whitespace-nowrap text-xs">
                              {option.voteCount}표 · {ratio}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
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
                      onClick={handleStartRound}
                      isPending={isStarting}
                      className="w-full h-11"
                    >
                      투표 시작하기
                    </Button>
                  )}

                  {currentRound.status === 'live' && (
                    <Button
                      variant="primary-outline"
                      onClick={handleEndRound}
                      isPending={isEnding}
                      className="w-full h-11"
                    >
                      투표 종료하기
                    </Button>
                  )}

                  {currentRound.status === 'ended' &&
                    snapshot.room.status !== 'ended' && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button
                            variant="gray"
                            onClick={() => {
                              setIsCreatingRevote((previous) => {
                                const next = !previous;
                                if (next) {
                                  initializeRevoteForm();
                                } else {
                                  setRevoteOptionIds([]);
                                  setRevoteOptions([]);
                                  setRevoteOptionDraft('');
                                  setRevoteQuestion('');
                                  setRevoteMaxSelections(1);
                                }
                                return next;
                              });
                              setErrorMessage('');
                            }}
                            className="w-full h-11"
                          >
                            재투표 만들기
                          </Button>
                          <Button
                            variant="gray"
                            onClick={handleFinishRoom}
                            isPending={isFinishing}
                            className="w-full h-11"
                          >
                            마무리하기
                          </Button>
                        </div>

                        {isCreatingRevote && (
                          <div className="pt-3 space-y-3">
                            <div className="text-sm text-text-subtitle">
                              재투표 질문과 최대 선택 개수를 설정하고, 포함할
                              선택지를 고를 수 있습니다.
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-sm font-semibold text-text-title">
                                  재투표 질문
                                </Label>
                                <Textarea
                                  value={revoteQuestion}
                                  onChange={(event) =>
                                    setRevoteQuestion(event.target.value)
                                  }
                                  placeholder="재투표 질문을 입력하세요."
                                  className="min-h-[88px]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="revote-max-selections"
                                  className="text-sm font-semibold text-text-title"
                                >
                                  최대 선택 개수
                                </Label>
                                <Input
                                  id="revote-max-selections"
                                  type="number"
                                  min={1}
                                  max={Math.max(1, revoteOptionIds.length)}
                                  value={revoteMaxSelections}
                                  onChange={(event) => {
                                    const value = Number(event.target.value);
                                    if (!Number.isNaN(value)) {
                                      setRevoteMaxSelections(
                                        Math.max(1, value),
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-text-title">
                                  선택지
                                </Label>
                                <span className="text-xs text-text-subtitle">
                                  선택됨 {revoteOptionIds.length}/
                                  {MAX_VOTE_OPTIONS}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-3">
                                {revoteOptions.map((option, index) => (
                                  <div
                                    key={option.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      toggleRevoteOption(option.id)
                                    }
                                    onKeyDown={(event) => {
                                      if (
                                        event.key === 'Enter' ||
                                        event.key === ' '
                                      ) {
                                        event.preventDefault();
                                        toggleRevoteOption(option.id);
                                      }
                                    }}
                                    className="flex min-h-12 items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-2 cursor-pointer"
                                  >
                                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary text-xs font-semibold px-1">
                                      {index + 1}
                                    </span>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <Checkbox
                                        checked={revoteOptionIds.includes(
                                          option.id,
                                        )}
                                        onCheckedChange={() =>
                                          toggleRevoteOption(option.id)
                                        }
                                        className="pointer-events-none"
                                      />
                                      <span className="truncate">
                                        {option.label}
                                      </span>
                                    </div>
                                    {option.isCustom && (
                                      <Button
                                        type="button"
                                        variant="gray-outline"
                                        size="sm"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          removeRevoteOption(option.id);
                                        }}
                                        className="h-8 w-8 min-w-0 p-0"
                                        aria-label="추가한 선택지 삭제"
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-2">
                                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary text-xs font-semibold px-1">
                                  <Plus className="size-4" />
                                </span>
                                <Input
                                  value={revoteOptionDraft}
                                  onChange={(event) =>
                                    setRevoteOptionDraft(event.target.value)
                                  }
                                  placeholder="재투표 선택지 추가"
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      event.preventDefault();
                                      addRevoteOption();
                                    }
                                  }}
                                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                                />
                                <Button
                                  variant="gray-outline"
                                  size="sm"
                                  onClick={addRevoteOption}
                                  disabled={!revoteOptionDraft.trim()}
                                  className="h-8 px-3"
                                >
                                  추가
                                </Button>
                              </div>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              isPending={isRoundCreating}
                              onClick={buildRevote}
                              className="w-full h-11"
                            >
                              재투표 라운드 생성
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                </>
              ) : (
                <div className="text-sm text-text-subtitle rounded-xl border border-dashed dark:border-gray-700 px-4 py-5">
                  아직 생성된 투표 라운드가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {!currentRound && (
            <Card className="border-primary-100/70 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle>투표 만들기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="space-y-2 md:col-span-3">
                    <Label className="text-sm font-semibold text-text-title">
                      질문
                    </Label>
                    <Textarea
                      placeholder="질문을 입력하세요."
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      className="min-h-[92px] border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <div className="rounded-lg px-3 py-3 flex flex-col gap-2">
                    <Label htmlFor="max-selections">최대 선택 개수</Label>
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
                      className="bg-white dark:bg-gray-950"
                    />
                    <p className="text-xs text-text-subtitle">
                      유효한 선택지 수 기준으로 자동 제한됩니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-text-title">
                      선택지
                    </Label>
                    <span className="text-xs text-text-subtitle">
                      {options.length}/{MAX_VOTE_OPTIONS}
                    </span>
                  </div>
                  {options.map((option, index) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-2"
                    >
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary text-xs font-semibold px-1">
                        {index + 1}
                      </span>
                      <Input
                        value={option}
                        onChange={(event) =>
                          updateOptionValue(index, event.target.value)
                        }
                        placeholder={`선택지 ${index + 1}`}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />
                      <Button
                        variant="gray-outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                        className="h-8 w-8 min-w-0 p-0"
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
                    className="w-full border-dashed"
                  >
                    <Plus className="size-4 mr-1" />
                    선택지 추가 ({options.length}/{MAX_VOTE_OPTIONS})
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  {errorMessage && (
                    <p className="text-sm text-red">{errorMessage}</p>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => createRound(options)}
                    isPending={isRoundCreating}
                    className="w-full"
                  >
                    만들기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {snapshot.room.status === 'ended' && resultSourceRound && (
            <Card className="border-primary-100/70 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>최종 결과 Top 3</span>
                  <Badge variant="primary-outline">
                    총 {resultSourceRound.totalVotes}표
                  </Badge>
                </CardTitle>
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
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary text-xs font-semibold px-1">
                            {index + 1}
                          </span>
                          <div className="font-medium text-text-title truncate">
                            {option.label}
                          </div>
                        </div>
                        <Badge variant="gray-outline">
                          {option.voteCount}표
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full h-11"
                  onClick={() => {
                    router.push('/vote');
                  }}
                >
                  새로운 투표 만들기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="xl:sticky xl:top-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>학생 초대 QR</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <div
                ref={qrContainerRef}
                className="rounded-xl bg-white p-3 dark:bg-gray-950 border dark:border-gray-800"
              >
                <QRCodeCanvas value={inviteUrl} size={300} />
              </div>
              <div className="text-xs text-text-subtitle break-all text-center">
                {inviteUrl}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="gray-outline"
                      size="sm"
                      className="w-full"
                    >
                      <ZoomIn className="size-4 mr-1" />
                      크게 보기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[92vw] sm:max-w-2xl p-6">
                    <DialogTitle className="text-center">
                      학생 초대 QR 코드
                    </DialogTitle>
                    <div className="flex justify-center">
                      <div className="rounded-xl bg-white p-3 border dark:border-gray-800">
                        <QRCodeCanvas value={inviteUrl} size={520} />
                      </div>
                    </div>
                    <p className="text-xs text-text-subtitle break-all text-center">
                      {inviteUrl}
                    </p>
                  </DialogContent>
                </Dialog>

                <Button
                  type="button"
                  variant="gray-outline"
                  size="sm"
                  className="w-full"
                  onClick={openQrInPopupWindow}
                >
                  <ExternalLink className="size-4 mr-1" />새 창으로 보기
                </Button>

                <Button
                  type="button"
                  variant="gray-outline"
                  size="sm"
                  className="w-full"
                  onClick={copyInviteUrl}
                >
                  <Copy className="size-4 mr-1" />
                  URL 복사
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
