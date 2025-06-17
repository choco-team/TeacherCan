import { Heading1 } from '@/components/heading';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { useState } from 'react';
import { RandomPickListInner } from './random-pick-list-inner';
import { PickType, InnerPickListType } from '../random-pick-type';
import SettingPickType from './random-pick-setting/setting-pick-type/setting-pick-type';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

export default function RandomPickList() {
  const [isOpen, setIsOpen] = useState(false);
  const { randomPickList } = useRandomPickPlaygroundState();
  const { createRandomPick } = useRandomPickPlaygroundAction();

  const handleCreateRandomPick = (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => {
    createRandomPick(pickType, pickList);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <Heading1 className="mb-6">랜덤뽑기 목록</Heading1>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
          랜덤뽑기 만들기
        </Button>
      </div>
      <RandomPickListInner data={randomPickList ?? []} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>랜덤뽑기 만들기</DialogTitle>
          </DialogHeader>
          <SettingPickType onCreateRandomPick={handleCreateRandomPick} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
