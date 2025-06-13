import useLocalStorage from '@/hooks/useLocalStorage';
import { creatId } from '@/utils/createNanoid';
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
import {
  PickType,
  RandomPickType,
  InnerPickListType,
} from '../random-pick-provider/random-pick-provider';
import SettingPickType from '../random-pick-setting/setting-pick-type/setting-pick-type';

export default function RandomPickList() {
  const [randomPickList, setRandomPickList] = useLocalStorage<RandomPickType[]>(
    'random-pick-list',
    [],
  );
  const [isOpen, setIsOpen] = useState(false);

  const updateRandomPickList = (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => {
    setRandomPickList((prev) => [
      ...prev,
      {
        id: creatId(),
        createdAt: new Date().toISOString(),
        title: '새로운 랜덤뽑기',
        pickType,
        pickList,
        options: {
          isExcludingSelected: true,
          isHideResult: true,
          isMixingAnimation: true,
        },
      },
    ]);

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
          <SettingPickType updateRandomPickList={updateRandomPickList} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
