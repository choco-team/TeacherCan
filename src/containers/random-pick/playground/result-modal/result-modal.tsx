import { useState } from 'react';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/dialog';
import type { WinnersType } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider';
import ResultCard from '../result-card/result-card';
import { useRandomPickPlaygroundState } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

type Props = {
  isOpenResult: boolean;
  title: string;
  newWinners: WinnersType[];
  toggleResultOpen: (open: boolean) => void;
};

export default function ResultModal({
  isOpenResult,
  title,
  newWinners,
  toggleResultOpen,
}: Props) {
  const [openCards, setOpenCards] = useState([]);

  const { randomPick } = useRandomPickPlaygroundState();

  const isAllOpen = openCards.length === newWinners.length;

  const handleOpenOne = (id: string) => {
    setOpenCards((prev) => [...prev, id]);
  };

  const handleOpenAll = () => {
    setOpenCards(newWinners.map(({ id }) => id));
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setOpenCards([]);
    }
    toggleResultOpen(open);
  };

  return (
    <Dialog open={isOpenResult} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%] h-[80%] flex flex-col items-center overflow-auto transition-none">
        <DialogTitle className="self-start">
          {title || '랜덤뽑기 결과'}
        </DialogTitle>
        <div className="flex-grow w-full flex items-center justify-center flex-wrap gap-6 py-8">
          {newWinners.map((newWinner) => (
            <ResultCard
              key={newWinner.id}
              winner={newWinner}
              isOpen={
                !randomPick.options.isHideResult ||
                openCards.includes(newWinner.id)
              }
              handleOpenOne={handleOpenOne}
            />
          ))}
        </div>

        <DialogFooter>
          {randomPick.options.isHideResult && !isAllOpen ? (
            <Button
              size="lg"
              className="p-10 rounded-2xl text-3xl hover:scale-105 active:scale-95"
              onClick={handleOpenAll}
            >
              모두 뒤집기
            </Button>
          ) : (
            <Button
              size="lg"
              className="p-10 rounded-2xl text-3xl hover:scale-105 active:scale-95"
              onClick={() => onOpenChange(false)}
            >
              다시 뽑기
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
