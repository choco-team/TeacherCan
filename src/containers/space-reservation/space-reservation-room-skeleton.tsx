import { Skeleton } from '@/components/skeleton';

const ROOM_TABLE_SKELETON_KEYS = [
  'h-period',
  'h-mon',
  'h-tue',
  'h-wed',
  'h-thu',
  'h-fri',
  'p1-period',
  'p1-mon',
  'p1-tue',
  'p1-wed',
  'p1-thu',
  'p1-fri',
  'p2-period',
  'p2-mon',
  'p2-tue',
  'p2-wed',
  'p2-thu',
  'p2-fri',
  'p3-period',
  'p3-mon',
  'p3-tue',
  'p3-wed',
  'p3-thu',
  'p3-fri',
  'p4-period',
  'p4-mon',
  'p4-tue',
  'p4-wed',
  'p4-thu',
  'p4-fri',
  'p5-period',
  'p5-mon',
  'p5-tue',
  'p5-wed',
  'p5-thu',
  'p5-fri',
  'p6-period',
  'p6-mon',
  'p6-tue',
  'p6-wed',
  'p6-thu',
  'p6-fri',
];

export default function SpaceReservationRoomSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="rounded-xl border border-border/60 p-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-3 h-4 w-72" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
      <div className="rounded-xl border border-border/70 p-4">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {ROOM_TABLE_SKELETON_KEYS.map((cellKey) => (
            <Skeleton key={cellKey} className="min-h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
