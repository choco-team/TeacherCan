import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { XIcon } from 'lucide-react';
import { useRandomPickState } from '@/containers/random-pick/random-pick-provider/random-pick-provider.hooks';
import { Button } from '@/components/button';
import Card from '../../playground-card/playground-card';

export default function ResultModal() {
  const { pickList, pickType } = useRandomPickState();
  const { winners, numberOfPick } = useRandomPickPlaygroundState();
  const { closeModal, executePick } = useRandomPickPlaygroundAction();

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => executePick()}>
          다시뽑기 ({numberOfPick}명)
        </Button>
        <button type="button" onClick={closeModal}>
          <XIcon className="size-6" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        {winners.sort().map((i) => (
          <Card key={i} title={pickList[pickType][i].value} />
        ))}
      </div>
    </div>
  );
}
