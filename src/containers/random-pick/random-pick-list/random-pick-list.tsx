import { Heading1 } from '@/components/heading';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RandomPickListInner } from './random-pick-list-inner';
import { PickType, InnerPickListType } from '../random-pick-type';
import SettingPickType from './random-pick-setting/setting-pick-type/setting-pick-type';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

const MAX_RANDOM_PICK_COUNT = 5;

export default function RandomPickList() {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { randomPickList } = useRandomPickPlaygroundState();

  const { createRandomPick, removeRandomPick } =
    useRandomPickPlaygroundAction();

  const handleOpenDialog = () => {
    if (randomPickList.length >= MAX_RANDOM_PICK_COUNT) {
      toast({
        title: `랜덤뽑기는 최대 ${MAX_RANDOM_PICK_COUNT}개까지 만들 수 있습니다.`,
        variant: 'error',
      });

      return;
    }
    setIsOpen(true);
  };

  const handleCreateRandomPick = (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => {
    createRandomPick(pickType, pickList);
    setIsOpen(false);
  };

  const handleRemoveRandomPick = () => {
    setSelectedRows([]);
    removeRandomPick(selectedRows);
    setIsRemoveOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <Heading1 className="mb-6">랜덤뽑기 목록</Heading1>
        <Button variant="primary" size="sm" onClick={handleOpenDialog}>
          랜덤뽑기 만들기
        </Button>
      </div>
      <div className="flex flex-col gap-y-8">
        <RandomPickListInner
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        {selectedRows.length > 0 ? (
          <Button
            variant="gray-outline"
            size="sm"
            className="w-fit self-center animate-fade-in"
            onClick={() => setIsRemoveOpen(true)}
          >
            선택한 랜덤뽑기 삭제하기
          </Button>
        ) : null}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>랜덤뽑기 만들기</DialogTitle>
          </DialogHeader>
          <SettingPickType onCreateRandomPick={handleCreateRandomPick} />
        </DialogContent>
      </Dialog>
      <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>랜덤뽑기 삭제하기</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            선택한 랜덤뽑기를 삭제하시겠습니까? 삭제된 랜덤뽑기는 복구할 수
            없습니다.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="gray-ghost"
              size="sm"
              onClick={() => setIsRemoveOpen(false)}
              className="w-[120px]"
            >
              취소
            </Button>
            <Button
              variant="red"
              size="sm"
              className="w-[120px]"
              onClick={handleRemoveRandomPick}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
