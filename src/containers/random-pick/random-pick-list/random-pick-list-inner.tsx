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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RandomPickType } from '../random-pick-provider/random-pick-provider';
import OptionBadge from './optionBadge/optionBadge';

interface RandomPickListInnerProps {
  data: RandomPickType[];
}

export function RandomPickListInner({ data }: RandomPickListInnerProps) {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 font-semibold">
          <TableHead className="w-[40px] h-12">
            <div className="flex items-center justify-center">
              <Checkbox
                aria-label="Select all rows"
                checked={selectedRows.length === data.length}
                onCheckedChange={(checked) => {
                  setSelectedRows(checked ? data.map((row) => row.id) : []);
                }}
              />
            </div>
          </TableHead>
          <TableHead className="min-w-[240px] w-[240px]">제목</TableHead>
          <TableHead className="w-[96px]">뽑기 타입</TableHead>
          <TableHead className="w-[96px] text-center">학생 수</TableHead>
          <TableHead className="w-[144px] text-center">
            뽑힌 학생 제외
          </TableHead>
          <TableHead className="w-[144px] text-center">결과 숨기기</TableHead>
          <TableHead className="w-[144px] text-center">
            카드 섞기 효과
          </TableHead>
          <TableHead className="w-[192px]">생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map((row) => (
            <TableRow
              key={row.id}
              className="h-12 cursor-pointer"
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
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="h-32 text-center">
              <span className="text-text-description">
                아직 랜덤뽑기가 없어요! 랜덤뽑기를 만들어보세요.
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
