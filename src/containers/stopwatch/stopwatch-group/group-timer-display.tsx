'use client';

import { Button } from '@/components/button';
import {
  Play,
  Pause,
  RotateCcw,
  Columns2,
  Columns3,
  Columns4,
} from 'lucide-react';
import { useEffect } from 'react';
import { useSidebar } from '@/components/sidebar';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Skeleton } from '@/components/skeleton';
import {
  useGroupStopwatchState,
  useGroupStopwatchAction,
} from './stopwatch-group-provider.hooks';
import GroupTimerCard from './group-timer-card';

interface GroupTimerDisplayProps {
  groupId: string;
}

type GridColumns = 2 | 3 | 4;

export default function GroupTimerDisplay({ groupId }: GroupTimerDisplayProps) {
  const { timers, isAllRunning, isAllPaused, savedGroups } =
    useGroupStopwatchState();
  const { startAll, pauseAll, resetAll, loadGroup } = useGroupStopwatchAction();
  const { state, isMobile } = useSidebar();

  const currentGroup = savedGroups?.find((group) => group.id === groupId);

  // 그리드 컬럼 수 설정 (로컬 스토리지에 저장)
  const [gridColumns, setGridColumns] = useLocalStorage<GridColumns>(
    'stopwatch-group-grid-columns',
    4,
  );

  // 사이드바 너비 계산 (모바일: 0, 데스크톱 expanded: 288px, collapsed: 3rem)
  const getSidebarOffset = () => {
    if (isMobile) return '0px';
    if (state === 'expanded') return '288px';
    return '3rem';
  };
  const sidebarOffset = getSidebarOffset();

  // 그리드 클래스 생성 (gridColumns가 null이면 기본값 4 사용)
  const getGridClass = () => {
    const columns = gridColumns ?? 4;
    const baseClass = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    const xlClasses = {
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
    };
    return `${baseClass} ${xlClasses[columns]}`;
  };

  // 컬럼 수에 따른 카드 높이 클래스 (gridColumns가 null이면 기본값 4 사용)
  const getCardHeightClass = () => {
    const columns = gridColumns ?? 4;
    if (columns === 2) return 'min-h-[320px]';
    if (columns === 3) return 'min-h-[280px]';
    return 'min-h-[240px]';
  };

  // 컬럼 수에 따른 타이머 숫자 크기 클래스 (gridColumns가 null이면 기본값 4 사용)
  const getTimerSizeClass = () => {
    const columns = gridColumns ?? 4;
    if (columns === 2) return 'text-5xl xl:text-6xl';
    if (columns === 3) return 'text-4xl xl:text-5xl';
    return 'text-3xl xl:text-4xl';
  };

  // groupId가 변경될 때마다 해당 그룹을 로드
  useEffect(() => {
    if (groupId) {
      loadGroup(groupId);
    }
  }, [groupId, loadGroup]);

  const handleStartAll = () => {
    startAll();
  };

  const handlePauseAll = () => {
    pauseAll();
  };

  const handleResetAll = () => {
    resetAll();
  };

  return (
    <>
      <div className="space-y-6 mb-40">
        <div className="flex gap-4 justify-between items-start">
          {/* Header */}
          <div className="flex items-center justify-between flex-1">
            {savedGroups === null ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-text-title">
                  {currentGroup?.title || '그룹 스톱워치'}
                </h2>
                <p className="text-text-description">
                  {timers.length}개의 타이머가 실행 중입니다.
                </p>
              </div>
            )}
          </div>

          {/* Grid Column Selector - 우측 상단, xl 이상에서만 표시 */}
          {gridColumns === null ? (
            <div className="hidden xl:flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Skeleton className="size-9 rounded" />
              <Skeleton className="size-9 rounded" />
              <Skeleton className="size-9 rounded" />
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              {[
                { columns: 2 as GridColumns, Icon: Columns2 },
                { columns: 3 as GridColumns, Icon: Columns3 },
                { columns: 4 as GridColumns, Icon: Columns4 },
              ].map(({ columns, Icon }) => {
                const isActive = gridColumns === columns;
                return (
                  <button
                    key={columns}
                    type="button"
                    onClick={() => setGridColumns(columns)}
                    className={`
                      p-2 rounded transition-colors
                      ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                    `}
                    aria-label={`${columns}단 레이아웃`}
                  >
                    <Icon className="size-5" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {/* Timer Grid */}
        {savedGroups === null ? (
          <div className={getGridClass()}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                key={`timer-skeleton-${groupId}-${index}`}
                className={`rounded-xl ${getCardHeightClass()}`}
              />
            ))}
          </div>
        ) : (
          <>
            <div className={getGridClass()}>
              {timers.map((timer) => (
                <GroupTimerCard
                  key={timer.id}
                  timer={timer}
                  minHeightClass={getCardHeightClass()}
                  timerSizeClass={getTimerSizeClass()}
                />
              ))}
            </div>
            {timers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-description">타이머가 없습니다.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Global Controls - Fixed at bottom center */}
      {savedGroups !== null && (
        <div
          className="fixed bottom-6 z-50 flex items-center justify-center gap-4 p-4 bg-muted/70 backdrop-blur-sm rounded-lg shadow-lg"
          style={
            isMobile
              ? {
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
              : {
                  left: `calc(${sidebarOffset} + (100vw - ${sidebarOffset}) / 2)`,
                  transform: 'translateX(-50%)',
                }
          }
        >
          <Button
            variant="primary-ghost"
            size="lg"
            onClick={handleStartAll}
            disabled={isAllRunning}
            className="flex items-center gap-2"
          >
            <Play className="size-5" />
            전체 시작
          </Button>

          <Button
            variant="primary-ghost"
            size="lg"
            onClick={handlePauseAll}
            disabled={isAllPaused}
            className="flex items-center gap-2"
          >
            <Pause className="size-5" />
            전체 일시정지
          </Button>

          <Button
            variant="primary-ghost"
            size="lg"
            onClick={handleResetAll}
            className="flex items-center gap-2"
          >
            <RotateCcw className="size-5" />
            전체 초기화
          </Button>
        </div>
      )}
    </>
  );
}
