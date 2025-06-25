import { Checkbox } from '@/components/checkbox';
import { format } from 'date-fns';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/table';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '@/components/skeleton';
import OptionBadge from './optionBadge/optionBadge';
import { useRandomPickPlaygroundState } from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

interface RandomPickListInnerProps {
  selectedRows: string[];
  setSelectedRows: Dispatch<SetStateAction<string[]>>;
}

export function RandomPickListInner({
  selectedRows,
  setSelectedRows,
}: RandomPickListInnerProps) {
  const router = useRouter();

  const { randomPickList } = useRandomPickPlaygroundState();

  const orderedRandomPickList = randomPickList?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 dark:bg-muted-foreground/50 font-semibold text-text-title">
          <TableHead className="w-[40px] h-12">
            <div className="flex items-center justify-center">
              <Checkbox
                aria-label="Select all rows"
                checked={
                  orderedRandomPickList?.length > 0 &&
                  selectedRows.length === orderedRandomPickList?.length
                }
                onCheckedChange={(checked) => {
                  setSelectedRows(
                    checked ? orderedRandomPickList.map((row) => row.id) : [],
                  );
                }}
              />
            </div>
          </TableHead>
          <TableHead className="min-w-[240px] w-[240px] text-text-title">
            제목
          </TableHead>
          <TableHead className="w-[96px] text-text-title">뽑기 타입</TableHead>
          <TableHead className="w-[96px] text-center text-text-title">
            학생 수
          </TableHead>
          <TableHead className="w-[144px] text-center text-text-title">
            뽑힌 학생 제외
          </TableHead>
          <TableHead className="w-[144px] text-center text-text-title">
            결과 숨기기
          </TableHead>
          <TableHead className="w-[144px] text-center text-text-title">
            카드 섞기 효과
          </TableHead>
          <TableHead className="w-[192px] text-text-title">생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!orderedRandomPickList ? (
          <TableRow>
            <TableCell colSpan={8} className="h-32 text-center p-0">
              <Skeleton className="h-32 w-full rounded-none" />
            </TableCell>
          </TableRow>
        ) : null}
        {orderedRandomPickList?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-32 text-center">
              <span className="text-text-description">
                아직 랜덤뽑기가 없어요! 랜덤뽑기를 만들어보세요.
              </span>
            </TableCell>
          </TableRow>
        ) : null}
        {orderedRandomPickList?.length > 0
          ? orderedRandomPickList?.map((row) => (
              <TableRow
                key={row.id}
                className="h-12  cursor-pointer text-text-title"
                onClick={() => {
                  router.push(`/random-pick/${row.id}`);
                }}
              >
                <TableCell>
                  <div
                    className="flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Checkbox
                      aria-label="Select row"
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={(checked) => {
                        setSelectedRows(
                          checked
                            ? [...selectedRows, row.id]
                            : selectedRows.filter((id) => id !== row.id),
                        );
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  {row.pickType === 'names' ? '이름' : '번호'}
                </TableCell>
                <TableCell className="text-center">
                  {row.pickList.length}
                </TableCell>
                <TableCell className="text-center">
                  <OptionBadge option={row.options.isExcludingSelected} />
                </TableCell>
                <TableCell className="text-center">
                  <OptionBadge option={row.options.isHideResult} />
                </TableCell>
                <TableCell className="text-center">
                  <OptionBadge option={row.options.isMixingAnimation} />
                </TableCell>
                <TableCell>
                  {format(new Date(row.createdAt), 'yyyy-MM-dd')}
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
