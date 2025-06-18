import { useEffect, useRef, useState } from 'react';
import { cn } from '@/styles/utils';
import Card from '../card/card';
import { useRandomPickPlaygroundState } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

type Props = {
  isMixingCards: boolean;
};

const INTERVAL_TIME = {
  INITIAL: 50,
  MAX: 5000,
};

export default function CardList({ isMixingCards }: Props) {
  const cardMixRef = useRef<NodeJS.Timeout | null>(null);

  const { randomPick } = useRandomPickPlaygroundState();
  const winners = randomPick.pickList.filter((item) => item.isPicked);
  const winnerIds = winners.map(({ id }) => id);

  const [students, setStudents] = useState(randomPick.pickList);
  const [intervalTime, setIntervalTime] = useState(INTERVAL_TIME.INITIAL);

  useEffect(() => {
    if (isMixingCards) {
      cardMixRef.current = setInterval(() => {
        setStudents((prev) => [...prev].sort(() => Math.random() - 0.5));
        setIntervalTime((prev) => Math.min(prev * 20, INTERVAL_TIME.MAX));
      }, intervalTime);
    } else {
      clearInterval(cardMixRef.current);
      setIntervalTime(INTERVAL_TIME.INITIAL);
    }
    return () => {
      clearInterval(cardMixRef.current);
      setIntervalTime(INTERVAL_TIME.INITIAL);
    };
  }, [isMixingCards, intervalTime]);

  useEffect(() => {
    setStudents(randomPick.pickList);
  }, [randomPick.pickList]);

  return (
    <div
      className={cn(
        'flex-grow grid gap-2 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 content-start',
        'mb-36 lg:mb-24',
      )}
    >
      {(isMixingCards ? students : randomPick.pickList).map(({ id, value }) => (
        <Card
          key={id}
          title={value}
          isWinner={winnerIds.includes(id)}
          isMixingCards={isMixingCards}
          isExcludingSelected={randomPick.options.isExcludingSelected}
        />
      ))}
    </div>
  );
}
