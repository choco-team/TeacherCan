import { useEffect, useRef, useState } from 'react';
import ResultModal from './result-modal/result-modal';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';
import type { WinnersType } from '../random-pick-playground-provider.tsx/random-pick-playground-provider';
import CardList from './card-list/card-list';
import WhilePlaySettings from './while-play-settings/while-play-settings';
import PickButton from './pick-button/pick-button';

type Props = {
  makeNewPlay: () => void;
};

export default function PlayGround({ makeNewPlay }: Props) {
  const [title, setTitle] = useState('');
  const [newWinners, setNewWinners] = useState<WinnersType[]>([]);
  const [isOpenResult, setIsOpenResult] = useState(false);
  const [isMixingCards, setsMixingCards] = useState(false);

  const cardListRef = useRef<HTMLDivElement>(null);

  const {
    options: { isMixingAnimation },
  } = useRandomPickState();

  const openResult = () => {
    if (isMixingAnimation) {
      setsMixingCards(true);
      return;
    }
    setIsOpenResult(true);
  };

  const closeResult = () => {
    setNewWinners([]);
    setIsOpenResult(false);
  };

  const toggleResultOpen = (open: boolean) => {
    if (open) {
      openResult();
    } else {
      closeResult();
    }
  };

  useEffect(() => {
    if (isMixingCards) {
      setTimeout(() => {
        setsMixingCards(false);
        setIsOpenResult(true);
      }, 1000);
    }
  }, [isMixingCards]);

  return (
    <div ref={cardListRef} className="relative flex flex-col gap-y-6">
      <WhilePlaySettings
        title={title}
        setTitle={setTitle}
        makeNewPlay={makeNewPlay}
      />
      <CardList isMixingCards={isMixingCards} />
      <PickButton
        setNewWinners={setNewWinners}
        openResult={() => toggleResultOpen(true)}
      />

      <ResultModal
        isOpenResult={isOpenResult}
        title={title}
        newWinners={newWinners}
        toggleResultOpen={toggleResultOpen}
      />
    </div>
  );
}
