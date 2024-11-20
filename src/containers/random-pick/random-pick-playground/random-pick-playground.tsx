import { Input } from '@/components/input';
import { useState } from 'react';
import PlaygroundModal from './playgrund-modal/playground-modal';
import CardList from './playground-card-list/playground-card-list';

const RANDOM_PICK_NAME_MAX_LENGTH = 20;

export default function PlayGround() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState('');

  const triggerOpenModal = (state: boolean) => {
    setIsOpenModal(state);
  };

  return (
    <div className="mt-8 flex flex-col p-4">
      <div className="p-4 flex flex-row gap-4 w-full">
        <Input
          type="text"
          maxLength={RANDOM_PICK_NAME_MAX_LENGTH}
          placeholder="랜덤뽑기 제목"
          className="max-w-sm text-md text-start p-4 flex-1"
          onChange={(e) => setTitle(e.target.value)}
        />
        <PlaygroundModal triggerOpenModal={triggerOpenModal} title={title} />
      </div>
      <CardList isOpenModal={isOpenModal} />
    </div>
  );
}
