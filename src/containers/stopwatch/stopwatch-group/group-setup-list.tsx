'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { Checkbox } from '@/components/checkbox';
import { Badge } from '@/components/badge';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useGroupStopwatchState,
  useGroupStopwatchAction,
} from './stopwatch-group-provider.hooks';
import GroupCreateModal from './group-create-modal';
import GroupDeleteModal from './group-delete-modal';

export default function GroupSetupList() {
  const { savedGroups } = useGroupStopwatchState();
  const { deleteGroups } = useGroupStopwatchAction();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  // 그룹 생성 제한 상수
  const MAX_GROUPS = 5;
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(
      checked && savedGroups ? savedGroups.map((group) => group.id) : [],
    );
  };

  const handleSelectRow = (groupId: string, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? [...prev, groupId] : prev.filter((id) => id !== groupId),
    );
  };

  const handleCreateNew = () => {
    // 그룹 개수 제한 확인
    if (savedGroups && savedGroups.length >= MAX_GROUPS) {
      toast({
        title: '그룹 생성 제한',
        description: '스톱워치 그룹은 최대 5개까지 만들 수 있습니다.',
        variant: 'error',
      });
      return;
    }

    setIsCreateModalOpen(true);
  };

  const handleCreateComplete = () => {
    // 그룹 생성 완료 후 필요한 로직 (예: 새로고침, 알림 등)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-title">
          스톱워치 그룹 목록
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="primary-ghost"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedRows.length === 0}
          >
            삭제하기
          </Button>
          <Button onClick={handleCreateNew} variant="primary">
            새 스톱워치 그룹 만들기
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 dark:bg-muted-foreground/50 font-semibold text-text-title">
            <TableHead className="w-[40px] h-12">
              <div className="flex items-center justify-center">
                <Checkbox
                  aria-label="Select all rows"
                  checked={
                    savedGroups &&
                    savedGroups.length > 0 &&
                    selectedRows.length === savedGroups.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </div>
            </TableHead>
            <TableHead className="w-full text-text-title">그룹 이름</TableHead>
            <TableHead className="w-[200px] text-center text-text-title">
              타이머 수
            </TableHead>
            <TableHead className="w-[200px] text-text-title">생성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedGroups === null && (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center p-0">
                <Skeleton className="h-32 w-full rounded-none" />
              </TableCell>
            </TableRow>
          )}

          {savedGroups !== null && savedGroups.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <span className="text-text-description">
                  아직 그룹 스톱워치가 없어요! 그룹 스톱워치를 만들어보세요.
                </span>
              </TableCell>
            </TableRow>
          )}

          {savedGroups !== null &&
            savedGroups.length > 0 &&
            savedGroups.map((group) => (
              <TableRow
                key={group.id}
                className="h-12 cursor-pointer text-text-title"
                onClick={() => router.push(`/group-stopwatch/${group.id}`)}
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
                      checked={selectedRows.includes(group.id)}
                      onCheckedChange={(checked) => {
                        handleSelectRow(group.id, checked as boolean);
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{group.title}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="primary">{group.timers.length}개</Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(group.createdAt), 'yyyy-MM-dd')}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <GroupCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onComplete={handleCreateComplete}
      />

      <GroupDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onComplete={() => {
          setIsDeleteModalOpen(false);
          deleteGroups(selectedRows);
        }}
      />
    </div>
  );
}
