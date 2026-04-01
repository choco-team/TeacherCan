'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Card } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Poll } from '@/types/quickpoll';
import { useGetPollResults } from '@/hooks/apis/quickpoll/use-cast-vote';
import {
  BarChart3,
  Vote,
  X,
  Maximize2,
  AlignLeft,
  AlignCenter,
  ArrowUpDown,
  List,
  PieChart,
} from 'lucide-react';

interface PollResultsViewProps {
  poll: Poll;
}

type SortMode = 'registered' | 'votes';
type ChartMode = 'bar-horizontal' | 'bar-vertical' | 'pie';

// ─── 파스텔 색상 팔레트 ───
const PASTEL_COLORS = [
  '#FFADAD', // 연한 빨강
  '#FFD6A5', // 연한 주황
  '#FDFFB6', // 연한 노랑
  '#CAFFBF', // 연한 초록
  '#9BF6FF', // 연한 하늘
  '#A0C4FF', // 연한 파랑
  '#BDB2FF', // 연한 보라
  '#FFC6FF', // 연한 핑크
  '#D4E09B', // 연한 올리브
  '#F7B2BD', // 연한 살구
];

function getColor(index: number) {
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
}

// ─── SVG 원형 차트 ───
function PieChartSVG({
  options,
  totalVotes,
  onImageClick,
}: {
  options: Array<{ id: string; title: string; voteCount: number; imageUrl?: string }>;
  totalVotes: number;
  onImageClick?: (url: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const SIZE = 220;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 82;
  const INNER_R = 46; // 도넛 안쪽 반지름

  // 조각 계산
  const slices = useMemo(() => {
    if (totalVotes === 0) return [];
    let startAngle = -Math.PI / 2; // 12시 방향부터
    return options
      .filter((o) => o.voteCount > 0)
      .map((option, i) => {
        const ratio = option.voteCount / totalVotes;
        const angle = ratio * 2 * Math.PI;
        const endAngle = startAngle + angle;

        const x1 = CX + R * Math.cos(startAngle);
        const y1 = CY + R * Math.sin(startAngle);
        const x2 = CX + R * Math.cos(endAngle);
        const y2 = CY + R * Math.sin(endAngle);
        const ix1 = CX + INNER_R * Math.cos(startAngle);
        const iy1 = CY + INNER_R * Math.sin(startAngle);
        const ix2 = CX + INNER_R * Math.cos(endAngle);
        const iy2 = CY + INNER_R * Math.sin(endAngle);

        const largeArc = angle > Math.PI ? 1 : 0;
        const midAngle = startAngle + angle / 2;

        const path = [
          `M ${ix1} ${iy1}`,
          `L ${x1} ${y1}`,
          `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
          `L ${ix2} ${iy2}`,
          `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${ix1} ${iy1}`,
          'Z',
        ].join(' ');

        const result = {
          id: option.id,
          path,
          color: getColor(i),
          midAngle,
          ratio,
          voteCount: option.voteCount,
        };
        startAngle = endAngle;
        return result;
      });
  }, [options, totalVotes, CX, CY, R, INNER_R]);

  const activeSlice = hovered
    ? slices.find((s) => s.id === hovered)
    : null;

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
      {/* SVG */}
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {totalVotes === 0 ? (
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={R - INNER_R}
            />
          ) : (
            slices.map((slice) => {
              const isHovered = hovered === slice.id;
              const scale = isHovered ? 1.04 : 1;
              return (
                <path
                  key={slice.id}
                  d={slice.path}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    transformOrigin: `${CX}px ${CY}px`,
                    transform: `scale(${scale})`,
                    transition: 'transform 0.18s ease',
                    cursor: 'pointer',
                    filter: isHovered
                      ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))'
                      : 'none',
                  }}
                  onMouseEnter={() => setHovered(slice.id)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })
          )}
          {/* 중앙 텍스트 */}
          {activeSlice ? (
            <>
              <text
                x={CX}
                y={CY - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold"
                style={{ fontSize: 18, fontWeight: 700, fill: '#18181b' }}
              >
                {(activeSlice.ratio * 100).toFixed(1)}%
              </text>
              <text
                x={CX}
                y={CY + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 11, fill: '#71717a' }}
              >
                {activeSlice.voteCount}표
              </text>
            </>
          ) : (
            <>
              <text
                x={CX}
                y={CY - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 20, fontWeight: 700, fill: '#18181b' }}
              >
                {totalVotes}
              </text>
              <text
                x={CX}
                y={CY + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 11, fill: '#71717a' }}
              >
                총 투표
              </text>
            </>
          )}
        </svg>
      </div>

      {/* 범례 */}
      <div className="flex-1 space-y-2 w-full">
        {options.map((option, i) => {
          const percentage =
            totalVotes > 0
              ? ((option.voteCount / totalVotes) * 100).toFixed(1)
              : '0';
          const isHov = hovered === option.id;
          return (
            <div
              key={option.id}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-colors cursor-default"
              style={{
                background: isHov ? `${getColor(i)}40` : 'transparent',
              }}
              onMouseEnter={() => setHovered(option.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* 색상 점 */}
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: getColor(i) }}
              />
              {/* 이미지 */}
              {option.imageUrl && (
                <button
                  onClick={() => onImageClick?.(option.imageUrl!)}
                  className="w-6 h-6 rounded overflow-hidden shrink-0 hover:opacity-80"
                >
                  <Image
                    src={option.imageUrl}
                    alt={option.title}
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                </button>
              )}
              <span className="text-sm font-medium flex-1 truncate">
                {option.title}
              </span>
              <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: getColor(i) === '#FDFFB6' ? '#b45309' : undefined }}>
                {option.voteCount}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums w-12 text-right shrink-0">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PollResultsView({ poll }: PollResultsViewProps) {
  const { results, loading, fetch } = useGetPollResults(poll.id);
  const [autoRefresh] = useState(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('registered');
  const [chartMode, setChartMode] = useState<ChartMode>('bar-horizontal');

  useEffect(() => {
    fetch();
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetch, autoRefresh]);

  const maxVotes = Math.max(...results.options.map((o) => o.voteCount), 1);

  const sortedOptions = useMemo(() => {
    const opts = [...results.options];
    if (sortMode === 'votes') {
      opts.sort((a, b) => b.voteCount - a.voteCount);
    }
    return opts;
  }, [results.options, sortMode]);

  // ─── 가로 막대 차트 ───
  const renderHorizontalBars = (options: typeof sortedOptions) => (
    <div className="space-y-3">
      {options.map((option, rank) => {
        const percentage =
          results.totalVotes > 0
            ? ((option.voteCount / results.totalVotes) * 100).toFixed(1)
            : '0';
        const barWidth = maxVotes > 0 ? (option.voteCount / maxVotes) * 100 : 0;
        const isTop = sortMode === 'votes' && rank === 0 && option.voteCount > 0;
        const color = getColor(rank);

        return (
          <div key={option.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                {isTop && (
                  <span className="text-xs font-bold text-amber-500 shrink-0">🥇</span>
                )}
                {option.imageUrl && (
                  <button
                    onClick={() => setSelectedImageUrl(option.imageUrl!)}
                    className="w-7 h-7 rounded shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={option.imageUrl}
                      alt={option.title}
                      width={28}
                      height={28}
                      className="object-cover w-full h-full"
                    />
                  </button>
                )}
                <span className="font-medium truncate">{option.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className="font-bold tabular-nums" style={{ color: '#374151' }}>
                  {option.voteCount}
                </span>
                <span className="text-muted-foreground tabular-nums w-14 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${barWidth}%`,
                  background: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  // ─── 세로 막대 차트 ───
  const renderVerticalBars = (options: typeof sortedOptions) => {
    const BAR_HEIGHT = 140;
    return (
      <div className="overflow-x-auto">
        <div
          className="flex items-end gap-3 min-w-0"
          style={{ minWidth: options.length * 80 }}
        >
          {options.map((option, rank) => {
            const percentage =
              results.totalVotes > 0
                ? ((option.voteCount / results.totalVotes) * 100).toFixed(1)
                : '0';
            const barH =
              maxVotes > 0 ? (option.voteCount / maxVotes) * BAR_HEIGHT : 0;
            const isTop = sortMode === 'votes' && rank === 0 && option.voteCount > 0;
            const color = getColor(rank);

            return (
              <div
                key={option.id}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-[64px]"
              >
                <span className="text-sm font-bold tabular-nums" style={{ color: '#374151' }}>
                  {option.voteCount}
                </span>
                <div className="w-full relative" style={{ height: BAR_HEIGHT }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                    style={{
                      height: barH === 0 ? 2 : barH,
                      background: color,
                    }}
                  />
                </div>
                <div className="text-center">
                  {option.imageUrl && (
                    <button
                      onClick={() => setSelectedImageUrl(option.imageUrl!)}
                      className="w-8 h-8 rounded overflow-hidden mx-auto mb-1 hover:opacity-80"
                    >
                      <Image
                        src={option.imageUrl}
                        alt={option.title}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  )}
                  <p className="text-xs font-medium leading-tight line-clamp-2 text-center">
                    {isTop && '🥇 '}
                    {option.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChart = (options: typeof sortedOptions) => {
    if (chartMode === 'bar-vertical') return renderVerticalBars(options);
    if (chartMode === 'pie') {
      return (
        <PieChartSVG
          options={options}
          totalVotes={results.totalVotes}
          onImageClick={setSelectedImageUrl}
        />
      );
    }
    return renderHorizontalBars(options);
  };

  const chartContent = (
    <div className="space-y-4">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* 정렬 탭 */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setSortMode('registered')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              sortMode === 'registered'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            등록순
          </button>
          <button
            onClick={() => setSortMode('votes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              sortMode === 'votes'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            득표순
          </button>
        </div>

        {/* 차트 전환 */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setChartMode('bar-horizontal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartMode === 'bar-horizontal'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="가로 막대"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            가로
          </button>
          <button
            onClick={() => setChartMode('bar-vertical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartMode === 'bar-vertical'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="세로 막대"
          >
            <AlignCenter className="w-3.5 h-3.5" />
            세로
          </button>
          <button
            onClick={() => setChartMode('pie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartMode === 'pie'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="원형 차트"
          >
            <PieChart className="w-3.5 h-3.5" />
            원형
          </button>
        </div>
      </div>

      {/* 차트 */}
      {results.totalVotes === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Vote className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>아직 투표가 없습니다</p>
        </div>
      ) : (
        renderChart(sortedOptions)
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="p-8 space-y-6 relative">
        {/* 전체화면 버튼 */}
        <button
          onClick={() => setIsFullScreen(true)}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          title="크게 보기"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
            <BarChart3 className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{poll.title}</h2>
          <p className="text-muted-foreground text-sm">
            총{' '}
            <span className="font-semibold text-foreground">
              {results.totalVotes}
            </span>
            명 투표
          </p>
        </div>

        {/* 차트 영역 */}
        {chartContent}

        {/* 자동 업데이트 표시 */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          실시간 업데이트 중
        </div>
      </Card>

      {/* 이미지 확대 Dialog */}
      <Dialog
        open={!!selectedImageUrl}
        onOpenChange={(open) => !open && setSelectedImageUrl(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogDescription>
            <button
              onClick={() => setSelectedImageUrl(null)}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogDescription>
          {selectedImageUrl && (
            <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
              <Image
                src={selectedImageUrl}
                alt="확대된 선택지 이미지"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 전체화면 Dialog */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            {poll.title} 결과
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm mb-6">
            총 {results.totalVotes}명 투표
          </p>
          <div className="px-4 pb-8">{chartContent}</div>
          <DialogDescription className="sr-only">
            전체 화면 차트 뷰
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
