import Link from 'next/link';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { TableHead } from '@/components/table';

/** 정렬 가능한 컬럼. PostgREST 로 그대로 넘기므로 화이트리스트로 제한한다. */
export const SORT_KEYS = [
  'roomTitle',
  'id',
  'connectedAt',
  'lastActivityAt',
] as const;

export type SortKey = (typeof SORT_KEYS)[number];
export type SortDirection = 'asc' | 'desc';

export const parseSort = (value?: string): SortKey =>
  SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : 'lastActivityAt';

export const parseDirection = (value?: string): SortDirection =>
  value === 'desc' ? 'desc' : 'asc';

type Props = {
  label: string;
  sortKey: SortKey;
  activeSort: SortKey;
  activeDirection: SortDirection;
  className?: string;
};

export default function SortableHead({
  label,
  sortKey,
  activeSort,
  activeDirection,
  className,
}: Props) {
  const isActive = activeSort === sortKey;

  // 같은 컬럼을 다시 누르면 방향을 뒤집고, 다른 컬럼이면 오름차순부터 시작한다
  const nextDirection: SortDirection =
    isActive && activeDirection === 'asc' ? 'desc' : 'asc';

  return (
    <TableHead className={className}>
      <Link
        href={`?sort=${sortKey}&dir=${nextDirection}`}
        className="flex items-center gap-1 hover:text-text-title"
      >
        {label}
        {!isActive && <ChevronsUpDown size={14} className="text-gray-400" />}
        {isActive && activeDirection === 'asc' && <ChevronUp size={14} />}
        {isActive && activeDirection === 'desc' && <ChevronDown size={14} />}
      </Link>
    </TableHead>
  );
}
