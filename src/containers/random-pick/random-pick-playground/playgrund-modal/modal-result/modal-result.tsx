import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { MODAL_STATE_TYPES } from '@/containers/random-pick/random-pick-playground-provider.tsx/random-pick-playground-provider.constans';
import ResultCard from '../../playground-card/playground-result-card';

export default function ResultModal() {
  const { winners, numberOfPick } = useRandomPickPlaygroundState();
  const { selectModalState, runPick } = useRandomPickPlaygroundAction();

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => runPick()}>다시뽑기 ({numberOfPick}명)</Button>
        <button
          type="button"
          onClick={() => selectModalState(MODAL_STATE_TYPES.noModal)}
        >
          <XIcon className="size-6" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        {winners.map((winner) => (
          <ResultCard key={winner.id} winner={winner} />
        ))}
      </div>
    </div>
  );
}