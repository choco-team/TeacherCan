import { useEffect, useRef, useState } from 'react';
import ResultModal from './result-modal/result-modal';
import CardList from './card-list/card-list';
import WhilePlaySettings from './while-play-settings/while-play-settings';
import PickButton from './pick-button/pick-button';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

export default function PlayGround() {
  const { randomPick } = useRandomPickPlaygroundState();
  const { updateTitle } = useRandomPickPlaygroundAction();
  const { title } = randomPick;

  const [isOpenResult, setIsOpenResult] = useState(false);
  const [isMixingCards, setsMixingCards] = useState(false);

  const cardListRef = useRef<HTMLDivElement>(null);

  const openResult = () => {
    if (randomPick.options.isMixingAnimation) {
      setsMixingCards(true);
      return;
    }
    setIsOpenResult(true);
  };

  const closeResult = () => {
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
    <div ref={cardListRef} className="flex-grow relative flex flex-col gap-y-6">
      <WhilePlaySettings title={title} updateTitle={updateTitle} />
      <CardList isMixingCards={isMixingCards} />
      <PickButton openResult={() => toggleResultOpen(true)} />
      <ResultModal
        isOpenResult={isOpenResult}
        title={title}
        toggleResultOpen={toggleResultOpen}
      />
    </div>
  );
}
