import { Plus, XIcon } from 'lucide-react';
import { InnerPickListType } from '../../random-pick-provider/random-pick-provider';
import { useRandomPickPlaygroundAction } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import Card from './playground-card';

type CardProps = {
  card: InnerPickListType;
};
export default function MainCard({ card }: CardProps) {
  const { handleCardUsed } = useRandomPickPlaygroundAction();

  return (
    <div className="relative">
      <button
        className="size-4 absolute top-0 right-0 z-10"
        type="button"
        onClick={() => handleCardUsed(card.id)}
      >
        {card.isUsed ? (
          <XIcon className="size-3" />
        ) : (
          <Plus className="size-3" />
        )}
      </button>
      {card.isPicked && (
        <div className="absolute top-0 flex h-10 w-full items-center justify-center opacity-30 bg-black rounded-lg text-white">
          당첨
        </div>
      )}
      {card.isUsed ? (
        <Card title={card.value} />
      ) : (
        <div className="h-10 w-full flex items-center justify-center rounded-lg border-4 border-solid border-primary ">
          <span>{card.value}</span>
        </div>
      )}
    </div>
  );
}
