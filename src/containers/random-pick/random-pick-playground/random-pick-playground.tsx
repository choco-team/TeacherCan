import { Input } from '@/components/input';
import { useState } from 'react';
import PlaygroundModal from './playgrund-modal/playground-modal';
import CardList from './playground-card-list/playground-card-list';

const RANDOM_PICK_NAME_MAX_LENGTH = 20;

export default function PlayGround() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const triggerOpenModal = (state: boolean) => {
    setIsOpenModal(state);
  };

  return (
    <div className="mt-8 flex flex-col p-4">
      <div className="p-4 flex flex-row gap-4 w-full">
        <Input
          type="text"
          maxLength={RANDOM_PICK_NAME_MAX_LENGTH}
          placeholder="랜덤뽑기 이름"
          className="max-w-sm h-10 text-xl text-start rounded-xl font-extrabold p-4 flex-1"
        />
        <PlaygroundModal triggerOpenModal={triggerOpenModal} />
      </div>
      <CardList isOpenModal={isOpenModal} />
    </div>
  );
}
